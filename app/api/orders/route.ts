import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getOrders } from '@/lib/db'
import { z } from 'zod'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SELLER']

// GET /api/orders

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isAdmin = ADMIN_ROLES.includes(dbUser.role)
    const { searchParams } = req.nextUrl

    const filters = {
      userId: isAdmin ? (searchParams.get('userId') ?? undefined) : dbUser.id,
      status: searchParams.get('status') ?? undefined,
      paymentStatus: searchParams.get('paymentStatus') ?? undefined,
      search: isAdmin ? (searchParams.get('search') ?? undefined) : undefined,
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
      page: Number(searchParams.get('page') ?? 1),
      limit: Math.min(Number(searchParams.get('limit') ?? 20), 100),
    }

    const result = await getOrders(filters)

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/orders error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/orders

const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
})

const createOrderSchema = z.object({
  addressId: z.string(),
  items: z.array(orderItemSchema).min(1),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['STRIPE', 'MERCADOPAGO', 'CASH', 'BANK_TRANSFER', 'FINANCING']),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 422 },
      )
    }

    const { addressId, items, couponCode, notes, paymentMethod } = parsed.data

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: dbUser.id },
    })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
      include: { inventory: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products are unavailable' },
        { status: 422 },
      )
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) continue
      const inv = product.inventory.find((i) =>
        item.variantId ? i.variantId === item.variantId : i.variantId === null,
      )
      const available = inv ? inv.quantity - inv.reserved : 0
      if (available < item.quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for: ' + product.name },
          { status: 422 },
        )
      }
    }

    let discountAmount = 0
    let appliedCouponCode: string | undefined
    let appliedCouponId: string | undefined

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
        },
      })

      if (coupon) {
        const subtotalForCoupon = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
        discountAmount =
          coupon.discountType === 'PERCENTAGE'
            ? subtotalForCoupon * (Number(coupon.discountValue) / 100)
            : Number(coupon.discountValue)
        appliedCouponCode = coupon.code
        appliedCouponId = coupon.id
      }
    }

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    const shippingAmount = subtotal >= 999 ? 0 : 99
    const taxRate = 0.16
    const taxAmount = (subtotal - discountAmount) * taxRate
    const total = subtotal - discountAmount + shippingAmount + taxAmount

    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()

    const orderItemsData = items.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!
      return {
        productId: item.productId,
        variantId: item.variantId,
        name: prod.name,
        sku: prod.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
      }
    })

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: dbUser.id,
          addressId,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod,
          subtotal,
          discountAmount,
          shippingAmount,
          taxAmount,
          total,
          couponCode: appliedCouponCode,
          notes,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: { select: { name: true, sku: true } },
            },
          },
          address: true,
        },
      })

      for (const item of items) {
        await tx.inventoryItem.updateMany({
          where: {
            productId: item.productId,
            ...(item.variantId ? { variantId: item.variantId } : { variantId: null }),
          },
          data: { reserved: { increment: item.quantity } },
        })
      }

      if (appliedCouponId) {
        await tx.coupon.update({
          where: { id: appliedCouponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      return newOrder
    })

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
