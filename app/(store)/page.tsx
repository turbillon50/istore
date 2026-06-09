import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Smartphone,
  Headphones,
  Tablet,
  Wrench,
  CreditCard,
  RefreshCw,
  Truck,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import Hero from "@/components/store/hero";
import ProductCard from "@/components/store/product-card";
import NewsletterForm from "@/components/store/newsletter-form";

export const dynamic = "force-dynamic";

// --- Types --------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: "Nuevo" | "Hot" | "Oferta";
  slug: string;
}

interface HotDeal {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  expiresIn: string;
}

// --- Data fetchers -------------------------------------------------------------

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/products?featured=true&limit=8`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    return PLACEHOLDER_PRODUCTS;
  }
}

async function getHotDeals(): Promise<HotDeal[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/deals?limit=4`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    return PLACEHOLDER_DEALS;
  }
}

// --- Placeholder data ----------------------------------------------------------

const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB Titanio Natural",
    brand: "Apple",
    price: 34999,
    comparePrice: 39999,
    image: "/images/products/iphone-15-pro.png",
    rating: 4.9,
    reviewCount: 342,
    badge: "Hot",
    slug: "iphone-15-pro-max-256gb",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra 512GB Titanio Negro",
    brand: "Samsung",
    price: 31999,
    comparePrice: 35999,
    image: "/images/products/galaxy-s24-ultra.png",
    rating: 4.8,
    reviewCount: 218,
    badge: "Nuevo",
    slug: "samsung-galaxy-s24-ultra-512gb",
  },
  {
    id: "3",
    name: "Xiaomi 14 Pro 256GB Negro Volcano",
    brand: "Xiaomi",
    price: 18999,
    comparePrice: 22999,
    image: "/images/products/xiaomi-14-pro.png",
    rating: 4.7,
    reviewCount: 156,
    badge: "Oferta",
    slug: "xiaomi-14-pro-256gb",
  },
  {
    id: "4",
    name: "Motorola Edge 50 Pro 256GB Mocha Lavender",
    brand: "Motorola",
    price: 11999,
    image: "/images/products/moto-edge-50-pro.png",
    rating: 4.5,
    reviewCount: 94,
    badge: "Nuevo",
    slug: "motorola-edge-50-pro-256gb",
  },
  {
    id: "5",
    name: "iPhone 15 128GB Azul",
    brand: "Apple",
    price: 21999,
    comparePrice: 24999,
    image: "/images/products/iphone-15-blue.png",
    rating: 4.8,
    reviewCount: 289,
    badge: "Oferta",
    slug: "iphone-15-128gb-azul",
  },
  {
    id: "6",
    name: "Samsung Galaxy A55 5G 256GB Azul Hielo",
    brand: "Samsung",
    price: 8999,
    image: "/images/products/galaxy-a55.png",
    rating: 4.4,
    reviewCount: 67,
    slug: "samsung-galaxy-a55-256gb",
  },
  {
    id: "7",
    name: "Xiaomi Redmi Note 13 Pro 256GB Azul Oceáno",
    brand: "Xiaomi",
    price: 6999,
    comparePrice: 7999,
    image: "/images/products/redmi-note-13.png",
    rating: 4.3,
    reviewCount: 183,
    badge: "Oferta",
    slug: "xiaomi-redmi-note-13-pro-256gb",
  },
  {
    id: "8",
    name: "Motorola Moto G84 256GB Viva Magenta",
    brand: "Motorola",
    price: 5999,
    image: "/images/products/moto-g84.png",
    rating: 4.2,
    reviewCount: 45,
    slug: "motorola-moto-g84-256gb",
  },
];

const PLACEHOLDER_DEALS: HotDeal[] = [
  {
    id: "d1",
    name: "AirPods Pro 2da Gen",
    originalPrice: 7999,
    salePrice: 5499,
    discount: 31,
    image: "/images/deals/airpods-pro.png",
    expiresIn: "23:14:05",
  },
  {
    id: "d2",
    name: "Samsung Galaxy Watch 6",
    originalPrice: 6499,
    salePrice: 4299,
    discount: 34,
    image: "/images/deals/galaxy-watch.png",
    expiresIn: "10:42:18",
  },
  {
    id: "d3",
    name: "iPad 10ma Gen 64GB WiFi",
    originalPrice: 12999,
    salePrice: 9499,
    discount: 27,
    image: "/images/deals/ipad-10.png",
    expiresIn: "05:30:00",
  },
  {
    id: "d4",
    name: "Xiaomi Band 8 Pro",
    originalPrice: 1999,
    salePrice: 999,
    discount: 50,
    image: "/images/deals/band-8.png",
    expiresIn: "47:00:00",
  },
];

