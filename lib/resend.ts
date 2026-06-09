import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM ?? 'iStore Pro <noreply@istore.pro>'
const STORE_NAME = 'iStore Pro'
const STORE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://istore.pro'

// ─── Shared Styles ────────────────────────────────────────────────────────────

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  color: #111827;
`
const headerStyle = `
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 32px 40px;
  border-radius: 12px 12px 0 0;
`
const bodyStyle = `
  padding: 32px 40px;
  background: #f9fafb;
`
const footerStyle = `
  padding: 24px 40px;
  background: #1a1a2e;
  border-radius: 0 0 12px 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
`
const buttonStyle = `
  display: inline-block;
  background: #0070f3;
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  margin: 16px 0;
`
const tableStyle = `
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
`
const thStyle = `
  background: #e5e7eb;
  padding: 10px 12px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  color: #6b7280;
`
const tdStyle = `
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
`

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderUser {
  name: string | null
  email: string
}

interface OrderItem {
  product: { name: string; images?: Array<{ url?: string }> }
  quantity: number
  unitPrice: unknown
  totalPrice?: unknown
}

interface OrderAddress {
  street: string
  exterior: string
  interior?: string | null
  colony: string
  city: string
  state: string
  zip: string
}

interface OrderData {
  id: string
  orderNumber: string
  user: OrderUser
  items: OrderItem[]
  subtotal: unknown
  discountAmount?: unknown
  shippingCost: unknown
  taxAmount: unknown
  total: unknown
  address?: OrderAddress | null
  paymentMethod?: string
  createdAt?: Date
}

interface TrackingInfo {
  carrier: string
  trackingNumber: string
  trackingUrl?: string
  estimatedDelivery?: Date
}

interface ServiceData {
  id: string
  folio?: string | null
  user: OrderUser
  device?: string
  issue?: string
  status: string
  updatedAt?: Date
  estimatedCompletion?: Date | null
  notes?: string | null
}

interface QuoteData {
  id: string
  quoteNumber?: string | null
  user: OrderUser
  items: Array<{ product?: { name: string }; name?: string; quantity: number; unitPrice: unknown }>
  total: unknown
  validUntil?: Date | null
  notes?: string | null
}

interface WelcomeUser {
  id: string
  name: string
  email: string
}

// ─── formatCurrency ───────────────────────────────────────────────────────────

function fmt(value: unknown): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

// ─── sendOrderConfirmation ────────────────────────────────────────────────────

export async function sendOrderConfirmation(order: OrderData): Promise<void> {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="${tdStyle}">${item.product.name}</td>
        <td style="${tdStyle}; text-align:center">${item.quantity}</td>
        <td style="${tdStyle}; text-align:right">${fmt(item.unitPrice)}</td>
        <td style="${tdStyle}; text-align:right">${fmt(item.totalPrice ?? Number(item.unitPrice) * item.quantity)}</td>
      </tr>`,
    )
    .join('')

  const addressLine = order.address
    ? `${order.address.street} ${order.address.exterior}${order.address.interior ? ` Int. ${order.address.interior}` : ''}, Col. ${order.address.colony}, ${order.address.city}, ${order.address.state} ${order.address.zip}`
    : 'Retiro en tienda'

  const html = `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#ffffff;margin:0;font-size:24px;">¡Pedido confirmado!</h1>
    <p style="color:#93c5fd;margin:8px 0 0;">Orden ${order.orderNumber}</p>
  </div>
  <div style="${bodyStyle}">
    <p style="font-size:16px;">Hola <strong>${order.user.name ?? 'Cliente'}</strong>,</p>
    <p>Tu pedido ha sido recibido y está siendo procesado. Te notificaremos cuando sea enviado.</p>

    <h3 style="margin-top:24px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Resumen del pedido</h3>
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}">Producto</th>
          <th style="${thStyle}; text-align:center">Qty</th>
          <th style="${thStyle}; text-align:right">Precio</th>
          <th style="${thStyle}; text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table style="width:100%;margin-top:16px;">
      <tr>
        <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
        <td style="padding:4px 0;text-align:right;">${fmt(order.subtotal)}</td>
      </tr>
      ${Number(order.discountAmount ?? 0) > 0 ? `<tr><td style="padding:4px 0;color:#10b981;">Descuento</td><td style="padding:4px 0;text-align:right;color:#10b981;">-${fmt(order.discountAmount)}</td></tr>` : ''}
      <tr>
        <td style="padding:4px 0;color:#6b7280;">Envío</td>
        <td style="padding:4px 0;text-align:right;">${Number(order.shippingCost) === 0 ? 'Gratis' : fmt(order.shippingCost)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;">IVA (16%)</td>
        <td style="padding:4px 0;text-align:right;">${fmt(order.taxAmount)}</td>
      </tr>
      <tr style="border-top:2px solid #111827;">
        <td style="padding:8px 0;font-weight:700;font-size:16px;">Total</td>
        <td style="padding:8px 0;text-align:right;font-weight:700;font-size:16px;">${fmt(order.total)}</td>
      </tr>
    </table>

    <h3 style="margin-top:24px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Dirección de entrega</h3>
    <p style="color:#4b5563;margin:0;">${addressLine}</p>

    <div style="text-align:center;margin-top:32px;">
      <a href="${STORE_URL}/cuenta/pedidos/${order.id}" style="${buttonStyle}">Ver mi pedido</a>
    </div>
  </div>
  <div style="${footerStyle}">
    <p style="margin:0;">${STORE_NAME} &bull; ${STORE_URL}</p>
    <p style="margin:8px 0 0;">Si tienes dudas, responde este correo o visítanos en tienda.</p>
  </div>
</div>`

  await resend.emails.send({
    from: FROM,
    to: order.user.email,
    subject: `Pedido confirmado ${order.orderNumber} — ${STORE_NAME}`,
    html,
  })
}

