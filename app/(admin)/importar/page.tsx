'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Upload,
  Download,
  History,
  FileSpreadsheet,
  Package,
  Boxes,
  DollarSign,
  Users,
  ShoppingCart,
  FileText,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Loader2,
  X,
  Calendar,
} from 'lucide-react'

// --- Types --------------------------------------------------------------------

type MainTab = 'importar' | 'exportar' | 'historial'

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

interface ImportState {
  stage: 'idle' | 'uploading' | 'preview' | 'importing' | 'done' | 'error'
  file: File | null
  preview: PreviewRow[]
  validCount: number
  errorCount: number
  progress: number
  result: { created: number; updated: number; errors: number } | null
  errorMsg: string
}

interface HistoryEntry {
  id: string
  type: string
  operation: 'import' | 'export'
  filename: string
  date: string
  rowsProcessed: number
  created?: number
  updated?: number
  errors: number
  status: 'success' | 'partial' | 'failed'
  user: string
  format?: string
}

// --- Constants ----------------------------------------------------------------

const IMPORT_CARDS = [
  {
    id: 'products', label: 'Productos', icon: Package,
    description: 'SKU, nombre, precio, categoría, stock',
    fields: ['sku', 'name', 'price', 'category', 'brand', 'stock', 'description', 'cost', 'barcode', 'status'],
    required: ['sku', 'name', 'price', 'category'],
    endpoint: '/api/import/products',
    color: 'border-blue-500/30 bg-blue-500/5',
    iconColor: 'text-blue-400 bg-blue-500/15',
  },
  {
    id: 'inventory', label: 'Inventario', icon: Boxes,
    description: 'SKU, cantidad, sucursal, ubicación',
    fields: ['sku', 'quantity', 'branch', 'location', 'min_stock'],
    required: ['sku', 'quantity'],
    endpoint: '/api/import/inventory',
    color: 'border-teal-500/30 bg-teal-500/5',
    iconColor: 'text-teal-400 bg-teal-500/15',
  },
  {
    id: 'prices', label: 'Precios', icon: DollarSign,
    description: 'SKU, precio, costo, precio comparado',
    fields: ['sku', 'price', 'cost', 'compare_price', 'currency'],
    required: ['sku', 'price'],
    endpoint: '/api/import/prices',
    color: 'border-green-500/30 bg-green-500/5',
    iconColor: 'text-green-400 bg-green-500/15',
  },
  {
    id: 'customers', label: 'Clientes', icon: Users,
    description: 'Nombre, email, teléfono, dirección',
    fields: ['email', 'name', 'phone', 'address', 'city', 'state', 'zip'],
    required: ['email', 'name'],
    endpoint: '/api/import/customers',
    color: 'border-purple-500/30 bg-purple-500/5',
    iconColor: 'text-purple-400 bg-purple-500/15',
  },
]

const EXPORT_CARDS = [
  {
    id: 'products', label: 'Productos', icon: Package, description: 'Catálogo completo con precios y stock', hasDateFilter: false,
    color: 'border-blue-500/30', iconColor: 'text-blue-400 bg-blue-500/15', lastExport: '2024-01-15',
  },
  {
    id: 'orders', label: 'Pedidos', icon: ShoppingCart, description: 'Historial de órdenes con detalles', hasDateFilter: true,
    color: 'border-orange-500/30', iconColor: 'text-orange-400 bg-orange-500/15', lastExport: '2024-01-14',
  },
  {
    id: 'customers', label: 'Clientes', icon: Users, description: 'Base de clientes registrados', hasDateFilter: false,
    color: 'border-purple-500/30', iconColor: 'text-purple-400 bg-purple-500/15', lastExport: '2024-01-10',
  },
  {
    id: 'inventory', label: 'Inventario', icon: Boxes, description: 'Stock por sucursal y ubicación', hasDateFilter: false,
    color: 'border-teal-500/30', iconColor: 'text-teal-400 bg-teal-500/15', lastExport: '2024-01-12',
  },
  {
    id: 'quotes', label: 'Cotizaciones', icon: FileText, description: 'Cotizaciones generadas', hasDateFilter: true,
    color: 'border-yellow-500/30', iconColor: 'text-yellow-400 bg-yellow-500/15', lastExport: '2024-01-08',
  },
  {
    id: 'leads', label: 'Leads', icon: Target, description: 'Prospectos y contactos capturados', hasDateFilter: true,
    color: 'border-pink-500/30', iconColor: 'text-pink-400 bg-pink-500/15', lastExport: '2024-01-05',
  },
]

