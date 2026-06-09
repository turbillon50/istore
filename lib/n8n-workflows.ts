// --- n8n Workflow Trigger Utilities ------------------------------------------

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!

// --- Workflow IDs -------------------------------------------------------------

export const WORKFLOWS = {
  PURCHASE_COMPLETE: 'purchase-complete',
  ABANDONED_CART: 'abandoned-cart',
  SERVICE_REQUEST: 'service-request',
  QUOTE_CREATED: 'quote-created',
  LOW_STOCK_ALERT: 'low-stock-alert',
  LEAD_CAPTURED: 'lead-captured',
} as const

export type WorkflowId = (typeof WORKFLOWS)[keyof typeof WORKFLOWS]

// --- Payload Schemas ----------------------------------------------------------

export interface PurchaseCompletePayload {
  orderId: string
  customerEmail: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
}

export interface AbandonedCartPayload {
  sessionId: string
  items: Array<{ productId: string; name: string; price: number; quantity: number }>
  customerEmail: string
}

export interface ServiceRequestPayload {
  folio: string
  device: string
  issue: string
  customerPhone: string
}

export interface QuoteCreatedPayload {
  quoteId: string
  items: Array<{ name: string; quantity: number; price: number }>
  customerEmail: string
}

export interface LowStockAlertPayload {
  productId: string
  sku: string
  currentStock: number
  minStock: number
}

export interface LeadCapturedPayload {
  name: string
  email: string
  phone: string
  source: string
}

type WorkflowPayloadMap = {
  [WORKFLOWS.PURCHASE_COMPLETE]: PurchaseCompletePayload
  [WORKFLOWS.ABANDONED_CART]: AbandonedCartPayload
  [WORKFLOWS.SERVICE_REQUEST]: ServiceRequestPayload
  [WORKFLOWS.QUOTE_CREATED]: QuoteCreatedPayload
  [WORKFLOWS.LOW_STOCK_ALERT]: LowStockAlertPayload
  [WORKFLOWS.LEAD_CAPTURED]: LeadCapturedPayload
}

// --- Core Trigger Function ----------------------------------------------------

export async function triggerWorkflow<T extends WorkflowId>(
  workflowId: T,
  data: WorkflowPayloadMap[T],
): Promise<{ success: boolean; error?: string }> {
  if (!N8N_WEBHOOK_URL) {
    console.warn('[n8n] N8N_WEBHOOK_URL not configured — skipping workflow:', workflowId)
    return { success: false, error: 'N8N_WEBHOOK_URL not configured' }
  }

  const url = `${N8N_WEBHOOK_URL.replace(/\/$/, '')}/${workflowId}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_API_KEY
          ? { Authorization: `Bearer ${process.env.N8N_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        workflowId,
        triggeredAt: new Date().toISOString(),
        data,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[n8n] Workflow ${workflowId} trigger failed: ${res.status}`, text)
      return { success: false, error: `HTTP ${res.status}` }
    }

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[n8n] Workflow ${workflowId} trigger error:`, message)
    return { success: false, error: message }
  }
}

// --- Convenience Helpers ------------------------------------------------------

export const n8n = {
  purchaseComplete: (data: PurchaseCompletePayload) =>
    triggerWorkflow(WORKFLOWS.PURCHASE_COMPLETE, data),

  abandonedCart: (data: AbandonedCartPayload) =>
    triggerWorkflow(WORKFLOWS.ABANDONED_CART, data),

  serviceRequest: (data: ServiceRequestPayload) =>
    triggerWorkflow(WORKFLOWS.SERVICE_REQUEST, data),

  quoteCreated: (data: QuoteCreatedPayload) =>
    triggerWorkflow(WORKFLOWS.QUOTE_CREATED, data),

  lowStockAlert: (data: LowStockAlertPayload) =>
    triggerWorkflow(WORKFLOWS.LOW_STOCK_ALERT, data),

  leadCaptured: (data: LeadCapturedPayload) =>
    triggerWorkflow(WORKFLOWS.LEAD_CAPTURED, data),
}