// ─── sendShippingNotification ─────────────────────────────────────────────────

export async function sendShippingNotification(
  order: OrderData,
  tracking: TrackingInfo,
): Promise<void> {
  const estimatedLine = tracking.estimatedDelivery
    ? `<p style="color:#4b5563;">Entrega estimada: <strong>${tracking.estimatedDelivery.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>`
    : ''

  const html = `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#ffffff;margin:0;font-size:24px;">¡Tu pedido está en camino!</h1>
    <p style="color:#93c5fd;margin:8px 0 0;">Orden ${order.orderNumber}</p>
  </div>
  <div style="${bodyStyle}">
    <p style="font-size:16px;">Hola <strong>${order.user.name ?? 'Cliente'}</strong>,</p>
    <p>Tu pedido ha sido enviado. Aquí están los detalles de rastreo:</p>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;font-weight:600;">Paquetería</p>
      <p style="margin:4px 0 12px;font-size:18px;font-weight:700;">${tracking.carrier}</p>
      <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;font-weight:600;">Número de rastreo</p>
      <p style="margin:4px 0;font-size:20px;font-weight:700;letter-spacing:1px;">${tracking.trackingNumber}</p>
    </div>

    ${estimatedLine}

    ${tracking.trackingUrl ? `<div style="text-align:center;margin:24px 0;"><a href="${tracking.trackingUrl}" style="${buttonStyle}">Rastrear paquete</a></div>` : ''}
  </div>
  <div style="${footerStyle}">
    <p style="margin:0;">${STORE_NAME} &bull; ${STORE_URL}</p>
  </div>
</div>`

  await resend.emails.send({
    from: FROM,
    to: order.user.email,
    subject: `Tu pedido ${order.orderNumber} está en camino — ${STORE_NAME}`,
    html,
  })
}

// ─── sendServiceUpdate ────────────────────────────────────────────────────────

const SERVICE_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente de revisión',
  DIAGNOSING: 'En diagnóstico',
  WAITING_PARTS: 'Esperando refacciones',
  IN_PROGRESS: 'En reparación',
  TESTING: 'En pruebas',
  READY: 'Listo para recoger',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

export async function sendServiceUpdate(service: ServiceData, status: string): Promise<void> {
  const statusLabel = SERVICE_STATUS_LABELS[status] ?? status
  const folio = service.folio ?? service.id.substring(0, 8).toUpperCase()

  const notesSection = service.notes
    ? `<div style="background:#f3f4f6;border-radius:8px;padding:16px;margin-top:16px;"><p style="margin:0;font-size:14px;color:#4b5563;"><strong>Nota del técnico:</strong> ${service.notes}</p></div>`
    : ''

  const estimatedLine =
    service.estimatedCompletion
      ? `<p style="color:#4b5563;">Estimado de entrega: <strong>${service.estimatedCompletion.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></p>`
      : ''

  const html = `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#ffffff;margin:0;font-size:24px;">Actualización de servicio</h1>
    <p style="color:#93c5fd;margin:8px 0 0;">Folio: ${folio}</p>
  </div>
  <div style="${bodyStyle}">
    <p style="font-size:16px;">Hola <strong>${service.user.name ?? 'Cliente'}</strong>,</p>
    <p>El estado de tu dispositivo ha cambiado:</p>

    <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#065f46;font-size:12px;text-transform:uppercase;font-weight:600;">Estado actual</p>
      <p style="margin:4px 0;font-size:20px;font-weight:700;color:#047857;">${statusLabel}</p>
      ${service.device ? `<p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Dispositivo: ${service.device}</p>` : ''}
    </div>

    ${estimatedLine}
    ${notesSection}

    <div style="text-align:center;margin-top:32px;">
      <a href="${STORE_URL}/cuenta/servicios/${service.id}" style="${buttonStyle}">Ver detalles</a>
    </div>
  </div>
  <div style="${footerStyle}">
    <p style="margin:0;">${STORE_NAME} &bull; ${STORE_URL}</p>
  </div>
</div>`

  await resend.emails.send({
    from: FROM,
    to: service.user.email,
    subject: `Actualización de tu servicio ${folio}: ${statusLabel} — ${STORE_NAME}`,
    html,
  })
}

