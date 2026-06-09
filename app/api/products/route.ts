import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getProducts } from '@/lib/db'
import { z } from 'zod'

// ─── GET /api/products ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl

    const filters = {
      category: searchParams.get('category') ?? undefined,
      brand: searchParams.get('brand') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: Math.min(Number(searchParams.get('limit') ?? 20), 100),
      sortBy: (searchParams.get('sortBy') as 'price' | 'name' | 'createdAt' | 'stock') ?? 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc',
    }

    const result = await getProducts(filters)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── POST /api/products ───────────────────────────────────────────────────────

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  sku: z.string().min(1).max(100),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'OUT_OF_STOCK', 'DISCONTINUED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  weight: z.number().optional(),
  specs: z.record(z.unknown()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    })

    if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = createProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 422 },
      )
    }

    const data = parsed.data

    const slug =
      data.slug ??
      data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku: data.sku }] },
      select: { id: true, slug: true, sku: true },
    })

    if (existing) {
      const field = existing.slug === slug ? 'slug' : 'sku'
      return NextResponse.json(
        { error: `A product with this ${field} already exists` },
        { status: 409 },
      )
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        description: data.description,
        shortDesc: data.shortDescription,
        basePrice: data.basePrice,
        comparePrice: data.compareAtPrice,
        costPrice: data.costPrice,
        categoryId: data.categoryId,
        brandId: data.brandId,
        status: data.status as any,
        isFeatured: data.isFeatured,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        weight: data.weight,
        specs: data.specs ?? {},
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/products]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
