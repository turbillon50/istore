'use client'

import { useState } from 'react'
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Image as ImageIcon,
  Save,
  Filter,
  Search,
} from 'lucide-react'

// --- Types --------------------------------------------------------------------

type BannerZone =
  | 'HERO_MAIN'
  | 'HERO_SECONDARY'
  | 'HOME_MIDDLE'
  | 'HOME_BOTTOM'
  | 'CATEGORY_TOP'
  | 'SIDEBAR'
  | 'POPUP'
  | 'ANNOUNCEMENT'

interface Banner {
  id: string
  name: string
  zone: BannerZone
  title: string
  subtitle: string
  cta: string
  ctaUrl: string
  image: string
  imageMobile: string
  bgColor: string
  textColor: string
  isActive: boolean
  sortOrder: number
  startsAt: string
  endsAt: string
  clicks: number
  impressions: number
  createdAt: string
}

type FormState = Omit<Banner, 'id' | 'clicks' | 'impressions' | 'createdAt'>

// --- Constants ----------------------------------------------------------------

const BANNER_ZONES: { zone: BannerZone; label: string; description: string; color: string }[] = [
  { zone: 'HERO_MAIN',       label: 'Hero Principal',     description: 'Banner grande en portada',     color: 'bg-purple-500/15 text-purple-300 border-purple-500/20' },
  { zone: 'HERO_SECONDARY',  label: 'Hero Secundario',    description: 'Hero secundario en portada',   color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' },
  { zone: 'ANNOUNCEMENT',    label: 'Anuncio',            description: 'Barra de anuncio superior',    color: 'bg-orange-500/15 text-orange-300 border-orange-500/20' },
  { zone: 'HOME_MIDDLE',     label: 'Centro de Home',     description: 'Banner en mitad del home',     color: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
  { zone: 'HOME_BOTTOM',     label: 'Final de Home',      description: 'Banner al pie del home',       color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20' },
  { zone: 'CATEGORY_TOP',    label: 'Cabecera Categoría', description: 'Encabezado de páginas de cat', color: 'bg-teal-500/15 text-teal-300 border-teal-500/20' },
  { zone: 'SIDEBAR',         label: 'Sidebar',            description: 'Banner en barra lateral',      color: 'bg-green-500/15 text-green-300 border-green-500/20' },
  { zone: 'POPUP',           label: 'Pop-up',             description: 'Modal emergente',              color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20' },
]

const EMPTY_FORM: FormState = {
  name: '', zone: 'HERO_MAIN', title: '', subtitle: '', cta: '', ctaUrl: '',
  image: '', imageMobile: '', bgColor: '#1e293b', textColor: '#ffffff',
  isActive: true, sortOrder: 1, startsAt: '', endsAt: '',
}

const MOCK_BANNERS: Banner[] = [
  { id: '1', name: 'Hero - Black Friday', zone: 'HERO_MAIN', title: 'Black Friday', subtitle: 'Hasta 40% de descuento en todo', cta: 'Ver ofertas', ctaUrl: '/ofertas', image: '', imageMobile: '', bgColor: '#0f172a', textColor: '#ffffff', isActive: true, sortOrder: 1, startsAt: '2024-11-25', endsAt: '2024-11-30', clicks: 1240, impressions: 18500, createdAt: '2024-11-20' },
  { id: '2', name: 'Hero - Laptops Gaming', zone: 'HERO_SECONDARY', title: 'Laptops Gaming', subtitle: 'Desde $14,999', cta: 'Comprar', ctaUrl: '/laptops', image: '', imageMobile: '', bgColor: '#1e293b', textColor: '#3b82f6', isActive: true, sortOrder: 1, startsAt: '', endsAt: '', clicks: 892, impressions: 12000, createdAt: '2024-11-15' },
  { id: '3', name: 'Anuncio - Envío gratis', zone: 'ANNOUNCEMENT', title: '🚚 Envío gratis en compras +$500 | Código: ENVIO500', subtitle: '', cta: '', ctaUrl: '', image: '', imageMobile: '', bgColor: '#3b82f6', textColor: '#ffffff', isActive: true, sortOrder: 1, startsAt: '', endsAt: '', clicks: 320, impressions: 45000, createdAt: '2024-11-01' },
  { id: '4', name: 'Home Middle - iPhone 15', zone: 'HOME_MIDDLE', title: 'iPhone 15 ya disponible', subtitle: 'Diseño titanio, cámara 48MP', cta: 'Ver más', ctaUrl: '/celulares/iphone-15', image: '', imageMobile: '', bgColor: '#334155', textColor: '#ffffff', isActive: false, sortOrder: 1, startsAt: '', endsAt: '', clicks: 0, impressions: 0, createdAt: '2024-11-10' },
  { id: '5', name: 'Popup - Newsletter', zone: 'POPUP', title: '10% de descuento', subtitle: 'En tu primera compra', cta: 'Obtener cupón', ctaUrl: '#newsletter', image: '', imageMobile: '', bgColor: '#1e293b', textColor: '#ffffff', isActive: true, sortOrder: 1, startsAt: '', endsAt: '', clicks: 445, impressions: 8200, createdAt: '2024-10-28' },
]

// --- Banner Card --------------------------------------------------------------

function BannerCard({
  banner,
  zoneInfo,
  onEdit,
  onDelete,
  onToggle,
}: {
  banner: Banner
  zoneInfo: typeof BANNER_ZONES[0] | undefined
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const ctr = banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : '0.0'

  return (
    <div className={`bg-zinc-800 border rounded-xl overflow-hidden flex flex-col transition-all ${
      banner.isActive ? 'border-zinc-700' : 'border-zinc-800 opacity-55'
    }`}>
      {/* Image preview */}
      <div className="relative bg-zinc-900 h-32 flex-shrink-0" style={{ backgroundColor: banner.bgColor }}>
        {banner.image ? (
          <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-700">
            <ImageIcon size={24} />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}

        {/* Overlay with text preview */}
        {(banner.title || banner.cta) && (
          <div className="absolute inset-0 flex flex-col items-start justify-end p-3 bg-gradient-to-t from-black/60 to-transparent">
            {banner.title && <p className="text-white text-xs font-bold truncate w-full">{banner.title}</p>}
            {banner.cta && <p className="text-orange-300 text-[10px] mt-0.5">{banner.cta} →</p>}
          </div>
        )}

        {/* Drag handle */}
        <button className="absolute top-2 left-2 text-white/30 hover:text-white/70 cursor-grab">
          <GripVertical size={14} />
        </button>

        {/* Sort badge */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
          #{banner.sortOrder}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{banner.name}</p>
            {banner.ctaUrl && (
              <p className="text-xs text-zinc-500 font-mono truncate mt-0.5">{banner.ctaUrl}</p>
            )}
          </div>
          {zoneInfo && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${zoneInfo.color}`}>
              {zoneInfo.label}
            </span>
          )}
        </div>

        {/* Scheduling */}
        {(banner.startsAt || banner.endsAt) && (
          <p className="text-[10px] text-zinc-600">
            {banner.startsAt && `Desde ${banner.startsAt}`}
            {banner.startsAt && banner.endsAt && ' · '}
            {banner.endsAt && `Hasta ${banner.endsAt}`}
          </p>
        )}

        {/* Stats */}
        {banner.impressions > 0 && (
          <div className="flex gap-3 text-[10px] text-zinc-500 bg-zinc-900 rounded-lg px-2.5 py-1.5">
            <span>{banner.impressions.toLocaleString()} imp.</span>
            <span>{banner.clicks.toLocaleString()} clics</span>
            <span className="text-orange-400 font-medium">CTR {ctr}%</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <button onClick={onToggle}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              banner.isActive ? 'text-green-400 hover:text-green-300' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {banner.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
            {banner.isActive ? 'Activo' : 'Inactivo'}
          </button>
          <div className="flex gap-1">
            <button onClick={onEdit}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
            ><Pencil size={13} /></button>
            <button onClick={onDelete}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            ><Trash2 size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Banner Form --------------------------------------------------------------

function BannerForm({
  initial,
  onSave,
  onClose,
}: {
  initial: FormState
  onSave: (data: FormState) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<FormState>(initial)

  const up = (key: keyof FormState, value: unknown) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-base font-semibold text-white">
            {initial.name ? `Editar: ${initial.name}` : 'Nuevo Banner'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Basic info */}
          <section>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Información básica</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-zinc-500 mb-1">Nombre interno *</label>
                <input value={form.name} onChange={e => up('name', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Hero Black Friday 2025"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Zona *</label>
                <select value={form.zone} onChange={e => up('zone', e.target.value as BannerZone)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {BANNER_ZONES.map(z => <option key={z.zone} value={z.zone}>{z.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Orden de presentación</label>
                <input type="number" min="1" value={form.sortOrder} onChange={e => up('sortOrder', parseInt(e.target.value) || 1)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </section>

          {/* Content */}
          <section>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Contenido</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Título</label>
                <input value={form.title} onChange={e => up('title', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Black Friday"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Subtítulo</label>
                <input value={form.subtitle} onChange={e => up('subtitle', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Hasta 40% de descuento"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Texto del CTA</label>
                <input value={form.cta} onChange={e => up('cta', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Ver ofertas"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">URL del CTA</label>
                <input value={form.ctaUrl} onChange={e => up('ctaUrl', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="/ofertas"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Imágenes</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Imagen desktop (Cloudinary URL)</label>
                <div className="flex gap-2">
                  <input value={form.image} onChange={e => up('image', e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="https://res.cloudinary.com/..."
                  />
                  {form.image && (
                    <div className="w-16 h-9 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
                      <img src={form.image} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Imagen mobile</label>
                <input value={form.imageMobile} onChange={e => up('imageMobile', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
            </div>
          </section>

          {/* Colors */}
          <section>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Colores</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-2">Color de fondo</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.bgColor} onChange={e => up('bgColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-zinc-600 bg-transparent cursor-pointer p-0.5"
                  />
                  <input value={form.bgColor} onChange={e => up('bgColor', e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-2">Color de texto</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.textColor} onChange={e => up('textColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-zinc-600 bg-transparent cursor-pointer p-0.5"
                  />
                  <input value={form.textColor} onChange={e => up('textColor', e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div className="mt-3 rounded-lg h-16 flex items-center px-4 border border-zinc-700" style={{ backgroundColor: form.bgColor }}>
              <div>
                {form.title && <p className="text-sm font-bold" style={{ color: form.textColor }}>{form.title}</p>}
                {form.subtitle && <p className="text-xs opacity-75" style={{ color: form.textColor }}>{form.subtitle}</p>}
                {!form.title && !form.subtitle && <p className="text-xs opacity-30" style={{ color: form.textColor }}>Vista previa de colores</p>}
              </div>
            </div>
          </section>

          {/* Scheduling */}
          <section>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Programación</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Mostrar desde</label>
                <input type="date" value={form.startsAt} onChange={e => up('startsAt', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Ocultar desde</label>
                <input type="date" value={form.endsAt} onChange={e => up('endsAt', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </section>

          {/* Status */}
          <section>
            <button onClick={() => up('isActive', !form.isActive)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                form.isActive ? 'text-green-400' : 'text-zinc-500'
              }`}
            >
              {form.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              {form.isActive ? 'Banner activo — se mostrará en la tienda' : 'Banner inactivo — no se mostrará'}
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-5 py-4 flex gap-2 rounded-b-xl">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >Cancelar</button>
          <button onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            <Save size={14} /> {initial.name ? 'Actualizar Banner' : 'Crear Banner'}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ----------------------------------------------------------------

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS)
  const [filterZone, setFilterZone] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  const filtered = banners.filter(b => {
    const matchZone = filterZone === 'ALL' || b.zone === filterZone
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.title.toLowerCase().includes(search.toLowerCase())
    return matchZone && matchSearch
  })

  // Group by zone for organized view
  const grouped = BANNER_ZONES.reduce<Record<string, Banner[]>>((acc, { zone }) => {
    const items = filtered.filter(b => b.zone === zone)
    if (items.length > 0) acc[zone] = items
    return acc
  }, {})

  const openNew = () => {
    setEditingBanner(null)
    setShowForm(true)
  }

  const openEdit = (b: Banner) => {
    setEditingBanner(b)
    setShowForm(true)
  }

  const handleSave = (data: FormState) => {
    if (editingBanner) {
      setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...data } : b))
    } else {
      const newBanner: Banner = {
        ...data,
        id: Date.now().toString(),
        clicks: 0,
        impressions: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setBanners(prev => [...prev, newBanner])
    }
    setShowForm(false)
    setEditingBanner(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este banner?')) return
    setBanners(prev => prev.filter(b => b.id !== id))
  }

  const handleToggle = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b))
  }

  const totalActive = banners.filter(b => b.isActive).length

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 text-orange-400 rounded-lg p-2">
              <ImageIcon size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Banners</h1>
              <p className="text-sm text-zinc-500">{banners.length} banners · {totalActive} activos</p>
            </div>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Nuevo Banner
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar banner..."
              className="pl-8 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500 w-56"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFilterZone('ALL')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterZone === 'ALL' ? 'bg-orange-500 text-white' : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <Filter size={11} /> Todas
            </button>
            {BANNER_ZONES.map(({ zone, label, color }) => (
              <button key={zone} onClick={() => setFilterZone(zone)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  filterZone === zone ? `${color} border-current/30` : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped by zone */}
        {filterZone === 'ALL' ? (
          Object.entries(grouped).map(([zone, items]) => {
            const zoneInfo = BANNER_ZONES.find(z => z.zone === zone)!
            return (
              <section key={zone}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${zoneInfo.color}`}>
                    {zoneInfo.label}
                  </span>
                  <span className="text-xs text-zinc-600">{zoneInfo.description}</span>
                  <span className="text-xs text-zinc-600">· {items.length} banner{items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map(b => (
                    <BannerCard
                      key={b.id}
                      banner={b}
                      zoneInfo={zoneInfo}
                      onEdit={() => openEdit(b)}
                      onDelete={() => handleDelete(b.id)}
                      onToggle={() => handleToggle(b.id)}
                    />
                  ))}
                  <button onClick={openNew}
                    className="border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:border-orange-500/40 hover:text-orange-400 transition-colors min-h-[200px]"
                  >
                    <Plus size={20} />
                    <span className="text-xs">Agregar banner</span>
                  </button>
                </div>
              </section>
            )
          })
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(b => (
              <BannerCard
                key={b.id}
                banner={b}
                zoneInfo={BANNER_ZONES.find(z => z.zone === b.zone)}
                onEdit={() => openEdit(b)}
                onDelete={() => handleDelete(b.id)}
                onToggle={() => handleToggle(b.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-zinc-600">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No hay banners en esta zona</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BannerForm
          initial={editingBanner ? {
            name: editingBanner.name, zone: editingBanner.zone, title: editingBanner.title,
            subtitle: editingBanner.subtitle, cta: editingBanner.cta, ctaUrl: editingBanner.ctaUrl,
            image: editingBanner.image, imageMobile: editingBanner.imageMobile, bgColor: editingBanner.bgColor,
            textColor: editingBanner.textColor, isActive: editingBanner.isActive, sortOrder: editingBanner.sortOrder,
            startsAt: editingBanner.startsAt, endsAt: editingBanner.endsAt,
          } : EMPTY_FORM}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingBanner(null) }}
        />
      )}
    </div>
  )
}
