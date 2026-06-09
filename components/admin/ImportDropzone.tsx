'use client'

import { useState, useCallback, useRef } from 'react'
import * as XLSX from 'xlsx'

// --- Types --------------------------------------------------------------------

export interface ColumnMapping {
  fileColumn: string
  targetField: string
}

export interface ImportRow {
  index: number
  data: Record<string, unknown>
  errors: string[]
  status: 'valid' | 'warning' | 'error'
}

interface ImportDropzoneProps {
  /** Fields the target schema requires */
  requiredFields: string[]
  /** All accepted fields */
  allFields: string[]
  /** Import endpoint */
  endpoint: string
  /** Called after successful import */
  onSuccess?: (result: { created: number; updated: number; errors: number }) => void
  accept?: string
}

const MAX_PREVIEW_ROWS = 10

// --- Component ----------------------------------------------------------------

export default function ImportDropzone({
  requiredFields,
  allFields,
  endpoint,
  onSuccess,
  accept = '.xlsx,.xls,.csv',
}: ImportDropzoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [previewRows, setPreviewRows] = useState<ImportRow[]>([])
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'importing' | 'done'>('upload')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ created: number; updated: number; errors: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // -- Parse file --------------------------------------------------------------

  const parseFile = useCallback((f: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

        if (json.length === 0) return

        const headers = Object.keys(json[0])
        setRawHeaders(headers)
        setRawRows(json)

        // Auto-map: exact match (case-insensitive)
        const autoMappings: ColumnMapping[] = headers.map(h => ({
          fileColumn: h,
          targetField: allFields.find(f =>
            f.toLowerCase() === h.toLowerCase() ||
            f.toLowerCase().replace(/_/g, '') === h.toLowerCase().replace(/[\s_-]/g, '')
          ) ?? '',
        }))
        setMappings(autoMappings)
        setFile(f)
        setStep('map')
      } catch {
        alert('Error al leer el archivo. Verifica que sea un XLSX o CSV válido.')
      }
    }
    reader.readAsArrayBuffer(f)
  }, [allFields])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) parseFile(f)
  }, [parseFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) parseFile(f)
  }

  // -- Validate mappings & build preview --------------------------------------

  const buildPreview = () => {
    const rows: ImportRow[] = rawRows.slice(0, MAX_PREVIEW_ROWS).map((rawRow, index) => {
      const mapped: Record<string, unknown> = {}
      mappings.forEach(({ fileColumn, targetField }) => {
        if (targetField) mapped[targetField] = rawRow[fileColumn]
      })

      const errors: string[] = []
      requiredFields.forEach(rf => {
        const val = mapped[rf]
        if (val === undefined || val === null || val === '') {
          errors.push(`"${rf}" es requerido`)
        }
      })

      // Type checks
      if (mapped.price !== undefined && isNaN(Number(mapped.price))) {
        errors.push('"price" debe ser número')
      }
      if (mapped.stock !== undefined && isNaN(Number(mapped.stock))) {
        errors.push('"stock" debe ser número')
      }

      return {
        index: index + 1,
        data: mapped,
        errors,
        status: errors.length === 0 ? 'valid' : 'error',
      }
    })

    setPreviewRows(rows)
    setStep('preview')
  }

  // -- Import ------------------------------------------------------------------

  const runImport = async () => {
    if (!file) return
    setStep('importing')
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90))
    }, 300)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mappings', JSON.stringify(mappings))

      const res = await fetch(endpoint, { method: 'POST', body: formData })
      const json = await res.json()

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setResult(json)
        setStep('done')
        onSuccess?.(json)
      }, 500)
    } catch {
      clearInterval(progressInterval)
      alert('Error al importar. Intenta de nuevo.')
      setStep('preview')
    }
  }

  const reset = () => {
    setFile(null)
    setRawHeaders([])
    setRawRows([])
    setMappings([])
    setPreviewRows([])
    setProgress(0)
    setResult(null)
    setStep('upload')
    if (fileRef.current) fileRef.current.value = ''
  }

  const errorCount = previewRows.filter(r => r.status === 'error').length
  const validCount = previewRows.filter(r => r.status === 'valid').length

  // -- Render ------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {(['upload', 'map', 'preview'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s ? 'bg-blue-600 text-white' :
              (['map','preview','importing','done'].indexOf(step) > i) ? 'bg-green-500 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {(['map','preview','importing','done'].indexOf(step) > i) ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${step === s ? 'text-blue-600' : 'text-gray-400'}`}>
              {s === 'upload' ? 'Archivo' : s === 'map' ? 'Mapeo' : 'Revisión'}
            </span>
            {i < 2 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* -- STEP: Upload -- */}
      {step === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <input ref={fileRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
          <div className="text-5xl mb-3">📂</div>
          <p className="text-sm font-medium text-gray-700">Arrastra tu archivo aquí</p>
          <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar</p>
          <p className="text-xs text-gray-400 mt-2">XLSX, XLS, CSV — máx. 10 MB</p>
        </div>
      )}

      {/* -- STEP: Map columns -- */}
      {step === 'map' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Mapeo de columnas</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {file?.name} · {rawRows.length.toLocaleString()} filas detectadas
              </p>
            </div>
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Cambiar archivo</button>
          </div>

          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-500 px-1">
              <span>Columna en archivo</span>
              <span>Campo destino</span>
            </div>

            {mappings.map((m, i) => (
              <div key={m.fileColumn} className="grid grid-cols-2 gap-2 items-center">
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono">
                  {m.fileColumn}
                </div>
                <select
                  value={m.targetField}
                  onChange={e => {
                    const updated = [...mappings]
                    updated[i] = { ...m, targetField: e.target.value }
                    setMappings(updated)
                  }}
                  className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    requiredFields.includes(m.targetField) ? 'border-blue-300' :
                    m.targetField ? 'border-gray-200' : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <option value="">— Ignorar —</option>
                  {allFields.map(f => (
                    <option key={f} value={f}>
                      {f}{requiredFields.includes(f) ? ' *' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="px-5 pb-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              * Campos requeridos: {requiredFields.join(', ')}
            </p>
            <button
              onClick={buildPreview}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg"
            >
              Previsualizar →
            </button>
          </div>
        </div>
      )}

      {/* -- STEP: Preview -- */}
      {step === 'preview' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Previsualización — primeras {MAX_PREVIEW_ROWS} filas de {rawRows.length}
              </h3>
              <div className="flex gap-3 mt-1">
                <span className="text-xs text-green-600">✓ {validCount} válidas</span>
                {errorCount > 0 && <span className="text-xs text-red-600">✗ {errorCount} con errores</span>}
              </div>
            </div>
            <button onClick={() => setStep('map')} className="text-xs text-gray-400 hover:text-gray-600">← Volver</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium w-8">#</th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">Estado</th>
                  {mappings.filter(m => m.targetField).map(m => (
                    <th key={m.targetField} className="text-left px-3 py-2.5 text-gray-500 font-medium">
                      {m.targetField}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map(row => (
                  <tr key={row.index} className={`border-b border-gray-50 ${row.status === 'error' ? 'bg-red-50' : ''}`}>
                    <td className="px-3 py-2 text-gray-400">{row.index}</td>
                    <td className="px-3 py-2">
                      {row.status === 'valid' ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <div>
                          <span className="text-red-600">✗</span>
                          <div className="text-red-500 text-[10px] mt-0.5 space-y-0.5">
                            {row.errors.map((e, i) => <div key={i}>{e}</div>)}
                          </div>
                        </div>
                      )}
                    </td>
                    {mappings.filter(m => m.targetField).map(m => (
                      <td key={m.targetField} className="px-3 py-2 text-gray-700 max-w-[150px] truncate">
                        {String(row.data[m.targetField] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {rawRows.length > MAX_PREVIEW_ROWS && (
                <span>... y {rawRows.length - MAX_PREVIEW_ROWS} filas más</span>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              {errorCount > 0 && (
                <span className="text-xs text-red-500 flex items-center">
                  {errorCount} errores — revisa el mapeo
                </span>
              )}
              <button
                onClick={runImport}
                disabled={errorCount > 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg"
              >
                Confirmar e importar ({rawRows.length} filas)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -- STEP: Importing -- */}
      {step === 'importing' && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4 animate-bounce">⚙️</div>
          <p className="text-base font-semibold text-gray-800 mb-1">Importando {rawRows.length} registros...</p>
          <p className="text-sm text-gray-400 mb-6">No cierres esta ventana</p>
          <div className="bg-gray-100 rounded-full h-3 max-w-sm mx-auto overflow-hidden">
            <div
              className="h-3 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      {/* -- STEP: Done -- */}
      {step === 'done' && result && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-lg font-bold text-gray-900 mb-4">Importación completada</p>
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-600">{result.created}</p>
              <p className="text-xs text-green-700">Creados</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-600">{result.updated}</p>
              <p className="text-xs text-blue-700">Actualizados</p>
            </div>
            <div className={`rounded-xl p-3 ${result.errors > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <p className={`text-2xl font-bold ${result.errors > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {result.errors}
              </p>
              <p className={`text-xs ${result.errors > 0 ? 'text-red-700' : 'text-gray-500'}`}>Errores</p>
            </div>
          </div>
          <button onClick={reset} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Importar otro archivo
          </button>
        </div>
      )}
    </div>
  )
}
