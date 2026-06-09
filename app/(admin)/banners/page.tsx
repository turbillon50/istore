'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// --- Types --------------------------------------------------------------------

type BannerZone = 'hero' | 'middle' | 'popup' | 'sidebar' | 'footer'
type BannerStatus = 'active' | 'inactive' | 'scheduled'

interface BannerStats {
  impressions: number
  clicks: number
  ctr: string
}

interface Banner {
  id: string
  title: string
  zone: BannerZone
  imageUrl: string
  linkUrl: string
  status: BannerStatus
  startDate: string
  endDate: string
  order: number
  stats: BannerStats
}

// --- Mock data ----------------------------------------------------------------

const ZONE_LABELS: Record<BannerZone, { label: string; icon: string; color: string }> = {
  hero:    { label: 'Hero Principal',   icon: '🖼️',  color: 'bg-purple-100 text-purple-700' },
  middle:  { label: 'Intermedio',       icon: '🎯',  color: 'bg-blue-100 text-blue-700' },
  popup:   { label: 'Popup',            icon: '💬',  color: 'bg-orange-100 text-orange-700' },
  sidebar: { label: 'Sidebar',          icon: '📌',  color: 'bg-green-100 text-green-700' },
  footer:  { label: 'Footer',           icon: '⬇️',  color: 'bg-gray-100 text-gray-700' },
}

const MOCK_BANNERS: Banner[] = [
  {
    id: '1', title: 'Promo Black Friday', zone: 'hero', order: 1,
    imageUrl: 'https://placehold.co/800x300/6366f1/fff?text=Black+Friday',
    linkUrl: '/ofertas/black-friday', status: 'active',
    startDate: '2024-11-25', endDate: '2024-11-30',
    stats: { impressions: 45200, clicks: 2341, ctr: '5.18%' },
  },
  {
    id: '2', title: 'Laptops Gaming', zone: 'hero', order: 2,
    imageUrl: 'https://placehold.co/800x300/0ea5e9/fff?text=Gaming+Laptops',
    linkUrl: '/laptops/gaming', status: 'active',
    startDate: '2024-01-01', endDate: '2024-02-28',
    stats: { impressions: 31000, clicks: 1890, ctr: '6.10%' },
  },
  {
    id: '3', title: 'Accesorios 2x1', zone: 'middle', order: 1,
    imageUrl: 'https://placehold.co/800x200/22c55e/fff?text=2x1+Accesorios',
    linkUrl: '/accesorios', status: 'active',
    startDate: '2024-01-10', endDate: '2024-01-31',
    stats: { impressions: 18700, clicks: 743, ctr: '3.97%' },
  },
  {
    id: '4', title: 'Newsletter Popup', zone: 'popup', order: 1,
    imageUrl: 'https://placehold.co/500x400/f59e0b/fff?text=Suscribete',
    linkUrl: '', status: 'inactive',
    startDate: '', endDate: '',
    stats: { impressions: 8900, clicks: 567, ctr: '6.37%' },
  },
  {
    id: '5', title: 'Navidad 2024', zone: 'hero', order: 3,
    imageUrl: 'https://placehold.co/800x300/ef4444/fff?text=Navidad+2024',
    linkUrl: '/navidad', status: 'scheduled',
    startDate: '2024-12-15', endDate: '2024-12-26',
    stats: { impressions: 0, clicks: 0, ctr: '0%' },
  },
]

// --- Sortable Slide Card (for carousel ordering) ------------------------------

function SortableSlide({ banner }: { banner: Banner }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: banner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex-shrink-0 w-48 cursor-grab"
      {...attributes}
      {...listeners}
    >
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
      />
      <div className="absolute inset-0 bg-black/30 rounded-lg flex items-end p-2">
        <p className="text-white text-xs font-medium truncate">{banner.title}</p>
      </div>
      <div className="absolute top-1 right-1 bg-white rounded text-xs px-1 font-bold text-gray-600">
        #{banner.order}
      </div>
    </div>
  )
}

// --- Banner Card --------------------------------------------------------------

