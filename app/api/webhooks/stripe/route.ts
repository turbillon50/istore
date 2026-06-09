import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/resend'
import { triggerWorkflow, WORKFLOWS } from '@/lib/n8n-workflows'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2025-02-24.acacia',
  })
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Stripe Webhook] Signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(intent)
        break
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(intent)
        break
      }

      case 'payment_intent.canceled': {
        const intent = event.data.object as Stripe.PaymentIntent
        await handlePaymentCanceled(intent)
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        console.warn('[Stripe] Dispute created:', dispute.id, dispute.amount)
        break
      }

      default:
        console.log('[Stripe Webhook] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const orderId = intent.metadata?.orderId

  if (!orderId) {
    console.warn('[Stripe] PaymentIntent missing orderId metadata:', intent.id)
    return
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paidAt: new Date(),
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

  // Record payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'STRIPE',
      reference: intent.id,
      amount: intent.amount / 100,
      currency: intent.currency.toUpperCase(),
      status: 'COMPLETED',
      method: intent.payment_method_types[0] ?? 'card',
      processedAt: new Date(),
      metadata: { intentId: intent.id, charges: intent.latest_charge },
    },
  })

  // Release inventory reservation (convert reserved to actual deduction)
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

  // Send confirmation email
  await sendOrderConfirmation(order as unknown as Parameters<typeof sendOrderConfirmation>[0])

  // Trigger n8n workflow
  await triggerWorkflow(WORKFLOWS.PURCHASE_COMPLETE, {
    orderId: order.id,
    customerEmail: order.user?.email ?? '',
    items: order.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      price: Number(i.unitPrice),
    })),
    total: Number(order.total),
  })
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  const orderId = intent.metadata?.orderId

  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'FAILED',
    },
  })

  // Release inventory reservation
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

  // Record failed payment attempt
  await prisma.payment.create({
    data: {
      orderId,
      provider: 'STRIPE',
      reference: intent.id,
      amount: intent.amount / 100,
      currency: intent.currency.toUpperCase(),
      status: 'FAILED',
      method: intent.payment_method_types[0] ?? 'card',
      metadata: {
        intentId: intent.id,
        lastError: intent.last_payment_error?.message,
      },
    },
  })
}

async function handlePaymentCanceled(intent: Stripe.PaymentIntent) {
  const orderId = intent.metadata?.orderId

  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CANCELLED',
      paymentStatus: 'CANCELLED',
    },
  })

  // Release reservation
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
}