// ─── sendQuote ────────────────────────────────────────────────────────────────

export async function sendQuote(quote: QuoteData): Promise<void> {
  const quoteNumber = quote.quoteNumber ?? quote.id.substring(0, 8).toUpperCase()

  const itemRows = quote.items
    .map(
      (item) => `
      <tr>
        <td style="${tdStyle}">${item.product?.name ?? item.name ?? 'Producto'}</td>
        <td style="${tdStyle}; text-align:center">${item.quantity}</td>
        <td style="${tdStyle}; text-align:right">${fmt(item.unitPrice)}</td>
        <td style="${tdStyle}; text-align:right">${fmt(Number(item.unitPrice) * item.quantity)}</td>
      </tr>`,
    )
    .join('')

  const validLine = quote.validUntil
    ? `<p style="color:#92400e;background:#fef3c7;border-radius:6px;padding:8px 12px;display:inline-block;">Esta cotización es válida hasta el <strong>${quote.validUntil.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>`
    : ''

  const html = `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#ffffff;margin:0;font-size:24px;">Tu cotización está lista</h1>
    <p style="color:#93c5fd;margin:8px 0 0;">Cotización ${quoteNumber}</p>
  </div>
  <div style="${bodyStyle}">
    <p style="font-size:16px;">Hola <strong>${quote.user.name ?? 'Cliente'}</strong>,</p>
    <p>Hemos preparado la siguiente cotización para ti:</p>

    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}">Producto</th>
          <th style="${thStyle}; text-align:center">Qty</th>
          <th style="${thStyle}; text-align:right">Precio Unit.</th>
          <th style="${thStyle}; text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:10px 12px;font-weight:700;font-size:16px;text-align:right;">Total</td>
          <td style="padding:10px 12px;font-weight:700;font-size:16px;text-align:right;">${fmt(quote.total)}</td>
        </tr>
      </tfoot>
    </table>

    ${validLine}
    ${quote.notes ? `<p style="margin-top:16px;color:#4b5563;font-size:14px;">${quote.notes}</p>` : ''}

    <div style="text-align:center;margin-top:32px;">
      <a href="${STORE_URL}/cotizaciones/${quote.id}" style="${buttonStyle}">Ver cotización completa</a>
    </div>
  </div>
  <div style="${footerStyle}">
    <p style="margin:0;">${STORE_NAME} &bull; ${STORE_URL}</p>
  </div>
</div>`

  await resend.emails.send({
    from: FROM,
    to: quote.user.email,
    subject: `Tu cotización ${quoteNumber} — ${STORE_NAME}`,
    html,
  })
}

// ─── sendWelcome ──────────────────────────────────────────────────────────────

export async function sendWelcome(user: WelcomeUser): Promise<void> {
  const html = `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#ffffff;margin:0;font-size:28px;">¡Bienvenido a ${STORE_NAME}!</h1>
    <p style="color:#93c5fd;margin:8px 0 0;">Tu tienda de tecnología de confianza</p>
  </div>
  <div style="${bodyStyle}">
    <p style="font-size:16px;">Hola <strong>${user.name}</strong>,</p>
    <p>Tu cuenta ha sido creada exitosamente. Ahora puedes disfrutar de todos los beneficios de ser parte de ${STORE_NAME}:</p>

    <ul style="line-height:2;color:#374151;font-size:15px;">
      <li>Acceso a precios exclusivos para miembros</li>
      <li>Seguimiento de pedidos en tiempo real</li>
      <li>Historial completo de compras y servicios</li>
      <li>Programa de puntos y recompensas</li>
      <li>Cotizaciones personalizadas</li>
    </ul>

    <div style="text-align:center;margin-top:32px;">
      <a href="${STORE_URL}/tienda" style="${buttonStyle}">Explorar la tienda</a>
    </div>

    <div style="background:#eff6ff;border-radius:8px;padding:20px;margin-top:32px;">
      <p style="margin:0;font-size:14px;color:#1e40af;">
        <strong>Tip:</strong> Completa tu perfil con tu número de teléfono para recibir alertas de ofertas exclusivas por WhatsApp.
      </p>
    </div>
  </div>
  <div style="${footerStyle}">
    <p style="margin:0;">${STORE_NAME} &bull; ${STORE_URL}</p>
    <p style="margin:8px 0 0;">Si no creaste esta cuenta, ignora este correo.</p>
  </div>
</div>`

  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `¡Bienvenido a ${STORE_NAME}!`,
    html,
  })
}
