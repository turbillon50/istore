import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'

// --- Types --------------------------------------------------------------------

interface InventoryRow {
  sku: string
  quantity: number
  branch: string
  location?: string
  minStock?: number
}

interface ImportResult {
  success: boolean
  updated: number
  created: number
  errors: number
  errorDetails: { row: number; sku?: string; message: string }[]
}

// --- Validator ----------------------------------------------------------------

function validateRow(row: Record<string, unknown>, index: number): { valid: boolean; data?: InventoryRow; error?: string } {
  const sku = String(row.sku ?? '').trim()
  const quantity = parseInt(String(row.quantity ?? ''))
  const branch = String(row.branch ?? 'default').trim()

  if (!sku) return { valid: false, error: `Fila ${index}: SKU requerido` }
  if (isNaN(quantity) || quantity < 0) return { valid: false, error: `Fila ${index}: Cantidad inválida (${row.quantity})` }

  return {
    valid: true,
    data: {
      sku,
      quantity,
      branch,
      location: row.location ? String(row.location).trim() : undefined,
      minStock: row.min_stock !== undefined ? parseInt(String(row.min_stock)) : undefined,
    },
  }
}

// --- Route handler ------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse<ImportResult>> {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, updated: 0, created: 0, errors: 1, errorDetails: [{ row: 0, message: 'No se recibió archivo' }] }, { status: 400 })
    }

    // Parse file
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

    let updated = 0
    let created = 0
    const errorDetails: ImportResult['errorDetails'] = []

    for (let i = 0; i < rawRows.length; i++) {
      const rowIndex = i + 2
      const { valid, data, error } = validateRow(rawRows[i], rowIndex)

      if (!valid || !data) {
        errorDetails.push({ row: rowIndex, message: error ?? 'Error de validación' })
        continue
      }

      try {
        // Find product
        const product = await prisma.product.findUnique({ where: { sku: data.sku } })
        if (!product) {
          errorDetails.push({ row: rowIndex, sku: data.sku, message: `Producto con SKU "${data.sku}" no encontrado` })
          continue
        }

        // Find or create branch
        const branch = await prisma.branch.upsert({
          where: { slug: data.branch.toLowerCase().replace(/\s+/g, '-') },
          create: {
            name: data.branch,
            slug: data.branch.toLowerCase().replace(/\s+/g, '-'),
            address: '',
            city: '',
            state: '',
            zip: '',
          },
          update: {},
        })

        // Find existing inventory item
        const existing = await prisma.inventoryItem.findFirst({
          where: { productId: product.id, branchId: branch.id },
        })

        const previousQty = existing?.quantity ?? 0
        const delta = data.quantity - previousQty

        let inventoryItem
        if (existing) {
          inventoryItem = await prisma.inventoryItem.update({
            where: { id: existing.id },
            data: {
              quantity: data.quantity,
              location: data.location,
              minStock: data.minStock,
            },
          })
          updated++
        } else {
          inventoryItem = await prisma.inventoryItem.create({
            data: {
              productId: product.id,
              branchId: branch.id,
              quantity: data.quantity,
              location: data.location,
              minStock: data.minStock ?? 0,
            },
          })
          created++
        }

        // Create movement record if delta != 0
        if (delta !== 0) {
          await prisma.inventoryMovement.create({
            data: {
              inventoryId: inventoryItem.id,
              type: delta > 0 ? 'IN_ADJUSTMENT' : 'OUT_ADJUSTMENT',
              quantity: Math.abs(delta),
              reason: 'bulk_import',
            },
          })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        errorDetails.push({ row: rowIndex, sku: data.sku, message })
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      created,
      errors: errorDetails.length,
      errorDetails,
    })
  } catch (err) {
    console.error('[import/inventory]', err)
    return NextResponse.json(
      { success: false, updated: 0, created: 0, errors: 1, errorDetails: [{ row: 0, message: 'Error interno del servidor' }] },
      { status: 500 }
    )
  }
}
