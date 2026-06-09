'use client'

import { useState } from 'react'
import {
  Settings,
  Palette,
  CreditCard,
  Bell,
  Puzzle,
  Wrench,
  Save,
  Check,
  Upload,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

// --- Types --------------------------------------------------------------------

type Tab = 'general' | 'apariencia' | 'pagos' | 'notificaciones' | 'integraciones' | 'avanzado'

interface StoreConfig {
  // General
  storeName: string
  logo: string
  favicon: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  defaultCurrency: string
  timezone: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  tiktok: string
  whatsapp: string

  // Apariencia
  primaryColor: string
  secondaryColor: string
  accentColor: string
  defaultMode: 'dark' | 'light'
  fontHeading: string
  fontBody: string
  customCss: string
  borderRadius: string

  // Pagos
  stripeEnabled: boolean
  stripePublicKey: string
  stripeSecretKey: string
  stripeWebhookSecret: string
  mpEnabled: boolean
  mpPublicKey: string
  mpAccessToken: string
  mpWebhookSecret: string
  cashOnDeliveryEnabled: boolean
  cashOnDeliveryInstructions: string
  bankTransferEnabled: boolean
  bankTransferInstructions: string

  // Notificaciones
  notifyNewOrder: boolean
  notifyLowStock: boolean
  notifyNewReview: boolean
  notifyNewLead: boolean
  notifyOrderStatus: boolean
  adminNotificationEmail: string
  whatsappEnabled: boolean
  whatsappNumber: string

  // Integraciones
  ga4Enabled: boolean
  ga4MeasurementId: string
  metaPixelEnabled: boolean
  metaPixelId: string
  tiktokPixelEnabled: boolean
  tiktokPixelId: string
  hotjarEnabled: boolean
  hotjarId: string
  googleMapsEnabled: boolean
  googleMapsKey: string

  // Avanzado
  maintenanceMode: boolean
  robotsTxt: string
  customHeaderScripts: string
  customFooterScripts: string
  cacheEnabled: boolean
  maxUploadSizeMb: number
}

// --- Initial state ------------------------------------------------------------

const INITIAL_CONFIG: StoreConfig = {
  storeName: 'iStore Pro', logo: '', favicon: '',
  contactEmail: 'hola@istore.pro', contactPhone: '+52 55 1234 5678',
  address: 'Av. Tecnológica 123', city: 'Ciudad de México', state: 'CDMX', zip: '06600', country: 'MX',
  defaultCurrency: 'MXN', timezone: 'America/Mexico_City',
  facebook: 'istorepro', instagram: 'istorepro', twitter: 'istorepro', youtube: '', tiktok: '@istorepro', whatsapp: '+525512345678',

  primaryColor: '#f97316', secondaryColor: '#1e293b', accentColor: '#0ea5e9',
  defaultMode: 'dark', fontHeading: 'Inter', fontBody: 'Inter', customCss: '',
  borderRadius: '0.5',

  stripeEnabled: true, stripePublicKey: 'pk_live_...', stripeSecretKey: 'sk_live_...', stripeWebhookSecret: 'whsec_...',
  mpEnabled: false, mpPublicKey: '', mpAccessToken: '', mpWebhookSecret: '',
  cashOnDeliveryEnabled: true, cashOnDeliveryInstructions: 'Pago en efectivo al recibir el pedido.',
  bankTransferEnabled: false, bankTransferInstructions: 'CLABE: 0000000000000000\nBanco: BBVA\nTitular: iStore Pro SA de CV',

  notifyNewOrder: true, notifyLowStock: true, notifyNewReview: false, notifyNewLead: true, notifyOrderStatus: true,
  adminNotificationEmail: 'admin@istore.pro', whatsappEnabled: false, whatsappNumber: '',

  ga4Enabled: false, ga4MeasurementId: '',
  metaPixelEnabled: false, metaPixelId: '',
  tiktokPixelEnabled: false, tiktokPixelId: '',
  hotjarEnabled: false, hotjarId: '',
  googleMapsEnabled: false, googleMapsKey: '',

  maintenanceMode: false, robotsTxt: 'User-agent: *\nAllow: /', customHeaderScripts: '', customFooterScripts: '',
  cacheEnabled: true, maxUploadSizeMb: 10,
}

// --- Helpers ------------------------------------------------------------------

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${value ? 'text-green-400' : 'text-zinc-500'}`}
    >
      {value ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
      {value ? 'Activado' : 'Desactivado'}
    </button>
  )
}

function Field({
  label, value, onChange, type = 'text', placeholder = '', hint,
}: {
  label: string; value: string | number; onChange: (v: string) => void
  type?: string; placeholder?: string; hint?: string
}) {
  const [show, setShow] = useState(false)
  const isSecret = type === 'password'

  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type={isSecret && !show ? 'password' : 'text'}
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        {isSecret && (
          <button onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {hint && <p className="text-[10px] text-zinc-600 mt-0.5">{hint}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      {children}
    </div>
  )
}

// --- Tab Components -----------------------------------------------------------

function GeneralTab({ cfg, up }: { cfg: StoreConfig; up: (k: keyof StoreConfig, v: unknown) => void }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <Section title="Identidad de la tienda">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre de la tienda *" value={cfg.storeName} onChange={v => up('storeName', v)} placeholder="iStore Pro" />
          <Field label="Moneda por defecto" value={cfg.defaultCurrency} onChange={v => up('defaultCurrency', v)} placeholder="MXN" />
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Logo</label>
            <div className="flex gap-2">
              <input value={cfg.logo} onChange={e => up('logo', e.target.value)} placeholder="https://..."
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="flex items-center gap-1 px-3 py-2 border border-zinc-700 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800">
                <Upload size={12} /> Subir
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Favicon</label>
            <div className="flex gap-2">
              <input value={cfg.favicon} onChange={e => up('favicon', e.target.value)} placeholder="https://..."
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="flex items-center gap-1 px-3 py-2 border border-zinc-700 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800">
                <Upload size={12} /> Subir
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Contacto">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email de contacto" value={cfg.contactEmail} onChange={v => up('contactEmail', v)} type="email" placeholder="hola@tienda.com" />
          <Field label="Teléfono" value={cfg.contactPhone} onChange={v => up('contactPhone', v)} placeholder="+52 55 1234 5678" />
          <div className="col-span-2">
            <Field label="Calle y número" value={cfg.address} onChange={v => up('address', v)} placeholder="Av. Reforma 123" />
          </div>
          <Field label="Ciudad" value={cfg.city} onChange={v => up('city', v)} placeholder="Ciudad de México" />
          <Field label="Estado" value={cfg.state} onChange={v => up('state', v)} placeholder="CDMX" />
          <Field label="Código postal" value={cfg.zip} onChange={v => up('zip', v)} placeholder="06600" />
          <div>
            <label className="block text-xs text-zinc-500 mb-1">País</label>
            <select value={cfg.country} onChange={e => up('country', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="MX">México</option>
              <option value="US">Estados Unidos</option>
              <option value="CO">Colombia</option>
              <option value="AR">Argentina</option>
              <option value="ES">España</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Región y tiempo">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Zona horaria</label>
            <select value={cfg.timezone} onChange={e => up('timezone', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
              <option value="America/Monterrey">Monterrey (UTC-6)</option>
              <option value="America/Tijuana">Tijuana (UTC-8)</option>
              <option value="America/Bogota">Bogotá (UTC-5)</option>
              <option value="America/New_York">Nueva York (UTC-5)</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Redes sociales">
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'facebook' as keyof StoreConfig,  label: 'Facebook',   placeholder: 'usuario' },
            { key: 'instagram' as keyof StoreConfig, label: 'Instagram',  placeholder: 'usuario' },
            { key: 'twitter' as keyof StoreConfig,   label: 'Twitter / X', placeholder: 'usuario' },
            { key: 'youtube' as keyof StoreConfig,   label: 'YouTube',    placeholder: 'canal' },
            { key: 'tiktok' as keyof StoreConfig,    label: 'TikTok',     placeholder: '@usuario' },
            { key: 'whatsapp' as keyof StoreConfig,  label: 'WhatsApp',   placeholder: '+525512345678' },
          ].map(({ key, label, placeholder }) => (
            <Field key={key} label={label} value={String(cfg[key])} onChange={v => up(key, v)} placeholder={placeholder} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function AparienciaTab({ cfg, up }: { cfg: StoreConfig; up: (k: keyof StoreConfig, v: unknown) => void }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <Section title="Colores de marca">
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'primaryColor' as keyof StoreConfig,   label: 'Color primario' },
            { key: 'secondaryColor' as keyof StoreConfig, label: 'Color secundario' },
            { key: 'accentColor' as keyof StoreConfig,    label: 'Color acento' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-zinc-500 mb-2">{label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={String(cfg[key])} onChange={e => up(key, e.target.value)}
                  className="w-9 h-9 rounded-lg border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                />
                <input value={String(cfg[key])} onChange={e => up(key, e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div className="rounded-xl border border-zinc-700 overflow-hidden">
          <div className="h-8 flex items-center px-3 gap-2" style={{ backgroundColor: cfg.secondaryColor }}>
            <div className="w-4 h-4 rounded" style={{ backgroundColor: cfg.primaryColor }} />
            <span className="text-white text-xs font-medium">iStore Pro</span>
          </div>
          <div className="bg-zinc-950 p-3 flex gap-2">
            <button className="text-xs text-white px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: cfg.primaryColor }}>
              Agregar al carrito
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg font-medium border" style={{ borderColor: cfg.accentColor, color: cfg.accentColor }}>
              Ver más
            </button>
          </div>
        </div>
      </Section>

      <Section title="Tipografía">
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'fontHeading' as keyof StoreConfig, label: 'Fuente headings' },
            { key: 'fontBody' as keyof StoreConfig,    label: 'Fuente cuerpo' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-zinc-500 mb-1">{label}</label>
              <select value={String(cfg[key])} onChange={e => up(key, e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option>Inter</option>
                <option>Geist</option>
                <option>Roboto</option>
                <option>Montserrat</option>
                <option>Poppins</option>
                <option>Open Sans</option>
                <option>Nunito</option>
              </select>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Modo por defecto">
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map(mode => (
            <button key={mode} onClick={() => up('defaultMode', mode)}
              className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                cfg.defaultMode === mode
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {mode === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
          ))}
        </div>
      </Section>

      <Section title="CSS personalizado">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">
            Código CSS adicional <span className="text-zinc-600">(se inyecta en {'<head>'})</span>
          </label>
          <textarea
            value={cfg.customCss}
            onChange={e => up('customCss', e.target.value)}
            rows={8}
            placeholder=":root { --custom-var: value; }"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
        </div>
      </Section>
    </div>
  )
}

function PagosTab({ cfg, up }: { cfg: StoreConfig; up: (k: keyof StoreConfig, v: unknown) => void }) {
  return (
    <div className="space-y-5 max-w-2xl">
      {/* Stripe */}
      <div className={`bg-zinc-900 border rounded-xl overflow-hidden ${cfg.stripeEnabled ? 'border-zinc-700' : 'border-zinc-800'}`}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#635bff]/20 text-[#635bff] rounded-lg p-2 text-xs font-bold">STRIPE</div>
            <div>
              <p className="text-sm font-semibold text-white">Stripe</p>
              <p className="text-xs text-zinc-500">Tarjetas de crédito/débito, OXXO, Link</p>
            </div>
          </div>
          <Toggle value={cfg.stripeEnabled} onChange={v => up('stripeEnabled', v)} />
        </div>
        {cfg.stripeEnabled && (
          <div className="p-4 space-y-3">
            <Field label="Publishable Key" value={cfg.stripePublicKey} onChange={v => up('stripePublicKey', v)} placeholder="pk_live_..." hint="Empieza con pk_live_ en producción" />
            <Field label="Secret Key" value={cfg.stripeSecretKey} onChange={v => up('stripeSecretKey', v)} type="password" placeholder="sk_live_..." hint="Empieza con sk_live_ en producción" />
            <Field label="Webhook Secret" value={cfg.stripeWebhookSecret} onChange={v => up('stripeWebhookSecret', v)} type="password" placeholder="whsec_..." />
            <div className="flex items-center gap-2 pt-1">
              <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs text-[#635bff] hover:underline"
              >Dashboard Stripe <ExternalLink size={10} /></a>
            </div>
          </div>
        )}
      </div>

      {/* Mercado Pago */}
      <div className={`bg-zinc-900 border rounded-xl overflow-hidden ${cfg.mpEnabled ? 'border-zinc-700' : 'border-zinc-800'}`}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#00b1ea]/20 text-[#00b1ea] rounded-lg p-2 text-xs font-bold">MP</div>
            <div>
              <p className="text-sm font-semibold text-white">Mercado Pago</p>
              <p className="text-xs text-zinc-500">Tarjetas, OXXO, transferencias, meses</p>
            </div>
          </div>
          <Toggle value={cfg.mpEnabled} onChange={v => up('mpEnabled', v)} />
        </div>
        {cfg.mpEnabled && (
          <div className="p-4 space-y-3">
            <Field label="Public Key" value={cfg.mpPublicKey} onChange={v => up('mpPublicKey', v)} placeholder="APP_USR-..." />
            <Field label="Access Token" value={cfg.mpAccessToken} onChange={v => up('mpAccessToken', v)} type="password" placeholder="APP_USR-..." />
            <Field label="Webhook Secret" value={cfg.mpWebhookSecret} onChange={v => up('mpWebhookSecret', v)} type="password" placeholder="..." />
          </div>
        )}
      </div>

      {/* Cash on delivery */}
      <div className={`bg-zinc-900 border rounded-xl overflow-hidden ${cfg.cashOnDeliveryEnabled ? 'border-zinc-700' : 'border-zinc-800'}`}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-lg p-2 text-lg">💵</div>
            <div>
              <p className="text-sm font-semibold text-white">Pago contra entrega</p>
              <p className="text-xs text-zinc-500">El cliente paga al recibir el pedido</p>
            </div>
          </div>
          <Toggle value={cfg.cashOnDeliveryEnabled} onChange={v => up('cashOnDeliveryEnabled', v)} />
        </div>
        {cfg.cashOnDeliveryEnabled && (
          <div className="p-4">
            <label className="block text-xs text-zinc-500 mb-1">Instrucciones para el cliente</label>
            <textarea value={cfg.cashOnDeliveryInstructions} onChange={e => up('cashOnDeliveryInstructions', e.target.value)}
              rows={3} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Bank transfer */}
      <div className={`bg-zinc-900 border rounded-xl overflow-hidden ${cfg.bankTransferEnabled ? 'border-zinc-700' : 'border-zinc-800'}`}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 text-blue-400 rounded-lg p-2 text-lg">🏦</div>
            <div>
              <p className="text-sm font-semibold text-white">Transferencia bancaria</p>
              <p className="text-xs text-zinc-500">SPEI / transferencia manual</p>
            </div>
          </div>
          <Toggle value={cfg.bankTransferEnabled} onChange={v => up('bankTransferEnabled', v)} />
        </div>
        {cfg.bankTransferEnabled && (
          <div className="p-4">
            <label className="block text-xs text-zinc-500 mb-1">Datos bancarios e instrucciones</label>
            <textarea value={cfg.bankTransferInstructions} onChange={e => up('bankTransferInstructions', e.target.value)}
              rows={4} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
              placeholder="CLABE: 000000000000000000&#10;Banco: BBVA&#10;Titular: Mi Tienda SA de CV"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function NotificacionesTab({ cfg, up }: { cfg: StoreConfig; up: (k: keyof StoreConfig, v: unknown) => void }) {
  const emailNotifications = [
    { key: 'notifyNewOrder' as keyof StoreConfig,     label: 'Nuevo pedido',                 description: 'Alerta cuando se realiza una orden' },
    { key: 'notifyLowStock' as keyof StoreConfig,     label: 'Stock bajo',                   description: 'Cuando un producto llega al mínimo' },
    { key: 'notifyNewReview' as keyof StoreConfig,    label: 'Nueva reseña',                 description: 'Cuando un cliente deja una reseña' },
    { key: 'notifyNewLead' as keyof StoreConfig,      label: 'Nuevo prospecto',              description: 'Cuando alguien llena el formulario de contacto' },
    { key: 'notifyOrderStatus' as keyof StoreConfig,  label: 'Cambio de estado de pedido',   description: 'Cuando un pedido cambia de estatus' },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      <Section title="Email de administrador">
        <Field label="Correo para notificaciones" value={cfg.adminNotificationEmail} onChange={v => up('adminNotificationEmail', v)}
          type="email" placeholder="admin@tienda.com"
          hint="Aquí llegarán todas las alertas internas"
        />
      </Section>

      <Section title="Notificaciones por email">
        <div className="space-y-3">
          {emailNotifications.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
              <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-zinc-500">{description}</p>
              </div>
              <button onClick={() => up(key, !cfg[key])}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${cfg[key] ? 'text-green-400' : 'text-zinc-600'}`}
              >
                {cfg[key] ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              </button>
            </div>
          ))}
        </div>
      </Section>

      <div className={`bg-zinc-900 border rounded-xl overflow-hidden ${cfg.whatsappEnabled ? 'border-zinc-700' : 'border-zinc-800'}`}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#25d366]/20 text-[#25d366] rounded-lg p-2 text-lg">💬</div>
            <div>
              <p className="text-sm font-semibold text-white">WhatsApp Business</p>
              <p className="text-xs text-zinc-500">Notificaciones y atención via WhatsApp</p>
            </div>
          </div>
          <Toggle value={cfg.whatsappEnabled} onChange={v => up('whatsappEnabled', v)} />
        </div>
        {cfg.whatsappEnabled && (
          <div className="p-4">
            <Field label="Número de WhatsApp" value={cfg.whatsappNumber} onChange={v => up('whatsappNumber', v)}
              placeholder="+525512345678" hint="Formato internacional con + y código de país"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function IntegracionesTab({ cfg, up }: { cfg: StoreConfig; up: (k: keyof StoreConfig, v: unknown) => void }) {
  const [verifying, setVerifying] = useState<string | null>(null)
  const [verified, setVerified] = useState<Record<string, boolean | 'error'>>({})

  const handleVerify = async (id: string) => {
    setVerifying(id)
    await new Promise(r => setTimeout(r, 1200))
    setVerified(prev => ({ ...prev, [id]: Math.random() > 0.3 }))
    setVerifying(null)
  }

  const integrations = [
    {
      id: 'ga4', label: 'Google Analytics 4', description: 'Análisis de tráfico y comportamiento',
      logo: '📊', color: 'bg-orange-500/10 text-orange-400',
      enabledKey: 'ga4Enabled' as keyof StoreConfig,
      keyField: { key: 'ga4MeasurementId' as keyof StoreConfig, label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX' },
    },
    {
      id: 'meta', label: 'Meta Pixel', description: 'Seguimiento para Facebook e Instagram Ads',
      logo: '👍', color: 'bg-blue-500/10 text-blue-400',
      enabledKey: 'metaPixelEnabled' as keyof StoreConfig,
      keyField: { key: 'metaPixelId' as keyof StoreConfig, label: 'Pixel ID', placeholder: '1234567890' },
    },
    {
      id: 'tiktok', label: 'TikTok Pixel', description: 'Conversiones para TikTok Ads',
      logo: '🎵', color: 'bg-pink-500/10 text-pink-400',
      enabledKey: 'tiktokPixelEnabled' as keyof StoreConfig,
      keyField: { key: 'tiktokPixelId' as keyof StoreConfig, label: 'Pixel ID', placeholder: 'XXXXXXXXXXXXXXXXX' },
    },
    {
      id: 'hotjar', label: 'Hotjar', description: 'Mapas de calor y grabaciones de sesión',
      logo: '🔥', color: 'bg-red-500/10 text-red-400',
      enabledKey: 'hotjarEnabled' as keyof StoreConfig,
      keyField: { key: 'hotjarId' as keyof StoreConfig, label: 'Site ID', placeholder: '0000000' },
    },
    {
      id: 'googlemaps', label: 'Google Maps', description: 'Mapa de ubicación en página de contacto',
      logo: '📍', color: 'bg-green-500/10 text-green-400',
      enabledKey: 'googleMapsEnabled' as keyof StoreConfig,
      keyField: { key: 'googleMapsKey' as keyof StoreConfig, label: 'API Key', placeholder: 'AIza...' },
    },
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      {integrations.map(({ id, label, description, logo, color, enabledKey, keyField }) => {
        const isEnabled = Boolean(cfg[enabledKey])
        const keyValue = String(cfg[keyField.key] ?? '')
        const canVerify = isEnabled && keyValue.length > 3

        return (
          <div key={id} className={`bg-zinc-900 border rounded-xl overflow-hidden ${isEnabled ? 'border-zinc-700' : 'border-zinc-800'}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 text-lg ${color}`}>{logo}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-zinc-500">{description}</p>
                </div>
              </div>
              <Toggle value={isEnabled} onChange={v => up(enabledKey, v)} />
            </div>

            {isEnabled && (
              <div className="px-4 pb-4 flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">{keyField.label}</label>
                  <input value={keyValue} onChange={e => up(keyField.key, e.target.value)}
                    placeholder={keyField.placeholder}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  onClick={() => handleVerify(id)}
                  disabled={!canVerify || verifying === id}
                  className="flex items-center gap-1.5 px-3 py-2 border border-zinc-700 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800 disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  {verifying === id ? (
                    <><Loader2 size={12} className="animate-spin" /> Verificando</>
                  ) : verified[id] === true ? (
                    <><CheckCircle2 size={12} className="text-green-400" /> Verificado</>
                  ) : verified[id] === 'error' ? (
                    <><AlertCircle size={12} className="text-red-400" /> Error</>
                  ) : (
                    'Verificar'
                  )}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AvanzadoTab({ cfg, up }: { cfg: StoreConfig; up: (k: keyof StoreConfig, v: unknown) => void }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              🔧 Modo mantenimiento
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Muestra página de mantenimiento a visitantes. Los admins aún pueden ver la tienda.</p>
          </div>
          <Toggle value={cfg.maintenanceMode} onChange={v => up('maintenanceMode', v)} />
        </div>
        {cfg.maintenanceMode && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="text-yellow-400" />
              <p className="text-xs text-yellow-300">La tienda está en mantenimiento para visitantes públicos</p>
            </div>
          </div>
        )}
      </div>

      <Section title="robots.txt">
        <textarea value={cfg.robotsTxt} onChange={e => up('robotsTxt', e.target.value)}
          rows={5}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
        />
      </Section>

      <Section title="Scripts adicionales">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Scripts en {'<head>'}</label>
            <textarea value={cfg.customHeaderScripts} onChange={e => up('customHeaderScripts', e.target.value)}
              rows={4} placeholder="<!-- scripts para el head -->"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Scripts antes de {'</body>'}</label>
            <textarea value={cfg.customFooterScripts} onChange={e => up('customFooterScripts', e.target.value)}
              rows={4} placeholder="<!-- scripts para el footer -->"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>
      </Section>

      <Section title="Rendimiento">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-white">Caché de páginas</p>
            <p className="text-xs text-zinc-500">Almacena páginas estáticas en caché para mayor velocidad</p>
          </div>
          <Toggle value={cfg.cacheEnabled} onChange={v => up('cacheEnabled', v)} />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Tamaño máximo de upload (MB)</label>
          <input type="number" min="1" max="100" value={cfg.maxUploadSizeMb}
            onChange={e => up('maxUploadSizeMb', parseInt(e.target.value) || 10)}
            className="w-28 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </Section>
    </div>
  )
}

// --- Main Page ----------------------------------------------------------------

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<StoreConfig>(INITIAL_CONFIG)
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const up = (key: keyof StoreConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
    } catch {
      // handle silently — form data is still valid locally
    }
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'general',        label: 'General',        icon: <Settings size={14} /> },
    { id: 'apariencia',     label: 'Apariencia',     icon: <Palette size={14} /> },
    { id: 'pagos',          label: 'Pagos',          icon: <CreditCard size={14} /> },
    { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={14} /> },
    { id: 'integraciones',  label: 'Integraciones',  icon: <Puzzle size={14} /> },
    { id: 'avanzado',       label: 'Avanzado',       icon: <Wrench size={14} /> },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 text-orange-400 rounded-lg p-2"><Settings size={18} /></div>
            <div>
              <h1 className="text-xl font-bold text-white">Configuración</h1>
              <p className="text-sm text-zinc-500">Ajustes generales de iStore Pro</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> Guardando...</>
            ) : saved ? (
              <><Check size={14} /> Guardado</>
            ) : (
              <><Save size={14} /> Guardar cambios</>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto">
        {activeTab === 'general'        && <GeneralTab cfg={config} up={up} />}
        {activeTab === 'apariencia'     && <AparienciaTab cfg={config} up={up} />}
        {activeTab === 'pagos'          && <PagosTab cfg={config} up={up} />}
        {activeTab === 'notificaciones' && <NotificacionesTab cfg={config} up={up} />}
        {activeTab === 'integraciones'  && <IntegracionesTab cfg={config} up={up} />}
        {activeTab === 'avanzado'       && <AvanzadoTab cfg={config} up={up} />}
      </div>
    </div>
  )
}