const MOCK_HISTORY: HistoryEntry[] = [
  { id: '1', type: 'Productos', operation: 'import', filename: 'catalogo_enero.xlsx', date: '2024-01-15 09:31', rowsProcessed: 260, created: 245, updated: 12, errors: 3, status: 'partial', user: 'Luis D.' },
  { id: '2', type: 'Pedidos', operation: 'export', filename: 'pedidos_2024-01-14.xlsx', date: '2024-01-14 16:45', rowsProcessed: 1240, errors: 0, status: 'success', user: 'Luis D.', format: 'xlsx' },
  { id: '3', type: 'Inventario', operation: 'import', filename: 'stock_almacen.csv', date: '2024-01-14 16:02', rowsProcessed: 89, created: 0, updated: 89, errors: 0, status: 'success', user: 'María G.' },
  { id: '4', type: 'Productos', operation: 'export', filename: 'productos_2024-01-12.csv', date: '2024-01-12 11:18', rowsProcessed: 847, errors: 0, status: 'success', user: 'Luis D.', format: 'csv' },
  { id: '5', type: 'Precios', operation: 'import', filename: 'precios_feb.xlsx', date: '2024-01-12 09:45', rowsProcessed: 313, created: 0, updated: 312, errors: 1, status: 'partial', user: 'Carlos R.' },
  { id: '6', type: 'Clientes', operation: 'export', filename: 'clientes_2024-01-10.xlsx', date: '2024-01-10 14:30', rowsProcessed: 3420, errors: 0, status: 'success', user: 'Luis D.', format: 'xlsx' },
]

// --- Import Dropzone ----------------------------------------------------------

type ImportCardProps = {
  card: (typeof IMPORT_CARDS)[number]
  onImported: (entry: HistoryEntry) => void
}

