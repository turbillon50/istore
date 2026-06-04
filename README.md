<div align="center">

# 📱 iStore Pro

### Sistema inteligente para talleres de reparación

**Celulares · Tablets · Computadoras · Accesorios · Refacciones**

Una aplicación web premium tipo SaaS, con diseño de nivel Apple, para el control
operativo completo de talleres de reparación.

`Next.js 14` · `React 18` · `TypeScript` · `Tailwind CSS` · `shadcn/ui` · `Recharts` · `PWA`

</div>

---

> ⚠️ **Versión demo (frontend).** Este proyecto es una demostración comercial
> **100% frontend**: no incluye backend, base de datos ni APIs reales. Todos los
> datos provienen de una capa simulada (`lib/mock-data.ts`). Está diseñado para
> verse y sentirse como un producto terminado, listo para presentaciones a clientes.

---

## 🎯 Objetivo

Ofrecer a un taller de reparación una **única plataforma** para administrar todo
su negocio: recepción de equipos, órdenes de servicio, diagnósticos técnicos,
inventario, ventas (POS), caja, clientes (CRM), notificaciones, reportes,
analytics y operación multisucursal — con una experiencia de usuario impecable.

## ✨ Características

- 🎨 **Diseño premium** inspirado en Apple, Linear, Stripe, Notion, Arc, Raycast, Vercel e iOS 26.
- 🌗 **Modo oscuro / claro** con paleta cuidada (fondo `#0A0A0A`, primario `#2563EB`).
- 📲 **PWA instalable** — manifest, service worker y soporte offline básico.
- 📱 **Responsive total** — desktop, tablet y mobile.
- ⌘ **Command Palette** global (`⌘/Ctrl + K`).
- 📊 **Gráficas interactivas** (área, barras y dona) con Recharts.
- 🤖 **iStore AI** — asistente de negocio con insights simulados.
- 🧩 Componentes premium: metric cards, tablas, timeline, drawer, modales, badges de estado, glass effects y micro-interacciones.

## 📸 Capturas

> Capturas reales de la app en ejecución (no son renders). Regenéralas con `npm run shots` (levanta el server en `:3120` y usa un Chromium headless).

| Landing | Dashboard | Detalle de orden |
|---|---|---|
| ![Landing](docs/screenshots/01-landing.png) | ![Dashboard](docs/screenshots/02-dashboard.png) | ![Orden](docs/screenshots/04-orden-detalle.png) |

| Diagnóstico | Punto de venta | Analytics |
|---|---|---|
| ![Diagnóstico](docs/screenshots/05-diagnosticos.png) | ![POS](docs/screenshots/08-pos.png) | ![Analytics](docs/screenshots/10-analytics.png) |

| iStore AI | Inventario | Móvil (PWA) |
|---|---|---|
| ![AI](docs/screenshots/11-istore-ai.png) | ![Inventario](docs/screenshots/06-inventario.png) | ![Móvil](docs/screenshots/13-mobile-dashboard.png) |

## 🧱 Arquitectura

