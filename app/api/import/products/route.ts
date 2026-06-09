import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidationError {
  row: number
  field: string
  message: string
}

interface PreviewRow {
  rowIndex: number
  data: Record<string, string>
  errors: ValidationError[]
}

interface PreviewResponse {
  preview: PreviewRow[]
  validCount: number
  errorCount: number
  totalRows: number
  headers: string[]
}

// NOTE: The rest of this file is preserved as-is below

interface ColumnMapping {
  fileColumn: string
  targetField: string
}

interface ProductRow {
  sku: string
  name: string
  price: number
  category: string
  brand?: string
  stock?: number
  description?: string
  cost?: number
  weight?: number
  barcode?: string
  status?: string
}

interface ImportResult {
  success: boolean
  created: number
  updated: number
  errors: number
  errorDetails: { row: number; sku?: string; message: string }[]
}

// ─── Validator ────────────────────────────────────────────────────────────────

function validateRow(row: Record<string, unknown>, index: number): { valid: boolean; data?: ProductRow; error?: string } {
  const sku = String(row.sku ?? '').trim()
  const name = String(row.name ?? '').trim()
  const price = parseFloat(String(row.price ?? ''))
  const category = String(row.category ?? '').trim()

  if (!sku) return { valid: false, error: `Fila ${index}: SKU requerido` }
  if (!name) return { valid: false, error: `Fila ${index}: Nombre requerido` }
  if (isNaN(price) || price < 0) return { valid: false, error: `Fila ${index}: Precio inválido (${row.price})` }
  if (!category) return { valid: false, error: `Fila ${index}: Categoría requerida` }

  return {
    valid: true,
    data: {
      sku,
      name,
      price,
      category,
      brand: row.brand ? String(row.brand).trim() : undefined,
      stock: row.stock !== undefined && row.stock !== '' ? parseInt(String(row.stock)) : undefined,
      description: row.description ? String(row.description).trim() : undefined,
      cost: row.cost !== undefined && row.cost !== '' ? parseFloat(String(row.cost)) : undefined,
      weight: row.weight !== undefined && row.weight !== '' ? parseFloat(String(row.weight)) : undefined,
      barcode: row.barcode ? String(row.barcode).trim() : undefined,
      status: row.status ? String(row.status).trim() : 'active',
    },
  }
}

// ─── Apply column mappings ────────────────────────────────────────────────────

function applyMappings(rawRow: Record<string, unknown>, mappings: ColumnMapping[]): Record<string, unknown> {
  const mapped: Record<string, unknown> = {}
  for (const { fileColumn, targetField } of mappings) {
    if (targetField && fileColumn in rawRow) {
      mapped[targetField] = rawRow[fileColumn]
    }
  }
  return mapped
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<ImportResult | PreviewResponse>> {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const mappingsJson = formData.get('mappings') as string | null
    const confirm = formData.get('confirm') === 'true'

    if (!file) {
      return NextResponse.json({ success: false, created: 0, updated: 0, errors: 1, errorDetails: [{ row: 0, message: 'No se recibió archivo' }] }, { status: 400 })
    }

    const mappings: ColumnMapping[] = mappingsJson ? JSON.parse(mappingsJson) : []

    // Parse XLSX/CSV
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })
    const headers = rawRows.length > 0 ? Object.keys(rawRows[0]) : []

    // Validate all rows upfront (for preview AND import)
    const validated = rawRows.map((rawRow, i) => {
      const mapped = mappings.length > 0 ? applyMappings(rawRow, mappings) : rawRow
      const rowIndex = i + 2
      const result = validateRow(mapped, rowIndex)
      return { rowIndex, rawRow: mapped, ...result }
    })

    // ── PREVIEW mode: return validation results without touching DB ──
    if (!confirm) {
      const previewRows: PreviewRow[] = validated.map(({ rowIndex, rawRow, valid, error }) => {
        const errors: ValidationError[] = []
        if (!valid && error) {
          // Parse field from error string
          const field = error.includes('SKU') ? 'sku' : error.includes('Nombre') ? 'name' : error.includes('Precio') ? 'price' : error.includes('Categoría') ? 'category' : 'general'
          errors.push({ row: rowIndex, field, message: error.replace(/^Fila \d+: /, '') })
        }
        return {
          rowIndex,
          data: Object.fromEntries(Object.entries(rawRow).map(([k, v]) => [k, String(v)])),
          errors,
        }
      })
      const errorCount = previewRows.filter(r => r.errors.length > 0).length
      return NextResponse.json({
        preview: previewRows,
        validCount: rawRows.length - errorCount,
        errorCount,
        totalRows: rawRows.length,
        headers,
      } as PreviewResponse)
    }

    let created = 0
    let updated = 0
    const errorDetails: ImportResult['errorDetails'] = []

    // Add invalid rows directly to errorDetails
    validated.filter(r => !r.valid).forEach(({ rowIndex, error }) => {
      errorDetails.push({ row: rowIndex, message: error ?? 'Error de validación' })
    })

    // Process only valid rows in batches of 50
    const validRows = validated.filter(r => r.valid && r.data)
    const BATCH_SIZE = 50
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE)

      await Promise.all(batch.map(async ({ rowIndex, data }) => {
        if (!data) return

        try {
          // Find or create category
          const categoryRecord = await prisma.category.upsert({
            where: { slug: data.category.toLowerCase().replace(/\s+/g, '-') },
            create: {
              name: data.category,
              slug: data.category.toLowerCase().replace(/\s+/g, '-'),
            },
            update: {},
          })

          // Find or create brand if provided
          let brandRecord = null
          if (data.brand) {
            brandRecord = await prisma.brand.upsert({
              where: { slug: data.brand.toLowerCase().replace(/\s+/g, '-') },
              create: {
                name: data.brand,
                slug: data.brand.toLowerCase().replace(/\s+/g, '-'),
              },
              update: {},
            })
          }

          // Upsert product by SKU
          const existing = await prisma.product.findUnique({ where: { sku: data.sku } })

          if (existing) {
            await prisma.product.update({
              where: { sku: data.sku },
              data: {
                name: data.name,
                pri