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

type ImportCardProps = { card: (typeof IMPORT_CARDS)[number]; onImported: (entry: HistoryEntry) => void }
function ImportCard(props: ImportCardProps) {
  const { card, onImported } = props;
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
          <p className="text-[10px] text-zinc-600">XLSX o CSV  -  máx. 10MB</p>
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
                        <span className="text-xs text-zinc-500">  -  {err.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview table */}
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-2 py-1.5 text-zinc-600 font-medium w-8">#</th>
                  {card.fields.slice(0, 5).map(f => (
                    <th key={f} className="text-left px-2 py-1.5 text-zinc-500 font-medium">{f}</th>
                  ))}
                  <th className="text-left px-2 py-1.5 text-zinc-600 w-16">status</th>
                </tr>
              </thead>
              <tbody>
                {state.preview.slice(0, 6).map(row => (
                  <tr key={row.rowIndex} className={`border-b border-zinc-800/50 ${row.errors.length > 0 ? 'bg-red-500/5' : ''}`}>
                    <td className="px-2 py-1.5 text-zinc-600">{row.rowIndex}</td>
                    {card.fields.slice(0, 5).map(f => {
                      const hasError = row.errors.some(e => e.field === f)
                      return (
                        <td key={f} className={`px-2 py-1.5 font-mono max-w-[80px] truncate ${hasError ? 'text-red-400 bg-red-500/10' : 'text-zinc-300'}`}>
                          {row.data[f] || <span className="text-zinc-700"> - </span>}
                        </td>
                      )
                    })}
                    <td className="px-2 py-1.5">
                      {row.errors.length > 0
                        ? <span className="text-red-400">✗ {row.errors.length}</span>
                        : <span className="text-green-400">✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {state.preview.length > 6 && (
              <p className="text-center text-xs text-zinc-600 py-1.5">... {state.preview.length - 6} filas más</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={reset} className="px-3 py-2 text-xs text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800">
              <X size={12} className="inline mr-1" />Cancelar
            </button>
            <button onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <CheckCircle2 size={13} />
              Importar {state.validCount} filas válidas
            </button>
          </div>
        </div>
      )}

      {/* Stage: importing */}
      {state.stage === 'importing' && (
        <div className="m-4 space-y-3 py-4">
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-orange-400" />
            <p className="text-sm text-zinc-300">Importando datos...</p>
          </div>
          <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div className="bg-orange-500 h-full transition-all duration-100" style={{ width: `${state.progress}%` }} />
          </div>
          <p className="text-xs text-zinc-500">{state.progress}% completado</p>
        </div>
      )}

      {/* Stage: done */}
      {state.stage === 'done' && state.result && (
        <div className="m-4 space-y-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
              <CheckCircle2 size={16} /> Importación completada
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-green-400 font-bold text-lg">{state.result.created}</p>
                <p className="text-zinc-500">creados</p>
              </div>
              <div>
                <p className="text-blue-400 font-bold text-lg">{state.result.updated}</p>
                <p className="text-zinc-500">actualizados</p>
              </div>
              <div>
                <p className={`font-bold text-lg ${state.result.errors > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{state.result.errors}</p>
                <p className="text-zinc-500">errores</p>
              </div>
            </div>
          </div>
          <button onClick={reset} className="w-full py-2 text-xs text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800">
            Importar otro archivo
          </button>
        </div>
      )}
    </div>
  )
}

// --- Export Card --------------------------------------------------------------

function ExportCard({ card }: { card: typeof EXPORT_CARDS[0] }) {
  type FormatType = 'xlsx' | 'csv'
  const [format, setFormat] = useState<FormatType>('xlsx')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const Icon = card.icon

  const handleExport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ type: card.id, format })
      if (card.hasDateFilter && dateFrom) params.set('startDate', dateFrom)
      if (card.hasDateFilter && dateTo) params.set('endDate', dateTo)

      const res = await fetch(`/api/export?${params}`)
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${card.id}_${new Date().toISOString().split('T')[0]}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error al exportar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-zinc-900 border rounded-xl p-4 flex flex-col gap-3 ${card.color}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 flex-shrink-0 ${card.iconColor}`}><Icon size={16} /></div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{card.label}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{card.description}</p>
        </div>
      </div>

      {card.hasDateFilter && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-zinc-600 mb-1 flex items-center gap-1"><Calendar size={9} /> Desde</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-600 mb-1 flex items-center gap-1"><Calendar size={9} /> Hasta</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto">
        <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-xs">
          {(['xlsx', 'csv'] as const).map(f => (
            <button key={f} onClick={() => setFormat(f)}
              className={`px-2.5 py-1.5 font-medium transition-colors ${
                format === f ? 'bg-zinc-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'
              }`}
            >{f.toUpperCase()}</button>
          ))}
        </div>
        <button onClick={handleExport} disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-60 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
        >
          {loading ? <><Loader2 size={12} className="animate-spin" /> Generando...</> : <><Download size={12} /> Descargar</>}
        </button>
      </div>

      {card.lastExport && (
        <p className="text-[10px] text-zinc-600">Último export: {card.lastExport}</p>
      )}
    </div>
  )
}

// --- Main Page ----------------------------------------------------------------

export default function ImportarPage() {
  const [mainTab, setMainTab] = useState<MainTab>('importar')
  const [history, setHistory] = useState<HistoryEntry[]>(MOCK_HISTORY)

  const handleImported = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev])
  }

  const tabs: { id: MainTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'importar',  label: 'Importar',  icon: <Upload size={14} /> },
    { id: 'exportar',  label: 'Exportar',  icon: <Download size={14} /> },
    { id: 'historial', label: 'Historial', icon: <History size={14} />, count: history.length },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/20 text-orange-400 rounded-lg p-2"><FileSpreadsheet size={18} /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Importar / Exportar</h1>
            <p className="text-sm text-zinc-500">Carga masiva y descarga de datos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6">
        <nav className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setMainTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                mainTab === tab.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon} {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 bg-zinc-700 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Importar */}
        {mainTab === 'importar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-white mb-1">Importar datos</h2>
              <p className="text-sm text-zinc-500">
                Los campos en <span className="text-orange-300 font-medium">naranja</span> son obligatorios.
                Descarga la plantilla para ver el formato exacto.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {IMPORT_CARDS.map(card => (
                <ImportCard key={card.id} card={card} onImported={handleImported} />
              ))}
            </div>
          </div>
        )}

        {/* Exportar */}
        {mainTab === 'exportar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-white mb-1">Exportar datos</h2>
              <p className="text-sm text-zinc-500">Descarga reportes en XLSX o CSV con los filtros que necesites.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {EXPORT_CARDS.map(card => <ExportCard key={card.id} card={card} />)}
            </div>
          </div>
        )}

        {/* Historial */}
        {mainTab === 'historial' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white mb-1">Historial de operaciones</h2>
              <p className="text-sm text-zinc-500">Registro de todas las importaciones y exportaciones.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-800/80 border-b border-zinc-700">
                    {['Fecha', 'Operación', 'Tipo', 'Archivo', 'Filas', 'Creados', 'Actualizados', 'Errores', 'Estado', 'Usuario'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map(entry => (
                    <tr key={entry.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{entry.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          entry.operation === 'import'
                            ? 'bg-blue-500/15 text-blue-300'
                            : 'bg-green-500/15 text-green-300'
                        }`}>
                          {entry.operation === 'import' ? '↑ Import' : '↓ Export'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{entry.type}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{entry.filename}</td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{entry.rowsProcessed.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs">
                        {entry.created !== undefined ? <span className="text-green-400 font-semibold">+{entry.created}</span> : <span className="text-zinc-700"> - </span>}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {entry.updated !== undefined ? <span className="text-blue-400 font-semibold">~{entry.updated}</span> : <span className="text-zinc-700"> - </span>}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {entry.errors > 0
                          ? <span className="text-red-400 font-semibold">{entry.errors}</span>
                          : <span className="text-zinc-700"> - </span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          entry.status === 'success' ? 'bg-green-500/15 text-green-300' :
                          entry.status === 'partial' ? 'bg-yellow-500/15 text-yellow-300' :
                          'bg-red-500/15 text-red-300'
                        }`}>
                          {entry.status === 'success' ? '✓ Completo' : entry.status === 'partial' ? '~ Parcial' : '✗ Fallido'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{entry.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {history.length === 0 && (
                <div className="text-center py-16 text-zinc-600">
                  <History size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay operaciones registradas</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
