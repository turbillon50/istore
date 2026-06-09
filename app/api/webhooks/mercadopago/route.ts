import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import prisma from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/resend'
import { triggerWorkflow, WORKFLOWS } from '@/lib/n8n-workflows'

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!
const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET!

interface MercadoPagoPayment {
  id: number
  status: 'approved' | 'rejected' | 'pending' | 'in_process' | 'cancelled' | 'refunded'
  status_detail: string
  external_reference: string | null
  transaction_amount: number
  currency_id: string
  payment_method_id: string
  payment_type_id: string
  date_approved: string | null
  metadata?: Record<string, unknown>
}

interface WebhookNotification {
  id: string
  live_mode: boolean
  type: string
  date_created: string
  application_id: number
  user_id: string
  version: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

function verifyMercadoPagoSignature(req: NextRequest, body: string): boolean {
  if (!MP_WEBHOOK_SECRET) return true // Skip verification if secret not configured

  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  const dataId = req.nextUrl.searchParams.get('data.id') ?? ''

  if (!xSignature || !xRequestId) return false

  const parts = xSignature.split(',')
  const ts = parts.find((p) => p.startsWith('ts='))?.split('=')[1]
  const v1 = parts.find((p) => p.startsWith('v1='))?.split('=')[1]

  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const computed = createHmac('sha256', MP_WEBHOOK_SECRET).update(manifest).digest('hex')

  return computed === v1
}

async function fetchMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPayment> {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`MercadoPago API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function POST(req: NextRequest) {
  const body = await req.text()

  if (!verifyMercadoPagoSignature(req, body)) {
    console.warn('[MercadoPago] Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let notification: WebhookNotification

  try {
    notification = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    if (notification.type === 'payment') {
      const paymentId = notification.data.id
      const payment = await fetchMercadoPagoPayment(paymentId)

      switch (payment.status) {
        case 'approved':
          await handlePaymentApproved(payment)
          break
        case 'rejected':
        case 'cancelled':
          await handlePaymentRejected(payment)
          break
        case 'pending':
        case 'in_process':
          await handlePaymentPending(payment)
          break
        case 'refunded':
          await handlePaymentRefunded(payment)
          break
        default:
          console.log('[MercadoPago] Unhandled payment status:', payment.status)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[MercadoPago Webhook] Processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentApproved(payment: MercadoPagoPayment) {
  const orderId = payment.external_reference

  if (!orderId) {
    console.warn('[MercadoPago] Payment without external_reference:', payment.id)
    return
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paidAt: new Date(payment.date_approved ?? new Date()),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, sku: true } },
        },
      },
      address: true,
    },
  })

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'MERCADOPAGO',
      reference: String(payment.id),
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      status: 'COMPLETED',
      method: payment.payment_method_id,
      processedAt: new Date(payment.date_approved ?? new Date()),
      metadata: {
        paymentId: payment.id,
        statusDetail: payment.status_detail,
        paymentType: payment.payment_type_id,
      },
    },
  })

  // Deduct inventory
  for (const item of order.items) {
    await prisma.inventoryItem.updateMany({
      where: {
        productId: item.productId,
        ...(item.variantId ? { variantId: item.variantId } : { variantId: null }),
      },
      data: {
        quantity: { decrement: item.quantity },
        reserved: { decrement: item.quantity },
      },
    })
  }

  await sendOrderConfirmation(order as Parameters<typeof sendOrderConfirmation>[0])

  await triggerWorkflow(WORKFLOWS.PURCHASE_COMPLETE, {
    orderId: order.id,
    customerEmail: order.user.email,
    items: order.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      price: Number(i.unitPrice),
    })),
    total: Number(order.total),
  })
}

async function handlePaymentRejected(payment: MercadoPagoPayment) {
  const orderId = payment.external_reference
  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: 'FAILED' },
  })

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })

  if (order) {
    for (const item of order.items) {
      await prisma.inventoryItem.updateMany({
        where: {
          productId: item.productId,
          ...(item.variantId ? { variantId: item.variantId } : { variantId: null }),
        },
        data: { reserved: { decrement: item.quantity } },
      })
    }
  }

  await prisma.payment.create({
    data: {
      orderId,
      provider: 'MERCADOPAGO',
      reference: String(payment.id),
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      status: 'FAILED',
      method: payment.payment_method_id,
      metadata: {
        paymentId: payment.id,
        statusDetail: payment.status_detail,
        paymentType: payment.payment_type_id,
      },
    },
  })
}

async function handlePaymentPending(payment: MercadoPagoPayment) {
  const orderId = payment.external_reference
  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: 'PENDING' },
  })
}

async function handlePaymentRefunded(payment: MercadoPagoPayment) {
  const orderId = payment.external_reference
  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: 'REFUNDED', status: 'REFUNDED' },
  })

  await prisma.payment.create({
    data: {
      orderId,
      provider: 'MERCADOPAGO',
      reference: String(payment.id),
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      status: 'REFUNDED',
      method: payment.payment_method_id,
      metadata: {
        paymentId: payment.id,
        statusDetail: payment.status_detail,
      },
    },
  })
}
