'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Globe,
  FileText,
  Image,
  Menu,
  Settings,
  Eye,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Save,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Palette,
  Link,
  Check,
  X,
} from 'lucide-react'

// --- Types -------------------------------------------------------------------

type BlockType = 'hero' | 'products' | 'banner' | 'text' | 'html' | 'faq' | 'brands'
type MainTab = 'pages' | 'site-config' | 'banners' | 'menus'

interface Block {
  id: string
  type: BlockType
  label: string
  config: Record<string, unknown>
}

interface CMSPage {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  template: string
  blocks: Block[]
  seo: {
    title: string
    description: string
    keywords: string
    ogImage: string
  }
  updatedAt: string
}

interface SiteConfig {
  storeName: string
  logo: string
  favicon: string
  contactEmail: string
  contactPhone: string
  address: string
  currency: string
  timezone: string
  primaryColor: string
  secondaryColor: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  tiktok: string
  whatsapp: string
}

interface BannerItem {
  id: string
  name: string
  zone: string
  title: string
  subtitle: string
  cta: string
  ctaUrl: string
  image: string
  isActive: boolean
  sortOrder: number
  startsAt: string
  endsAt: string
}

interface MenuItem {
  id: string
  label: string
  href: string
  target: '_self' | '_blank'
  children: MenuItem[]
}

interface MenuData {
  id: string
  name: string
  handle: string
  items: MenuItem[]
}

// --- Constants ----------------------------------------------------------------