```
istore/
├── app/
│   ├── layout.tsx            # Layout raíz (tema, fuentes, PWA)
│   ├── page.tsx              # Landing + Login
│   ├── login-card.tsx        # Tarjeta de autenticación (demo)
│   ├── icon.svg              # Favicon
│   └── (app)/                # Shell autenticado (sidebar + topbar)
│       ├── layout.tsx
│       ├── dashboard/        # KPIs, gráficas y actividad
│       ├── analytics/        # Inteligencia de negocio
│       ├── asistente/        # iStore AI
│       ├── recepciones/      # Alta de equipos (wizard)
│       ├── ordenes/          # Listado + detalle ([id]) tipo AppleCare
│       ├── diagnosticos/     # Checklist 17 puntos + reporte PDF
│       ├── inventario/       # Stock, márgenes y alertas
│       ├── clientes/         # CRM con ficha de cliente
│       ├── ventas/           # Punto de venta (POS)
│       ├── caja/             # Corte, ingresos y egresos
│       ├── notificaciones/   # Centro multicanal + mensajes automáticos
│       ├── reportes/         # Exportables (Excel / PDF)
│       ├── sucursales/       # Multisucursal y comparativos
│       ├── usuarios/         # Usuarios, roles y permisos
│       └── configuracion/    # Empresa, pagos, facturación, integraciones
├── components/
│   ├── ui/                   # Componentes base estilo shadcn
│   ├── layout/               # Sidebar, topbar, command palette, mobile nav
│   ├── charts.tsx            # Wrappers de Recharts
│   ├── metric-card.tsx
│   ├── status-badge.tsx
│   └── ...
├── lib/
│   ├── mock-data.ts          # "Cerebro" del demo (datos simulados)
│   └── utils.ts              # Helpers (formato, fechas, cn)
└── public/
    ├── manifest.json         # Manifest PWA
    ├── sw.js                 # Service worker
    └── icon*.svg             # Íconos de la app
```

## 🧩 Módulos

| Módulo | Descripción |
|---|---|
| **Dashboard** | 8 KPIs operativos, ventas/utilidad, ingresos por categoría, técnicos top y actividad. |
| **Recepciones** | Wizard de alta de equipo con datos, fotos y firma del cliente. |
| **Órdenes** | Tabla filtrable por estado + detalle con timeline tipo AppleCare. |
| **Diagnósticos** | Checklist técnico interactivo de 17 puntos y generación de reporte. |
| **Inventario** | Stock mínimo, alertas, costo, precio, margen y proveedor. |
| **Clientes (CRM)** | Fichas con historial, total gastado, visitas y etiquetas. |
| **Ventas (POS)** | Carrito, descuentos, IVA y métodos de pago. |
| **Caja** | Corte del día, ingresos/egresos y desglose por método. |
| **Notificaciones** | WhatsApp, correo, SMS, push y mensajes automáticos. |
| **Reportes** | Ventas, inventario, clientes, técnicos y utilidades. |
| **Analytics** | Tendencias mensuales, productividad y refacciones top. |
| **Sucursales** | Dashboard consolidado y ranking por ubicación. |
| **Usuarios** | Equipo, roles y permisos. |
| **Configuración** | Empresa, pagos, facturación e integraciones. |
| **iStore AI** | Asistente con insights y chat (demo). |

## 👥 Roles

`Administrador` · `Gerente` · `Técnico` · `Recepción` · `Cajero`

## 🚀 Puesta en marcha

```bash
npm install      # instalar dependencias
npm run dev      # entorno de desarrollo → http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
```

**Credenciales demo:** cualquier correo/contraseña funciona (o usa los valores
precargados). El botón *Continuar con Google* también entra directo.

## 🗺️ Roadmap

- [x] Frontend navegable completo (demo comercial)
- [x] PWA instalable + modo oscuro/claro
- [ ] Autenticación real (Clerk)
- [ ] Base de datos (Neon / Postgres + Drizzle)
- [ ] Pagos en vivo (Stripe / Mercado Pago)
- [ ] Notificaciones reales (WhatsApp, Resend, Twilio)
- [ ] Generación real de PDF y exportación a Excel
- [ ] App móvil nativa para técnicos

## 🔌 Futuras integraciones / stack sugerido (producción)

`Clerk` (auth) · `Neon` (Postgres) · `Drizzle ORM` · `React Query` ·
`Stripe` + `Mercado Pago` (pagos) · `Resend` (correo) · `Twilio` (SMS) ·
`UploadThing` (archivos) · `Recharts` (gráficas).

## 🎨 Paleta

| Token | Valor |
|---|---|
| Background | `#0A0A0A` |
| Cards | `#111111` |
| Borders | `#222222` |
| Primary | `#2563EB` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |

---

<div align="center">
<sub>iStore Pro · Demo comercial · Hecho con Next.js + Tailwind + shadcn/ui</sub>
</div>
