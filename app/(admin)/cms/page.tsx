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

const BLOCK_TYPES: { type: BlockType; label: string; icon: string; color: string }[] = [
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

function SortableBlock({ block, onEdit, onRemove }: { block: Block; onEdit: (id: string) => void; onRemove: (id: string) => void }) {
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
  const [pages, setPages] = useState<CMSPage[]>(INITIAL_PAGES)
  const [selectedPageId, setSelectedPageId] = useState<string>('home')
  const [activeTab, setActiveTab] = useState<'blocks' | 'seo'>('blocks')
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
    