type BlockTypeDef = { type: BlockType; label: string; icon: string; color: string }
const BLOCK_TYPES: BlockTypeDef[] = [
  { type: 'hero',     label: 'Hero / Banner',    icon: '🖼️',  color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { type: 'products', label: 'Grid Productos',   icon: '📦',  color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { type: 'banner',   label: 'Banner Promo',     icon: '🎯',  color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { type: 'text',     label: 'Texto Rich',       icon: '📝',  color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { type: 'html',     label: 'HTML Libre',       icon: '🔧',  color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  { type: 'faq',      label: 'FAQ / Acordeón',   icon: '❓',  color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { type: 'brands',   label: 'Marcas / Logos',   icon: '🏷️',  color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
]

const BANNER_ZONES = ['HERO_MAIN', 'HERO_SECONDARY', 'HOME_MIDDLE', 'HOME_BOTTOM', 'CATEGORY_TOP', 'SIDEBAR', 'POPUP', 'ANNOUNCEMENT']

const INITIAL_PAGES: CMSPage[] = [
  {
    id: 'home', title: 'Home / Inicio', slug: '/', status: 'published', template: 'HOME', updatedAt: '2024-01-15',
    seo: { title: 'iStore Pro - Tecnología al mejor precio', description: 'Compra laptops, celulares y accesorios.', keywords: 'laptops, celulares, tecnología', ogImage: '' },
    blocks: [
      { id: 'b1', type: 'hero',     label: 'Hero Principal',      config: {} },
      { id: 'b2', type: 'products', label: 'Productos Destacados', config: {} },
      { id: 'b3', type: 'banner',   label: 'Banner Intermedio',   config: {} },
      { id: 'b4', type: 'brands',   label: 'Nuestras Marcas',     config: {} },
    ],
  },
  {
    id: 'laptops', title: 'Landing - Laptops', slug: '/laptops', status: 'published', template: 'LANDING', updatedAt: '2024-01-10',
    seo: { title: 'Laptops - iStore Pro', description: 'Las mejores laptops.', keywords: 'laptops, notebooks', ogImage: '' },
    blocks: [
      { id: 'b5', type: 'hero',     label: 'Hero Laptops', config: {} },
      { id: 'b6', type: 'products', label: 'Grid Laptops', config: {} },
      { id: 'b7', type: 'faq',      label: 'FAQ Laptops',  config: {} },
    ],
  },
  {
    id: 'ofertas', title: 'Página de Ofertas', slug: '/ofertas', status: 'draft', template: 'LANDING', updatedAt: '2024-01-08',
    seo: { title: 'Ofertas - iStore Pro', description: '', keywords: '', ogImage: '' },
    blocks: [
      { id: 'b8', type: 'hero',     label: 'Hero Ofertas',  config: {} },
      { id: 'b9', type: 'products', label: 'Grid Ofertas',  config: {} },
    ],
  },
  {
    id: 'celulares', title: 'Landing - Celulares', slug: '/celulares', status: 'published', template: 'CATEGORY', updatedAt: '2024-01-05',
    seo: { title: 'Celulares - iStore Pro', description: 'Mejores smartphones.', keywords: 'celulares, smartphones', ogImage: '' },
    blocks: [
      { id: 'b10', type: 'hero',     label: 'Hero Celulares', config: {} },
      { id: 'b11', type: 'products', label: 'Grid Celulares', config: {} },
    ],
  },
]

const INITIAL_BANNERS: BannerItem[] = [
  { id: 'ban1', name: 'Hero Principal Black Friday', zone: 'HERO_MAIN', title: 'Black Friday', subtitle: 'Hasta 40% OFF', cta: 'Ver ofertas', ctaUrl: '/ofertas', image: '', isActive: true, sortOrder: 1, startsAt: '', endsAt: '' },
  { id: 'ban2', name: 'Hero Secundario Laptops',     zone: 'HERO_SECONDARY', title: 'Laptops Gaming', subtitle: 'Desde $999', cta: 'Comprar', ctaUrl: '/laptops', image: '', isActive: true, sortOrder: 1, startsAt: '', endsAt: '' },
  { id: 'ban3', name: 'Anuncio Envío Gratis',        zone: 'ANNOUNCEMENT', title: 'Envío gratis en compras +$500', subtitle: '', cta: '', ctaUrl: '', image: '', isActive: true, sortOrder: 1, startsAt: '', endsAt: '' },
  { id: 'ban4', name: 'Promo Centro',                zone: 'HOME_MIDDLE', title: 'Celulares nuevos', subtitle: 'iPhone 15 ya disponible', cta: 'Ver más', ctaUrl: '/celulares', image: '', isActive: false, sortOrder: 1, startsAt: '', endsAt: '' },
]

const INITIAL_MENUS: MenuData[] = [
  {
    id: 'main', name: 'Navegación principal', handle: 'main-nav',
    items: [
      { id: 'm1', label: 'Laptops',    href: '/laptops',    target: '_self', children: [] },
      { id: 'm2', label: 'Celulares',  href: '/celulares',  target: '_self', children: [] },
      { id: 'm3', label: 'Gaming',     href: '/gaming',     target: '_self', children: [] },
      { id: 'm4', label: 'Accesorios', href: '/accesorios', target: '_self', children: [] },
      { id: 'm5', label: 'Ofertas',    href: '/ofertas',    target: '_self', children: [] },
    ],
  },
  {
    id: 'footer', name: 'Footer - Información', handle: 'footer-info',
    items: [
      { id: 'f1', label: 'Quiénes somos', href: '/nosotros',   target: '_self', children: [] },
      { id: 'f2', label: 'Términos',       href: '/terminos',   target: '_self', children: [] },
      { id: 'f3', label: 'Privacidad',     href: '/privacidad', target: '_self', children: [] },
      { id: 'f4', label: 'Contacto',       href: '/contacto',   target: '_self', children: [] },
    ],
  },
]

const INITIAL_CONFIG: SiteConfig = {
  storeName: 'iStore Pro', logo: '', favicon: '',
  contactEmail: 'hola@istore.pro', contactPhone: '+52 55 1234 5678',
  address: 'Av. Tecnológica 123, CDMX', currency: 'MXN', timezone: 'America/Mexico_City',
  primaryColor: '#f97316', secondaryColor: '#1e293b',
  facebook: 'istoRepro', instagram: 'istorepro', twitter: 'istorepro', youtube: '', tiktok: '', whatsapp: '+525512345678',
}

// --- Sortable Block Row -------------------------------------------------------

type SortableBlockProps = { block: Block; onEdit: (id: string) => void; onRemove: (id: string) => void }
function SortableBlock(props: SortableBlockProps) {
  const { block, onEdit, onRemove } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const meta = BLOCK_TYPES.find(b => b.type === block.type)
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 group"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400 select-none">
        <GripVertical size={16} />
      </button>
      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${meta?.color}`}>
        {meta?.icon} {meta?.label}
      </span>
      <span className="flex-1 text-sm text-zinc-300 font-medium">{block.label}</span>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(block.id)} className="text-xs text-orange-400 hover:text-orange-300 px-2 py-1 rounded border border-orange-500/30 hover:bg-orange-500/10">
          <Pencil size={12} />
        </button>
        <button onClick={() => onRemove(block.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// --- Pages Tab ----------------------------------------------------------------

function PagesTab() {
  const initialPages: CMSPage[] = INITIAL_PAGES;
  const [pages, setPages] = useState(initialPages)
  const [selectedPageId, setSelectedPageId] = useState<string>('home')
  const [activeTab, setActiveTab] = useState<string>('blocks')
  const [saving, setSaving] = useState(false)
  const [addBlockOpen, setAddBlockOpen] = useState(false)
  const [showNewPageModal, setShowNewPageModal] = useState(false)
  const [newPage, setNewPage] = useState({ title: '', slug: '', template: 'LANDING' })

  const selectedPage = pages.find(p => p.id === selectedPageId)!

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const updatePage = useCallback((updater: (p: CMSPage) => CMSPage) => {
    setPages(prev => prev.map(p => p.id === selectedPageId ? updater(p) : p))
  }, [selectedPageId])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    updatePage(p => ({
      ...p,
      blocks: arrayMove(p.blocks, p.blocks.findIndex(b => b.id === active.id), p.blocks.findIndex(b => b.id === over.id)),
    }))
  }

  const addBlock = (type: BlockType) => {
    const meta = BLOCK_TYPES.find(b => b.type === type)!
    updatePage(p => ({ ...p, blocks: [...p.blocks, { id: `b${Date.now()}`, type, label: `${meta.label} nuevo`, config: {} }] }))
    setAddBlockOpen(false)
  }

  const toggleStatus = () => {
    updatePage(p => ({ ...p, status: p.status === 'published' ? 'draft' : 'published' }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
  }

  const handleCreatePage = () => {
    if (!newPage.title || !newPage.slug) return
    const slug = newPage.slug.startsWith('/') ? newPage.slug : `/${newPage.slug}`
    const page: CMSPage = {
      id: Date.now().toString(), title: newPage.title, slug,
      status: 'draft', template: newPage.template,
      updatedAt: new Date().toISOString().split('T')[0],
      seo: { title: '', description: '', keywords: '', ogImage: '' },
      blocks: [],
    }
    setPages(prev => [...prev, page])
    setSelectedPageId(page.id)
    setShowNewPageModal(false)
    setNewPage({ title: '', slug: '', template: 'LANDING' })
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Page list */}
      <aside className="w-64 flex-shrink-0 flex flex-col gap-3">
        <button
          onClick={() => setShowNewPageModal(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={14} /> Nueva Página
        </button>

        <div className="space-y-1">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selectedPageId === page.id
                  ? 'bg-orange-500/10 border border-orange-500/30 text-orange-300'
                  : 'hover:bg-zinc-800 text-zinc-400 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate">{page.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  page.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-500'
                }`}>
                  {page.status === 'published' ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5 font-mono">{page.slug}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3 flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">{selectedPage.title}</h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedPage.slug} · editado {selectedPage.updatedAt}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={selectedPage.slug} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <Eye size={13} /> Preview <ExternalLink size={11} />
            </a>
            <button onClick={toggleStatus}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                selectedPage.status === 'published'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                  : 'bg-zinc-700 border-zinc-600 text-zinc-400 hover:bg-zinc-600'
              }`}
            >
              {selectedPage.status === 'published'
                ? <><ToggleRight size={14} /> Publicado</>
                : <><ToggleLeft size={14} /> Borrador</>}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              <Save size={13} /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-zinc-800 border border-zinc-700 rounded-lg p-1 w-fit">
          {(['blocks', 'seo'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab ? 'bg-zinc-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'blocks' ? '📐 Secciones' : '🔍 SEO'}
            </button>
          ))}
        </div>

        {/* Blocks */}
        {activeTab === 'blocks' && (
          <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedPage.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {selectedPage.blocks.map(block => (
                  <SortableBlock key={block.id} block={block} onEdit={() => {}} onRemove={(id) => updatePage(p => ({ ...p, blocks: p.blocks.filter(b => b.id !== id) }))} />
                ))}
              </SortableContext>
            </DndContext>

            {selectedPage.blocks.length === 0 && (
              <div className="text-center py-16 text-zinc-600">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Esta página no tiene secciones aún</p>
              </div>
            )}

            {addBlockOpen ? (
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <p className="text-sm font-medium text-zinc-300 mb-3">Elige un tipo de bloque:</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_TYPES.map(bt => (
                    <button key={bt.type} onClick={() => addBlock(bt.type)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all hover:brightness-110 ${bt.color}`}
                    >
                      <span>{bt.icon}</span> {bt.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setAddBlockOpen(false)} className="mt-3 w-full text-xs text-zinc-600 hover:text-zinc-400">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setAddBlockOpen(true)}
                className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-xl text-sm text-zinc-600 hover:border-orange-500/50 hover:text-orange-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Agregar sección
              </button>
            )}
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">SEO Meta</h3>
              {(() => {
                const seo = selectedPage.seo
                const score = [seo.title, seo.description, seo.keywords].filter(Boolean).length
                return (
                  <span className={`text-xs font-medium ${score === 3 ? 'text-green-400' : score >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    SEO: {score === 3 ? 'Bueno' : score >= 2 ? 'Regular' : 'Deficiente'} ({score}/3)
                  </span>
                )
              })()}
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-700 font-mono text-xs">
              <p className="text-blue-400 truncate">{selectedPage.seo.title || 'Sin título SEO'}</p>
              <p className="text-green-500">https://istore.pro{selectedPage.slug}</p>
              <p className="text-zinc-500 mt-1 line-clamp-2">{selectedPage.seo.description || 'Sin descripción'}</p>
            </div>
            {[
              { key: 'title', label: 'Título SEO', max: 60, type: 'input' },
              { key: 'description', label: 'Descripción', max: 160, type: 'textarea' },
              { key: 'keywords', label: 'Keywords', max: 999, type: 'input' },
              { key: 'ogImage', label: 'OG Image URL', max: 999, type: 'input' },
            ].map(({ key, label, max, type }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-500 mb-1">{label} {max < 999 && <span className="text-zinc-600">(max {max})</span>}</label>
                {type === 'textarea' ? (
                  <textarea
                    maxLength={max}
                    value={selectedPage.seo[key as keyof typeof selectedPage.seo]}
                    onChange={e => updatePage(p => ({ ...p, seo: { ...p.seo, [key]: e.target.value } }))}
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                  />
                ) : (
                  <input
                    maxLength={max < 999 ? max : undefined}
                    value={selectedPage.seo[key as keyof typeof selectedPage.seo]}
                    onChange={e => updatePage(p => ({ ...p, seo: { ...p.seo, [key]: e.target.value } }))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                )}
                {max < 999 && <p className="text-xs text-zinc-600 mt-0.5">{selectedPage.seo[key as keyof typeof selectedPage.seo].length}/{max}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New page modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Nueva Página</h3>
              <button onClick={() => setShowNewPageModal(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Título</label>
                <input value={newPage.title} onChange={e => setNewPage(p => ({ ...p, title: e.target.value }))}
                  placeholder="Landing - Accesorios"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Slug (URL)</label>
                <input value={newPage.slug} onChange={e => setNewPage(p => ({ ...p, slug: e.target.value }))}
                  placeholder="/accesorios"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Template</label>
                <select value={newPage.template} onChange={e => setNewPage(p => ({ ...p, template: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {['HOME', 'LANDING', 'CATEGORY', 'BRAND', 'BLOG', 'CUSTOM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowNewPageModal(false)}
                className="flex-1 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800"
              >Cancelar</button>
              <button onClick={handleCreatePage}
                className="flex-1 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >Crear Página</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Site Config Tab ----------------------------------------------------------

function SiteConfigTab() {
  const [config, setConfig] = useState<SiteConfig>(INITIAL_CONFIG)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (key: keyof SiteConfig, value: string) => setConfig(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  type FieldItemProps = { label: string; configKey: keyof SiteConfig; type?: string; placeholder?: string }
  const Field = (fp: FieldItemProps) => (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{fp.label}</label>
      <input
        type={fp.type ?? 'text'}
        value={config[fp.configKey]}
        onChange={e => update(fp.configKey, e.target.value)}
        placeholder={fp.placeholder ?? ''}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Configuración del Sitio</h2>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {saved ? <><Check size={14} /> Guardado</> : <><Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}</>}
        </button>
      </div>

      {/* General */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Settings size={14} /> General</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre de la tienda" configKey="storeName" placeholder="iStore Pro" />
          <Field label="Moneda" configKey="currency" placeholder="MXN" />
          <Field label="Logo URL" configKey="logo" placeholder="https://..." />
          <Field label="Favicon URL" configKey="favicon" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Zona horaria</label>
          <select value={config.timezone} onChange={e => update('timezone', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
            <option value="America/Monterrey">Monterrey (UTC-6)</option>
            <option value="America/Tijuana">Tijuana (UTC-8)</option>
            <option value="America/New_York">Nueva York (UTC-5)</option>
          </select>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Phone size={14} /> Contacto</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email de contacto" configKey="contactEmail" type="email" placeholder="hola@istore.pro" />
          <Field label="Teléfono" configKey="contactPhone" placeholder="+52 55 1234 5678" />
        </div>
        <Field label="Dirección" configKey="address" placeholder="Av. Tecnológica 123, CDMX" />
      </div>

      {/* Colors */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Palette size={14} /> Colores de Marca</h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Color primario', key: 'primaryColor' as keyof SiteConfig },
            { label: 'Color secundario', key: 'secondaryColor' as keyof SiteConfig },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-zinc-500 mb-2">{label}</label>
              <div className="flex items-center gap-3">
                <input type="color" value={config[key]} onChange={e => update(key, e.target.value)}
                  className="w-10 h-10 rounded-lg border border-zinc-600 bg-transparent cursor-pointer p-0.5"
                />
                <input value={config[key]} onChange={e => update(key, e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Link size={14} /> Redes Sociales</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'facebook' as keyof SiteConfig, label: 'Facebook', icon: Facebook, placeholder: 'usuario' },
            { key: 'instagram' as keyof SiteConfig, label: 'Instagram', icon: Instagram, placeholder: 'usuario' },
            { key: 'twitter' as keyof SiteConfig, label: 'Twitter / X', icon: Twitter, placeholder: 'usuario' },
            { key: 'youtube' as keyof SiteConfig, label: 'YouTube', icon: Youtube, placeholder: 'canal' },
            { key: 'tiktok' as keyof SiteConfig, label: 'TikTok', icon: Link, placeholder: '@usuario' },
            { key: 'whatsapp' as keyof SiteConfig, label: 'WhatsApp', icon: Phone, placeholder: '+525512345678' },
          ].map((socialItem) => (
            <div key={key}>
              <label className="block text-xs text-zinc-500 mb-1 flex items-center gap-1"><Icon size={11} /> {label}</label>
              <input value={config[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Banners Tab --------------------------------------------------------------

function BannersTab() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS)
  const [filterZone, setFilterZone] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<BannerItem>>({
    name: '', zone: 'HERO_MAIN', title: '', subtitle: '', cta: '', ctaUrl: '',
    image: '', isActive: true, sortOrder: 1, startsAt: '', endsAt: '',
  })

  const zones = ['ALL', ...BANNER_ZONES]
  const filtered = filterZone === 'ALL' ? banners : banners.filter(b => b.zone === filterZone)

  const openNew = () => {
    setEditingId(null)
    setForm({ name: '', zone: 'HERO_MAIN', title: '', subtitle: '', cta: '', ctaUrl: '', image: '', isActive: true, sortOrder: 1, startsAt: '', endsAt: '' })
    setShowForm(true)
  }

  const openEdit = (b: BannerItem) => {
    setEditingId(b.id)
    setForm({ ...b })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.zone) return
    if (editingId) {
      setBanners(prev => prev.map(b => b.id === editingId ? { ...b, ...form } as BannerItem : b))
    } else {
      setBanners(prev => [...prev, { ...form, id: Date.now().toString() } as BannerItem])
    }
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id))
  }

  const toggleActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b))
  }

  const ZONE_COLORS: Record<string, string> = {
    HERO_MAIN: 'bg-purple-500/20 text-purple-300',
    HERO_SECONDARY: 'bg-indigo-500/20 text-indigo-300',
    HOME_MIDDLE: 'bg-blue-500/20 text-blue-300',
    HOME_BOTTOM: 'bg-cyan-500/20 text-cyan-300',
    CATEGORY_TOP: 'bg-teal-500/20 text-teal-300',
    SIDEBAR: 'bg-green-500/20 text-green-300',
    POPUP: 'bg-yellow-500/20 text-yellow-300',
    ANNOUNCEMENT: 'bg-orange-500/20 text-orange-300',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {zones.map(z => (
            <button key={z} onClick={() => setFilterZone(z)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterZone === z ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              {z === 'ALL' ? 'Todas las zonas' : z.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <button onClick={openNew}
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Nuevo Banner
        </button>
      </div>

      {/* Banner grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(banner => (
          <div key={banner.id} className={`bg-zinc-800 border rounded-xl overflow-hidden transition-all ${banner.isActive ? 'border-zinc-700' : 'border-zinc-800 opacity-60'}`}>
            {/* Preview */}
            <div className="bg-zinc-900 h-28 flex items-center justify-center relative">
              {banner.image ? (
                <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-zinc-700 text-center">
                  <Image size={28} className="mx-auto mb-1 opacity-40" />
                  <p className="text-xs opacity-40">Sin imagen</p>
                </div>
              )}
              {/* Drag handle visual */}
              <div className="absolute top-2 left-2 text-zinc-600 cursor-grab">
                <GripVertical size={14} />
              </div>
              {/* Sort order */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                #{banner.sortOrder}
              </div>
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{banner.name}</p>
                  {banner.title && <p className="text-xs text-zinc-500 truncate">{banner.title}</p>}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${ZONE_COLORS[banner.zone] ?? 'bg-zinc-700 text-zinc-400'}`}>
                  {banner.zone.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => toggleActive(banner.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    banner.isActive ? 'text-green-400 hover:text-green-300' : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  {banner.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  {banner.isActive ? 'Activo' : 'Inactivo'}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(banner)}
                    className="text-zinc-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-orange-500/10 transition-colors"
                  ><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(banner.id)}
                    className="text-zinc-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-zinc-600">
            <Image size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay banners en esta zona</p>
          </div>
        )}
      </div>

      {/* Banner form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">{editingId ? 'Editar Banner' : 'Nuevo Banner'}</h3>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-zinc-500 mb-1">Nombre interno *</label>
                  <input value={form.name ?? ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Hero Black Friday 2025"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Zona *</label>
                  <select value={form.zone ?? 'HERO_MAIN'} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {BANNER_ZONES.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Orden</label>
                  <input type="number" min="1" value={form.sortOrder ?? 1} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Título</label>
                  <input value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Black Friday"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Subtítulo</label>
                  <input value={form.subtitle ?? ''} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Hasta 40% OFF"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Texto del CTA</label>
                  <input value={form.cta ?? ''} onChange={e => setForm(p => ({ ...p, cta: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Ver ofertas"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">URL del CTA</label>
                  <input value={form.ctaUrl ?? ''} onChange={e => setForm(p => ({ ...p, ctaUrl: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="/ofertas"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-zinc-500 mb-1">Imagen (URL o subir a Cloudinary)</label>
                  <input value={form.image ?? ''} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Fecha inicio</label>
                  <input type="date" value={form.startsAt ?? ''} onChange={e => setForm(p => ({ ...p, startsAt: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Fecha fin</label>
                  <input type="date" value={form.endsAt ?? ''} onChange={e => setForm(p => ({ ...p, endsAt: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <button onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                    className={`flex items-center gap-2 text-sm font-medium ${form.isActive ? 'text-green-400' : 'text-zinc-500'}`}
                  >
                    {form.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    {form.isActive ? 'Banner activo' : 'Banner inactivo'}
                  </button>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-5 py-4 flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800"
              >Cancelar</button>
              <button onClick={handleSave}
                className="flex-1 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >{editingId ? 'Actualizar' : 'Crear Banner'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Menus Tab ----------------------------------------------------------------

function MenusTab() {
  const [menus, setMenus] = useState<MenuData[]>(INITIAL_MENUS)
  const [selectedMenuId, setSelectedMenuId] = useState<string>('main')
  const [newItemLabel, setNewItemLabel] = useState('')
  const [newItemHref, setNewItemHref] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedMenu = menus.find(m => m.id === selectedMenuId)!

  const addItem = () => {
    if (!newItemLabel) return
    const item: MenuItem = { id: Date.now().toString(), label: newItemLabel, href: newItemHref || '#', target: '_self', children: [] }
    setMenus(prev => prev.map(m => m.id === selectedMenuId ? { ...m, items: [...m.items, item] } : m))
    setNewItemLabel('')
    setNewItemHref('')
  }

  const removeItem = (itemId: string) => {
    setMenus(prev => prev.map(m => m.id === selectedMenuId ? { ...m, items: m.items.filter(i => i.id !== itemId) } : m))
  }

  const updateItem = (itemId: string, field: 'label' | 'href' | 'target', value: string) => {
    setMenus(prev => prev.map(m => m.id === selectedMenuId
      ? { ...m, items: m.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
      : m
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
  }

  return (
    <div className="flex gap-6">
      {/* Menu selector */}
      <aside className="w-52 flex-shrink-0 space-y-1">
        {menus.map(m => (
          <button key={m.id} onClick={() => setSelectedMenuId(m.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
              selectedMenuId === m.id
                ? 'bg-orange-500/10 border border-orange-500/30 text-orange-300'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <p className="text-sm font-medium">{m.name}</p>
            <p className="text-xs text-zinc-600 font-mono mt-0.5">{m.handle}</p>
          </button>
        ))}
      </aside>

      {/* Menu editor */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">{selectedMenu.name}</h3>
            <p className="text-xs text-zinc-500 font-mono">{selectedMenu.handle}</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={13} /> {saving ? 'Guardando...' : 'Guardar menú'}
          </button>
        </div>

        {/* Items */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-700 bg-zinc-900/50">
            <p className="text-xs font-medium text-zinc-400">{selectedMenu.items.length} ítems en este menú</p>
          </div>
          <div className="divide-y divide-zinc-700/50">
            {selectedMenu.items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 group">
                <GripVertical size={14} className="text-zinc-600 cursor-grab flex-shrink-0" />
                <span className="text-xs text-zinc-600 w-4">{idx + 1}</span>
                <input value={item.label} onChange={e => updateItem(item.id, 'label', e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <input value={item.href} onChange={e => updateItem(item.id, 'href', e.target.value)}
                  className="w-40 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-zinc-400 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="/ruta"
                />
                <select value={item.target} onChange={e => updateItem(item.id, 'target', e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-400 focus:outline-none"
                >
                  <option value="_self">mismo tab</option>
                  <option value="_blank">nueva pestaña</option>
                </select>
                <button onClick={() => removeItem(item.id)}
                  className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                ><Trash2 size={13} /></button>
              </div>
            ))}
          </div>

          {/* Add item */}
          <div className="px-4 py-3 border-t border-zinc-700 bg-zinc-900/30 flex items-center gap-2">
            <input value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)}
              placeholder="Etiqueta del ítem"
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input value={newItemHref} onChange={e => setNewItemHref(e.target.value)}
              placeholder="/ruta"
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className="w-32 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-400 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button onClick={addItem}
              className="flex items-center gap-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ----------------------------------------------------------------

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('pages')

  const tabs: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'pages',       label: 'Páginas',         icon: <FileText size={15} /> },
    { id: 'site-config', label: 'Config del Sitio', icon: <Settings size={15} /> },
    { id: 'banners',     label: 'Banners',          icon: <Image size={15} /> },
    { id: 'menus',       label: 'Menús',            icon: <Menu size={15} /> },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/20 text-orange-400 rounded-lg p-2"><Globe size={18} /></div>
          <div>
            <h1 className="text-xl font-bold text-white">CMS</h1>
            <p className="text-sm text-zinc-500">Gestión de contenido del sitio</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6">
        <nav className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'pages'       && <PagesTab />}
        {activeTab === 'site-config' && <SiteConfigTab />}
        {activeTab === 'banners'     && <BannersTab />}
        {activeTab === 'menus'       && <MenusTab />}
      </div>
    </div>
  )
}