function ImportCard({ card, onImported }: ImportCardProps) {
  const [state, setState] = useState<ImportState>({
    stage: 'idle', file: null, preview: [], validCount: 0, errorCount: 0,
    progress: 0, result: null, errorMsg: '',
  })
  const [dragOver, setDragOver] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const Icon = card.icon

  const handleFile = useCallback(async (file: File) => {
    if (!file) return
    setState(prev => ({ ...prev, stage: 'uploading', file, progress: 0 }))

    // Simulate parse + validate
    await new Promise(r => setTimeout(r, 600))

    // Mock preview with some errors
    const mockRows: PreviewRow[] = Array.from({ length: 12 }, (_, i) => ({
      rowIndex: i + 2,
      data: {
        sku: `SKU-${1000 + i}`,
        name: i === 3 ? '' : `Producto ${1000 + i}`,
        price: i === 7 ? 'abc' : `${(Math.random() * 10000 + 500).toFixed(2)}`,
        category: i === 3 ? '' : 'Laptops',
        brand: 'Lenovo',
        stock: `${Math.floor(Math.random() * 50)}`,
      },
      errors: [
        ...(i === 3 ? [
          { row: i + 2, field: 'name', message: 'Nombre es requerido' },
          { row: i + 2, field: 'category', message: 'Categoría es requerida' },
        ] : []),
        ...(i === 7 ? [{ row: i + 2, field: 'price', message: 'Precio inválido: "abc"' }] : []),
      ],
    }))

    const errCount = mockRows.filter(r => r.errors.length > 0).length
    setState(prev => ({
      ...prev,
      stage: 'preview',
      preview: mockRows,
      validCount: mockRows.length - errCount,
      errorCount: errCount,
    }))
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleConfirm = async () => {
    setState(prev => ({ ...prev, stage: 'importing', progress: 0 }))

    // Simulate progress
    for (let p = 0; p <= 100; p += 10) {
      await new Promise(r => setTimeout(r, 120))
      setState(prev => ({ ...prev, progress: p }))
    }

    const result = { created: state.validCount - 3, updated: 3, errors: state.errorCount }
    setState(prev => ({ ...prev, stage: 'done', result }))

    onImported({
      id: Date.now().toString(),
      type: card.label,
      operation: 'import',
      filename: state.file?.name ?? 'archivo',
      date: new Date().toLocaleString('es-MX'),
      rowsProcessed: state.preview.length,
      created: result.created,
      updated: result.updated,
      errors: result.errors,
      status: result.errors > 0 ? 'partial' : 'success',
      user: 'Tú',
    })
  }

  const reset = () => {
    setState({ stage: 'idle', file: null, preview: [], validCount: 0, errorCount: 0, progress: 0, result: null, errorMsg: '' })
  }

  const allPreviewErrors = state.preview.flatMap(r => r.errors)

  return (
    <div className={`bg-zinc-900 border rounded-xl overflow-hidden ${card.color}`}>
      {/* Card header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ${card.iconColor}`}><Icon size={18} /></div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">{card.label}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{card.description}</p>
          </div>
          <a href={`/api/export/template/${card.id}`}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-orange-400 border border-zinc-700 hover:border-orange-500/40 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            <Download size={11} /> Plantilla
          </a>
        </div>
        <div className="flex gap-1 flex-wrap mt-3">
          {card.fields.map(f => (
            <span key={f}
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                card.required.includes(f)
                  ? 'bg-orange-500/15 text-orange-300 border border-orange-500/20'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >{f}</span>
          ))}
        </div>
      </div>

      {/* Stage: idle */}
      {state.stage === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`m-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors ${
            dragOver ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-zinc-700 text-zinc-600 hover:border-orange-500/40 hover:text-orange-400'
          }`}
        >
          <Upload size={22} />
          <p className="text-xs font-medium">Arrastra o haz clic para subir</p>
          <p className="text-[10px] text-zinc-600">XLSX o CSV - max. 10MB</p>
          <input ref={fileRef} type="file" accept=".xlsx,.csv,.xls" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      )}

      {/* Stage: uploading */}
      {state.stage === 'uploading' && (
        <div className="m-4 flex flex-col items-center justify-center gap-3 py-8">
          <Loader2 size={24} className="animate-spin text-orange-400" />
          <p className="text-sm text-zinc-400">Leyendo y validando archivo...</p>
          <p className="text-xs text-zinc-600">{state.file?.name}</p>
        </div>
      )}

      {/* Stage: preview */}
      {state.stage === 'preview' && (
        <div className="p-4 space-y-3">
          {/* Summary */}
          <div className="flex gap-3">
            <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-center">
              <p className="text-lg font-bold text-green-400">{state.validCount}</p>
              <p className="text-[10px] text-green-600">filas válidas</p>
            </div>
            <div className={`flex-1 rounded-lg px-3 py-2 text-center border ${state.errorCount > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-800 border-zinc-700'}`}>
              <p className={`text-lg font-bold ${state.errorCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{state.errorCount}</p>
              <p className={`text-[10px] ${state.errorCount > 0 ? 'text-red-600' : 'text-zinc-600'}`}>con errores</p>
            </div>
          </div>

          {/* Error details */}
          {allPreviewErrors.length > 0 && (
            <div>
              <button onClick={() => setShowErrors(v => !v)}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                <AlertCircle size={12} />
                {allPreviewErrors.length} error{allPreviewErrors.length !== 1 ? 'es' : ''} encontrado{allPreviewErrors.length !== 1 ? 's' : ''}
                <ChevronDown size={12} className={`transition-transform ${showErrors ? 'rotate-180' : ''}`} />
              </button>
              {showErrors && (
                <div className="mt-2 bg-zinc-950 rounded-lg border border-red-500/20 divide-y divide-zinc-800 max-h-36 overflow-y-auto">
                  {allPreviewErrors.map((err, i) => (
                    <div key={i} className="px-3 py-2 flex items-start gap-2">
                      <XCircle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-zinc-400">Fila {err.row} · </span>
                        <span className="text-xs font-mono text-orange-300">{err.field}</span>
                   