const CATEGORIES = [
  { label: "Smartphones", icon: Smartphone, href: "/celulares", count: "180+ modelos", color: "from-blue-500/20 to-blue-600/5" },
  { label: "Accesorios", icon: Headphones, href: "/accesorios", count: "300+ productos", color: "from-purple-500/20 to-purple-600/5" },
  { label: "Audio", icon: Headphones, href: "/audio", count: "50+ modelos", color: "from-pink-500/20 to-pink-600/5" },
  { label: "Tablets", icon: Tablet, href: "/tablets", count: "40+ modelos", color: "from-green-500/20 to-green-600/5" },
  { label: "Servicios", icon: Wrench, href: "/servicios", count: "6 servicios", color: "from-[#2563eb]/20 to-[#2563eb]/5" },
];

const BRANDS = [
  { name: "Apple", slug: "apple" },
  { name: "Samsung", slug: "samsung" },
  { name: "Xiaomi", slug: "xiaomi" },
  { name: "Motorola", slug: "motorola" },
  { name: "Google", slug: "google" },
  { name: "OnePlus", slug: "oneplus" },
  { name: "OPPO", slug: "oppo" },
  { name: "Nothing", slug: "nothing" },
];

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    city: "CDMX",
    rating: 5,
    text: "El financiamiento fue súper sencillo, sin buró ni aval. Tuve mi iPhone en 24 horas. 100% recomendado.",
    product: "iPhone 15 Pro",
  },
  {
    name: "Ana R.",
    city: "Guadalajara",
    rating: 5,
    text: "Hicieron el trade-in de mi teléfono viejo con muy buen precio. El proceso fue transparente y rápido.",
    product: "Samsung Galaxy S24",
  },
  {
    name: "Diego L.",
    city: "Monterrey",
    rating: 5,
    text: "Repararon mi pantalla en menos de 2 horas y quedó como nueva. Precio justo y garantía incluida.",
    product: "Servicio de Reparación",
  },
];

