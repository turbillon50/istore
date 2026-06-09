import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'

// --- Types --------------------------------------------------------------------

type ExportType = 'products' | 'orders' | 'customers' | 'inventory' | 'quotes' | 'leads'
type ExportFormat = 'xlsx' | 'csv'

// --- Data fetchers ------------------------------------------------------------

async function fetchProducts(): Promise<Record<string, unknown>[]> {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      brand:    { select: { name: true } },
      variants: { select: { sku: true, price: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return products.map(p => ({
    sku:           p.sku,
    name:          p.name,
    price:         p.price,
    compare_price: p.comparePrice ?? '',
    cost:          p.cost ?? '',
    category:      p.category.name,
    brand:         p.brand?.name ?? '',
    barcode:       p.barcode ?? '',
    weight:        p.weight ?? '',
    status:        p.status,
    description:   p.description ?? '',
    created_at:    p.createdAt.toISOString().split('T')[0],
  }))
}

async function fetchOrders(startDate?: string, endDate?: string): Promise<Record<string, unknown>[]> {
  const where: Record<string, unknown> = {}
  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate   && { lte: new Date(`${endDate}T23:59:59`) }),
    }
  }

  const orders = await prisma.order.findMany({
    where,
    select: {
      orderNumber: true,
      createdAt: true,
      status: true,
      paymentStatus: true,
      subtotal: true,
      discountAmount: true,
      shippingAmount: true,
      total: true,
      notes: true,
      guestEmail: true,
      user:  { select: { name: true, email: true } },
      items: { select: { product: { select: { sku: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Flatten: one row per order
  return orders.map(o => ({
    order_number:   o.orderNumber,
    date:           o.createdAt.toISOString().split('T')[0],
    status:         o.status,
    payment_status: o.paymentStatus,
    customer_name:  o.user?.name ?? 'Invitado',
    customer_email: o.user?.email ?? o.guestEmail ?? '',
    subtotal:       Number(o.subtotal),
    discount:       Number(o.discountAmount),
    shipping:       Number(o.shippingAmount),
    total:          Number(o.total),
    items_count:    o.items.length,
    items_skus:     o.items.map(i => i.product.sku).join(', '),
    notes:          o.notes ?? '',
  }))
}

async function fetchCustomers(): Promise<Record<string, unknown>[]> {
  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders:    { select: { id: true, total: true } },
      addresses: { take: 1, orderBy: { isDefault: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return users.map(u => ({
    name:          u.name ?? '',
    email:         u.email,
    phone:         u.phone ?? '',
    orders_count:  u.orders.length,
    total_spent:   u.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
    address:       u.addresses[0]?.street ?? '',
    city:          u.addresses[0]?.city ?? '',
    state:         u.addresses[0]?.state ?? '',
    zip:           u.addresses[0]?.zip ?? '',
    created_at:    u.createdAt.toISOString().split('T')[0],
    last_login:    u.lastLoginAt?.toISOString().split('T')[0] ?? '',
  }))
}

async function fetchInventory(): Promise<Record<string, unknown>[]> {
  const items = await prisma.inventoryItem.findMany({
    include: {
      product: { select: { sku: true, name: true } },
      branch:  { select: { name: true } },
    },
    orderBy: [{ branch: { name: 'asc' } }, { product: { sku: 'asc' } }],
  })

  return items.map(item => ({
    sku:         item.product.sku,
    product:     item.product.name,
    branch:      item.branch?.name ?? 'Principal',
    quantity:    item.quantity,
    reserved:    item.reserved ?? 0,
    available:   item.quantity - (item.reserved ?? 0),
    min_stock:   item.minStock ?? 0,
    location:    item.location ?? '',
    updated_at:  item.updatedAt.toISOString().split('T')[0],
  }))
}

async function fetchQuotes(startDate?: string, endDate?: string): Promise<Record<string, unknown>[]> {
  const where: Record<string, unknown> = {}
  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate   && { lte: new Date(`${endDate}T23:59:59`) }),
    }
  }

  const quotes = await prisma.quote.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { sku: true, name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return quotes.map(q => ({
    folio:          q.folio,
    date:           q.createdAt.toISOString().split('T')[0],
    status:         q.status,
    customer_name:  q.user?.name ?? q.guestName ?? '',
    customer_email: q.user?.email ?? q.guestEmail ?? '',
    customer_phone: q.guestPhone ?? '',
    total:          Number(q.total),
    valid_until:    q.validUntil?.toISOString().split('T')[0] ?? '',
    notes:          q.notes ?? '',
    items_count:    q.items.length,
  }))
}

async function fetchLeads(startDate?: string, endDate?: string): Promise<Record<string, unknown>[]> {
  const where: Record<string, unknown> = {}
  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate   && { lte: new Date(`${endDate}T23:59:59`) }),
    }
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return leads.map(l => ({
    name:       l.name,
    email:      l.email ?? '',
    phone:      l.phone ?? '',
    source:     l.source ?? '',
    status:     l.status,
    message:    l.message ?? '',
    created_at: l.createdAt.toISOString().split('T')[0],
  }))
}

// --- XLSX / CSV builder -------------------------------------------------------

function buildWorkbook(rows: Record<string, unknown>[], sheetName: string): XLSX.WorkBook {
  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto-width columns
  const colLengths: number[] = []
  if (rows.length > 0) {
    const keys = Object.keys(rows[0])
    keys.forEach((k, i) => {
      const maxLen = Math.max(
        k.length,
        ...rows.map(r => String(r[k] ?? '').length)
      )
      colLengths[i] = Math.min(maxLen + 2, 50)
    })
    ws['!cols'] = colLengths.map(wch => ({ wch }))
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  return wb
}

// --- Route handler ------------------------------------------------------------

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const type      = (searchParams.get('type') ?? 'products') as ExportType
    const format    = (searchParams.get('format') ?? 'xlsx') as ExportFormat
    const startDate = searchParams.get('startDate') ?? undefined
    const endDate   = searchParams.get('endDate') ?? undefined

    const validTypes: ExportType[] = ['products', 'orders', 'customers', 'inventory', 'quotes', 'leads']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Tipo de exportación inválido' }, { status: 400 })
    }

    // Fetch data
    let rows: Record<string, unknown>[] = []
    let sheetName = 'Data'

    switch (type) {
      case 'products':  rows = await fetchProducts();                     sheetName = 'Productos';     break
      case 'orders':    rows = await fetchOrders(startDate, endDate);     sheetName = 'Pedidos';       break
      case 'customers': rows = await fetchCustomers();                    sheetName = 'Clientes';      break
      case 'inventory': rows = await fetchInventory();                    sheetName = 'Inventario';    break
      case 'quotes':    rows = await fetchQuotes(startDate, endDate);     sheetName = 'Cotizaciones';  break
      case 'leads':     rows = await fetchLeads(startDate, endDate);      sheetName = 'Leads';         break
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No hay datos para exportar con los filtros seleccionados' }, { status: 404 })
    }

    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `${type}_export_${dateStr}.${format}`

    // Build file
    const wb = buildWorkbook(rows, sheetName)

    if (format === 'csv') {
      const csvContent = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName])
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-store',
        },
      })
    }

    // XLSX
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[export]', err)
    return NextResponse.json({ error: 'Error interno al generar el archivo' }, { status: 500 })
  }
}
