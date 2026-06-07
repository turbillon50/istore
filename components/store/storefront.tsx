"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  CalendarCheck,
  X,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  BatteryCharging,
  Droplets,
  Stethoscope,
  Cpu,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { ProductMedia } from "./product-media";
import {
  products,
  services,
  productCategories,
  type StoreProduct,
  type StoreService,
  type ProductCategory,
} from "@/lib/catalog";

const SERVICE_ICONS = {
  screen: Smartphone,
  battery: BatteryCharging,
  water: Droplets,
  diagnostic: Stethoscope,
  software: Cpu,
  camera: Camera,
} as const;

function tagVariant(tag?: StoreProduct["tag"]) {
  if (tag === "Oferta") return "danger" as const;
  if (tag === "Nuevo") return "success" as const;
  return "default" as const;
}

function discount(p: StoreProduct) {
  if (!p.compareAt || p.compareAt <= p.price) return null;
  return Math.round((1 - p.price / p.compareAt) * 100);
}

// ----- Estrellas de rating -----
function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      <span>({reviews})</span>
    </div>
  );
}

// ----- Carrusel horizontal con flechas (desktop) y swipe (móvil) -----
function Carousel({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <div className="group relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2"
      >
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur transition hover:bg-accent md:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Siguiente"
        className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur transition hover:bg-accent md:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// ----- Tarjeta de producto (estilo Airbnb, expandible al tap) -----
function ProductCard({
  p,
  onOpen,
  className,
}: {
  p: StoreProduct;
  onOpen: () => void;
  className?: string;
}) {
  const off = discount(p);
  return (
    <motion.button
      layout
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-xl",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <ProductMedia
          src={p.image}
          alt={p.name}
          category={p.category}
          className="h-full w-full transition-transform duration-500 group-hover/card:scale-105"
          sizes="(max-width: 768px) 70vw, 280px"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.tag && <Badge variant={tagVariant(p.tag)}>{p.tag}</Badge>}
          {off && <Badge variant="danger">-{off}%</Badge>}
        </div>
        {p.stock <= 5 && p.stock > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium text-warning backdrop-blur">
            ¡Últimas {p.stock}!
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {p.brand}
          </span>
          <Rating value={p.rating} reviews={p.reviews} />
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{p.name}</h3>
        <div className="mt-auto flex items-end gap-2 pt-1">
          <span className="text-lg font-bold tracking-tight">{formatCurrency(p.price)}</span>
          {p.compareAt && (
            <span className="pb-0.5 text-xs text-muted-foreground line-through">
              {formatCurrency(p.compareAt)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ----- Ficha completa (dialog expandido con galería) -----
function ProductDialog({
  p,
  onClose,
}: {
  p: StoreProduct;
  onClose: () => void;
}) {
  const gallery = p.gallery?.length ? p.gallery : [p.image];
  const off = discount(p);
  // El login/registro SOLO aparece al intentar comprar: la cuenta es el gate
  // de compra, nunca un formulario plantado en la home.
  const buyHref = `/login?redirect_url=${encodeURIComponent("/")}`;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%", opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto">
          {/* Galería swipeable */}
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
            {gallery.map((g, i) => (
              <ProductMedia
                key={i}
                src={g}
                alt={`${p.name} ${i + 1}`}
                category={p.category}
                className="aspect-[4/3] w-full shrink-0 snap-center"
                sizes="100vw"
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {p.brand} · {p.category}
                </span>
                <h2 className="text-xl font-bold leading-tight">{p.name}</h2>
              </div>
              <Rating value={p.rating} reviews={p.reviews} />
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <span className="text-3xl font-extrabold tracking-tight">
                {formatCurrency(p.price)}
              </span>
              {p.compareAt && (
                <span className="pb-1 text-base text-muted-foreground line-through">
                  {formatCurrency(p.compareAt)}
                </span>
              )}
              {off && <Badge variant="danger" className="mb-1">Ahorra {off}%</Badge>}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>

            <ul className="grid grid-cols-2 gap-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> Garantía</span>
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Envío MX</span>
              <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-warning" /> Factura</span>
            </div>
          </div>
        </div>

        {/* Barra de compra fija */}
        <div className="flex items-center gap-3 border-t border-border bg-card p-4">
          <div className="hidden flex-col sm:flex">
            <span className="text-[11px] text-muted-foreground">Total</span>
            <span className="text-lg font-bold">{formatCurrency(p.price)}</span>
          </div>
          <Button asChild size="lg" className="flex-1">
            <Link href={buyHref}>
              <ShoppingBag className="h-4 w-4" /> Comprar ahora
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ----- Tarjeta de servicio -----
function ServiceCard({ s }: { s: StoreService }) {
  const Icon = SERVICE_ICONS[s.icon];
  // Agendar también pasa por el gate de cuenta, no por el panel del dueño.
  const href = `/login?redirect_url=${encodeURIComponent("/")}`;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold leading-tight">{s.name}</h3>
          <span className="text-xs text-muted-foreground">{s.durationLabel}</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
      <ul className="flex flex-col gap-1.5">
        {s.includes.map((i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-success" />
            {i}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm">
          {s.fromPrice === 0 ? (
            <span className="font-bold text-success">Gratis</span>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">Desde </span>
              <span className="font-bold">{formatCurrency(s.fromPrice)}</span>
            </>
          )}
        </span>
        <Button asChild size="sm" variant="secondary">
          <Link href={href}>
            <CalendarCheck className="h-4 w-4" /> Agendar
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ===================================================================
export function Storefront() {
  const [cat, setCat] = React.useState<ProductCategory | "Todos">("Todos");
  const [active, setActive] = React.useState<StoreProduct | null>(null);

  const featured = React.useMemo(() => products.filter((p) => p.tag), []);
  const filtered = React.useMemo(
    () => (cat === "Todos" ? products : products.filter((p) => p.category === cat)),
    [cat]
  );

  return (
    <>
      {/* ---------------- HERO de TIENDA ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 animate-aurora rounded-full bg-primary/15 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12 sm:pt-16">
          <Badge variant="default" className="mb-4 w-fit gap-1.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Garantía y factura en cada compra
          </Badge>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Tu tienda de <span className="text-shine">celulares y reparación</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Compra los últimos equipos y accesorios, o agenda la reparación de tu
            celular con técnicos expertos. Sin cuenta para explorar — solo te
            registras al comprar.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#productos">
                <ShoppingBag className="h-4 w-4" /> Ver productos
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#servicios">
                <Wrench className="h-4 w-4" /> Reparar mi equipo
              </a>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Envíos a todo México</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> 90 días de garantía</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-warning" /> Equipos originales</span>
          </div>
        </div>
      </section>

      {/* ---------------- DESTACADOS (carrusel swipeable) ---------------- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Destacados</h2>
              <p className="text-sm text-muted-foreground">Lo más buscado esta semana</p>
            </div>
          </div>
          <Carousel>
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                onOpen={() => setActive(p)}
                className="w-[68vw] shrink-0 snap-start sm:w-[260px]"
              />
            ))}
          </Carousel>
        </section>
      )}

      {/* ---------------- CATÁLOGO con filtro ---------------- */}
      <section id="productos" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Productos</h2>
          <p className="text-sm text-muted-foreground">Celulares, audio, wearables y accesorios</p>
        </div>

        {/* Chips de categoría */}
        <div className="no-scrollbar -mx-6 mb-6 flex gap-2 overflow-x-auto px-6">
          {productCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onOpen={() => setActive(p)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Pronto más productos en esta categoría.</p>
            <Button variant="secondary" size="sm" onClick={() => setCat("Todos")}>
              Ver todo el catálogo
            </Button>
          </div>
        )}
      </section>

      {/* ---------------- SERVICIOS de reparación ---------------- */}
      <section id="servicios" className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl scroll-mt-20 px-6 py-12">
          <div className="mb-6 max-w-xl">
            <Badge variant="purple" className="mb-3 w-fit gap-1.5">
              <Wrench className="h-3.5 w-3.5" /> Centro de reparación
            </Badge>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              ¿Tu celular tiene una falla? Nosotros lo arreglamos.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Recibimos tu equipo, lo diagnosticamos y te avisamos a cada paso.
              Refacciones con garantía y prueba frente a ti.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Cierre: confianza de tienda ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-purple-600/10 p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
            Equipos originales, garantía y factura en cada compra
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Explora todo el catálogo sin cuenta. Envíos a todo México y soporte
            de técnicos expertos para tu celular.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="#productos">
                <ShoppingBag className="h-4 w-4" /> Ver productos
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#servicios">
                <Wrench className="h-4 w-4" /> Reparar mi equipo
              </a>
            </Button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <ProductDialog
            p={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