const SERVICES = [
  {
    icon: Wrench,
    title: "Reparación Express",
    desc: "Pantallas, baterías, conectores y más. Diagnóstico gratis, garantía 3 meses.",
    href: "/servicios/reparacion",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: CreditCard,
    title: "Financiamiento",
    desc: "Sin buró, sin aval. Desde $500 de enganche, meses sin intereses con tarjeta.",
    href: "/financiamiento",
    color: "text-[#60a5fa]",
    bg: "bg-[#2563eb]/10",
  },
  {
    icon: RefreshCw,
    title: "Trade-In",
    desc: "Entrega tu equipo actual y recibe hasta $8,000 de descuento en tu nuevo teléfono.",
    href: "/trade-in",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Truck,
    title: "Envíos a todo México",
    desc: "Envío gratis en compras +$999. Express en 24-48h. Rastreo en tiempo real.",
    href: "/envios",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

// --- Section wrapper with fade-in ---------------------------------------------

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  linkHref,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1.5 text-white/40 text-sm">{subtitle}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#60a5fa] hover:text-[#2563eb] transition-colors shrink-0"
        >
          {linkLabel}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// --- Page ---------------------------------------------------------------------

export default async function StorePage() {
  const [products, deals] = await Promise.all([
    getFeaturedProducts(),
    getHotDeals(),
  ]);

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust strip */}
      <div className="bg-white/[0.02] border-y border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-white/8">
            {[
              { icon: Shield, text: "Compra 100% segura" },
              { icon: Truck, text: "Envío gratis +$999" },
              { icon: RefreshCw, text: "Devolución 30 días" },
              { icon: Clock, text: "Soporte 24/7" },
            ].map((featureItem) => {
              const FeatureIcon = featureItem.icon;
              return (
              <div key={featureItem.text} className="flex items-center justify-center gap-2 sm:px-6">
                <FeatureIcon className="w-4 h-4 text-[#2563eb] shrink-0" />
                <span className="text-xs sm:text-sm text-white/50 font-medium">{featureItem.text}</span>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Featured products carousel */}
      <Section>
        <SectionHeader
          title="Nuevos Lanzamientos"
          subtitle="Los equipos más recientes del mercado"
          linkHref="/celulares"
          linkLabel="Ver todos"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              badge={product.badge as "Nuevo" | "Hot" | "Oferta" | undefined}
            />
          ))}
        </div>
      </Section>

      {/* 4. Categories grid */}
      <Section className="bg-white/[0.015]">
        <SectionHeader
          title="Explora por categoría"
          subtitle="Encuentra exactamente lo que buscas"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`group relative bg-gradient-to-b ${cat.color} border border-white/8 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:border-[#2563eb]/30 hover:shadow-[0_8px_30px_rgba(37, 99, 235,0.08)] transition-all`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#2563eb]/10 transition-colors">
                  <Icon className="w-6 h-6 text-white/70 group-hover:text-[#60a5fa] transition-colors" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{cat.label}</div>
                  <div className="text-xs text-white/35 mt-0.5">{cat.count}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#2563eb] transition-all group-hover:translate-x-0.5 absolute right-4 top-1/2 -translate-y-1/2" />
              </Link>
            );
          })}
        </div>
      </Section>

      {/* 5. Hot deals strip */}
      <Section>
        <SectionHeader
          title="Ofertas del día"
          subtitle="Precios especiales por tiempo limitado"
          linkHref="/ofertas"
          linkLabel="Ver todas las ofertas"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-[#2563eb]/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-[#2563eb] bg-[#2563eb]/10 px-2.5 py-1 rounded-full border border-[#2563eb]/20">
                  -{deal.discount}% OFF
                </span>
                <div className="text-right">
                  <div className="text-[10px] text-white/30">Termina en</div>
                  <div className="text-xs font-black text-[#60a5fa] font-mono">
                    {deal.expiresIn}
                  </div>
                </div>
              </div>
              <div className="h-28 bg-gradient-to-b from-white/5 to-transparent rounded-xl mb-4 flex items-center justify-center">
                <div className="text-4xl">📱</div>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-[#60a5fa] transition-colors">
                {deal.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-white">
                  ${deal.salePrice.toLocaleString("es-MX")}
                </span>
                <span className="text-xs text-white/30 line-through">
                  ${deal.originalPrice.toLocaleString("es-MX")}
                </span>
              </div>
              <button className="mt-3 w-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-black text-xs font-bold py-2.5 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all">
                Aprovechar oferta
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Brand logos carousel */}
      <div className="py-12 border-y border-white/8 overflow-hidden bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-center text-xs text-white/30 uppercase tracking-widest">
            Marcas oficiales disponibles
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-none pb-2 px-4 sm:px-0 sm:justify-center sm:flex-wrap">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/celulares/${brand.slug}`}
              className="shrink-0 px-6 py-3 bg-white/[0.03] border border-white/8 rounded-xl text-sm font-bold text-white/40 hover:text-white hover:border-[#2563eb]/30 hover:bg-[#2563eb]/5 transition-all"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Trade-in CTA banner */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a0e00] via-[#1f1000] to-[#1a0e00] border border-[#2563eb]/20 p-8 sm:p-12">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 via-transparent to-[#2563eb]/5" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#2563eb] opacity-10 blur-[60px]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-4">
                <RefreshCw className="w-4 h-4 text-[#60a5fa]" />
                <span className="text-sm text-[#60a5fa] font-semibold">Trade-In Program</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                ¿Tienes un teléfono viejo?
              </h2>
              <p className="text-white/50 max-w-lg">
                Recibe hasta <span className="text-[#60a5fa] font-bold">$8,000 MXN</span> de descuento
                al entregar tu equipo actual. Aplica para cualquier marca y modelo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/trade-in/cotizar"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-black font-bold px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(37, 99, 235,0.4)] hover:scale-105 transition-all"
              >
                Cotizar mi equipo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/trade-in"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
              >
                Saber más
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Services section */}
      <Section className="bg-white/[0.015]">
        <SectionHeader
          title="Nuestros servicios"
          subtitle="Más que una tienda, tu aliado tecnológico"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#2563eb]/25 hover:bg-white/[0.05] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
              >
                <div
                  className={`w-12 h-12 ${service.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-[#60a5fa] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{service.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-[#60a5fa] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  Ver más <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* 9. Testimonials */}
      <Section>
        <SectionHeader
          title="Lo que dicen nuestros clientes"
          subtitle="+50,000 clientes satisfechos en toda la República"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#60a5fa]" fill="#60a5fa" />
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-white/30">{t.city}</div>
                </div>
                <div className="text-xs text-[#60a5fa]/60 bg-[#2563eb]/5 px-2.5 py-1 rounded-full border border-[#2563eb]/10">
                  {t.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. Newsletter */}
      <Section className="bg-white/[0.015]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-5">
            <Zap className="w-4 h-4 text-[#60a5fa]" fill="#60a5fa" />
            <span className="text-sm text-[#60a5fa] font-semibold">Newsletter exclusivo</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Ofertas antes que nadie
          </h2>
          <p className="text-white/40 mb-8">
            Suscríbete y recibe promociones exclusivas, preventas y descuentos de hasta 40% antes que el resto del mundo.
          </p>
          <NewsletterForm />
          <p className="mt-3 text-xs text-white/20">
            Sin spam. Cancela cuando quieras.
          </p>
        </div>
      </Section>
    </>
  );
}
