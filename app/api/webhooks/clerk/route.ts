import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { sendWelcome } from '@/lib/resend'
import { triggerWorkflow, WORKFLOWS } from '@/lib/n8n-workflows'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  let event: WebhookEvent

  try {
    const wh = new Webhook(webhookSecret)
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Clerk Webhook] Signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data)
        break

      case 'user.updated':
        await handleUserUpdated(event.data)
        break

      case 'user.deleted':
        await handleUserDeleted(event.data)
        break

      default:
        console.log('[Clerk Webhook] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Clerk Webhook] Processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleUserCreated(data: WebhookEvent['data'] & { object: 'user' }) {
  if (!('id' in data)) return

  const primaryEmail = data.email_addresses?.find(
    (e: { id: string; email_address: string }) => e.id === data.primary_email_address_id,
  )?.email_address

  const primaryPhone = data.phone_numbers?.find(
    (p: { id: string; phone_number: string }) => p.id === data.primary_phone_number_id,
  )?.phone_number

  if (!primaryEmail) {
    console.warn('[Clerk] User created without email:', data.id)
    return
  }

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null

  const user = await prisma.user.create({
    data: {
      clerkId: data.id,
      email: primaryEmail,
      name: fullName,
      phone: primaryPhone ?? null,
      avatar: data.image_url ?? null,
      role: 'CUSTOMER',
      emailVerified: data.email_addresses?.find(
        (e: { id: string; email_address: string; verification?: { status: string } }) =>
          e.id === data.primary_email_address_id,
      )?.verification?.status === 'verified',
      isActive: true,
    },
  })

  // Create loyalty account
  await prisma.loyaltyAccount.create({
    data: {
      userId: user.id,
      points: 0,
      tier: 'BRONZE',
    },
  })

  // Send welcome email
  await sendWelcome({ id: user.id, name: user.name ?? 'Cliente', email: user.email })

  // Trigger n8n lead capture workflow
  await triggerWorkflow(WORKFLOWS.LEAD_CAPTURED, {
    name: user.name ?? '',
    email: user.email,
    phone: user.phone ?? '',
    source: 'clerk_signup',
  })
}

async function handleUserUpdated(data: WebhookEvent['data'] & { object: 'user' }) {
  if (!('id' in data)) return

  const primaryEmail = data.email_addresses?.find(
    (e: { id: string; email_address: string }) => e.id === data.primary_email_address_id,
  )?.email_address

  const primaryPhone = data.phone_numbers?.find(
    (p: { id: string; phone_number: string }) => p.id === data.primary_phone_number_id,
  )?.phone_number

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null

  const existing = await prisma.user.findUnique({
    where: { clerkId: data.id },
  })

  if (!existing) {
    console.warn('[Clerk] user.updated for unknown user:', data.id)
    return
  }

  await prisma.user.update({
    where: { clerkId: data.id },
    data: {
      ...(primaryEmail ? { email: primaryEmail } : {}),
      name: fullName,
      phone: primaryPhone ?? existing.phone,
      avatar: data.image_url ?? existing.avatar,
      emailVerified:
        data.email_addresses?.find(
          (e: { id: string; verification?: { status: string } }) =>
            e.id === data.primary_email_address_id,
        )?.verification?.status === 'verified',
      updatedAt: new Date(),
    },
  })
}

async function handleUserDeleted(data: WebhookEvent['data']) {
  if (!('id' in data) || !data.id) return

  await prisma.user.update({
    where: { clerkId: data.id },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  })
}