function BannerCard({
  banner,
  onEdit,
  onToggle,
  onDelete,
}: {
  banner: Banner
  onEdit: (b: Banner) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  const zone = ZONE_LABELS[banner.zone]
  const statusColors: Record<BannerStatus, string> = {
    active:    'bg-green-100 text-green-700',
    inactive:  'bg-gray-100 text-gray-500',
    scheduled: 'bg-yellow-100 text-yellow-700',
  }
  const statusLabels: Record<BannerStatus, string> = {
    active: 'Activo', inactive: 'Inactivo', scheduled: 'Programado',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
      {/* Preview image */}
      <div className="relative aspect-video bg-gray-100">
        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${zone.color}`}>
            {zone.icon} {zone.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[banner.status]}`}>
            {statusLabels[banner.status]}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 flex gap-2">
            <button
              onClick={() => onEdit(banner)}
              className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow hover:bg-gray-50"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{banner.title}</h3>
            {banner.startDate && (
              <p className="text-xs text-gray-400 mt-0.5">
                {banner.startDate} → {banner.endDate || '∞'}
              </p>
            )}
          </div>
          {/* Toggle */}
          <button
            onClick={() => onToggle(banner.id)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              banner.status === 'active' ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              banner.status === 'active' ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-2">
          <div>
            <p className="text-xs text-gray-400">Impresiones</p>
            <p className="text-sm font-semibold text-gray-800">{banner.stats.impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Clics</p>
            <p className="text-sm font-semibold text-gray-800">{banner.stats.clicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">CTR</p>
            <p className="text-sm font-semibold text-green-600">{banner.stats.ctr}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(banner)}
            className="flex-1 text-xs text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(banner.id)}
            className="text-xs text-red-500 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Edit Modal ---------------------------------------------------------------

function EditModal({ banner, onClose, onSave }: { banner: Banner; onClose: () => void; onSave: (b: Banner) => void }) {
  const [form, setForm] = useState(banner)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Editar Banner</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Preview */}
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
          )}

          <div>
            <label className="block text-xs text-gray-500 mb-1">Título</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">URL de imagen</label>
            <input
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Link destino</label>
            <input
              value={form.linkUrl}
              onChange={e => setForm({ ...form, linkUrl: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="/ruta o https://..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Zona</label>
            <select
              value={form.zone}
              onChange={e => setForm({ ...form, zone: e.target.value as BannerZone })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Object.entries(ZONE_LABELS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fecha fin</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() => { onSave(form); onClose() }}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Main ---------------------------------------------------------------------

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS)
  const [selectedZone, setSelectedZone] = useState<BannerZone | 'all'>('all')
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const heroBanners = banners
    .filter(b => b.zone === 'hero')
    .sort((a, b) => a.order - b.order)

  const filtered = selectedZone === 'all'
    ? banners
    : banners.filter(b => b.zone === selectedZone)

  const handleToggle = useCallback((id: string) => {
    setBanners(prev => prev.map(b => b.id === id
      ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' }
      : b
    ))
  }, [])

  const handleDelete = useCallback((id: string) => {
    if (!confirm('¿Eliminar este banner?')) return
    setBanners(prev => prev.filter(b => b.id !== id))
  }, [])

  const handleSave = useCallback((updated: Banner) => {
    setBanners(prev => prev.map(b => b.id === updated.id ? updated : b))
  }, [])

  const handleSlideReorder = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = heroBanners.findIndex(b => b.id === active.id)
    const newIndex = heroBanners.findIndex(b => b.id === over.id)
    const reordered = arrayMove(heroBanners, oldIndex, newIndex)
    setBanners(prev => {
      const nonHero = prev.filter(b => b.zone !== 'hero')
      return [...nonHero, ...reordered.map((b, i) => ({ ...b, order: i + 1 }))]
    })
  }

  const stats = {
    total: banners.length,
    active: banners.filter(b => b.status === 'active').length,
    totalImpressions: banners.reduce((s, b) => s + b.stats.impressions, 0),
    totalClicks: banners.reduce((s, b) => s + b.stats.clicks, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {editingBanner && (
        <EditModal
          banner={editingBanner}
          onClose={() => setEditingBanner(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Banners & Carrusel</h1>
            <p className="text-sm text-gray-500">Gestión visual de banners por zona</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
            + Nuevo Banner
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total banners',  value: stats.total,                             icon: '🖼️' },
            { label: 'Activos',        value: stats.active,                            icon: '✅' },
            { label: 'Impresiones',    value: stats.totalImpressions.toLocaleString(), icon: '👁' },
            { label: 'Clics totales',  value: stats.totalClicks.toLocaleString(),      icon: '👆' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span>{s.icon}</span>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Hero carousel order */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Orden del Carrusel Hero (arrastra para reordenar)</h2>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSlideReorder}>
            <SortableContext items={heroBanners.map(b => b.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {heroBanners.map(b => (
                  <SortableSlide key={b.id} banner={b} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Zone filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedZone('all')}
            className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              selectedZone === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Todos ({banners.length})
          </button>
          {Object.entries(ZONE_LABELS).map(([key, { label, icon }]) => {
            const count = banners.filter(b => b.zone === key).length
            return (
              <button
                key={key}
                onClick={() => setSelectedZone(key as BannerZone)}
                className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  selectedZone === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {icon} {label} ({count})
              </button>
            )
          })}
        </div>

        {/* Banner grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(banner => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={setEditingBanner}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">🖼️</p>
            <p className="text-lg font-medium">No hay banners en esta zona</p>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">+ Crear banner</button>
          </div>
        )}
      </div>
    </div>
  )
}
