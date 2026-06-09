"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Tag,
  CreditCard,
  RefreshCw,
  Info,
  ThumbsUp,
  Camera,
} from "lucide-react";
import ProductCard from "@/components/store/product-card";

// ----------------------------------------------
// Types
// ----------------------------------------------

interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  options: Record<string, string>;
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  isActive: boolean;
}

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  images?: string[];
}

interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDesc: string;
  description: string;
  brand: { name: string; slug: string };
  category: { name: string; slug: string };
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  specs: Record<string, string>;
  features: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  isNew: boolean;
  isHot: boolean;
  totalSold: number;
  relatedProducts: {
    id: string;
    name: string;
    brand: string;
    price: number;
    comparePrice?: number;
    image: string;
    slug: string;
    rating: number;
    reviewCount: number;
  }[];
}

// ----------------------------------------------
// Mock data (replace with real API call)
// ----------------------------------------------

const MOCK_PRODUCT: Product = {
  id: "prod_01",
  slug: "iphone-15-pro-max-256gb",
  sku: "APP-IP15PM-256",
  name: "iPhone 15 Pro Max 256GB",
  shortDesc: "El iPhone más avanzado. Titanio. Chip A17 Pro. Cámara principal de 48 MP.",
  description:
    "El iPhone 15 Pro Max redefine lo que un smartphone puede hacer. Con el revolucionario chip A17 Pro fabricado con tecnología de 3 nm, ofrece el rendimiento más potente en un iPhone hasta la fecha. El diseño en titanio de grado aeroespacial lo hace increíblemente resistente y ligero.",
  brand: { name: "Apple", slug: "apple" },
  category: { name: "Smartphones", slug: "smartphones" },
  price: 27999,
  comparePrice: 32999,
  images: [
    { url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009283816", alt: "iPhone 15 Pro Max Natural Titanium", isMain: true },
    { url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009284007", alt: "iPhone 15 Pro Max Blue Titanium", isMain: false },
    { url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009283967", alt: "iPhone 15 Pro Max Black Titanium", isMain: false },
    { url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-whitetitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009283936", alt: "iPhone 15 Pro Max White Titanium", isMain: false },
  ],
  variants: [
    { id: "v1", sku: "APP-IP15PM-256-NAT", name: "Natural Titanium / 256GB", options: { color: "Natural Titanium", storage: "256GB" }, price: 27999, comparePrice: 32999, images: [], isActive: true },
    { id: "v2", sku: "APP-IP15PM-512-NAT", name: "Natural Titanium / 512GB", options: { color: "Natural Titanium", storage: "512GB" }, price: 31999, comparePrice: 36999, images: [], isActive: true },
    { id: "v3", sku: "APP-IP15PM-1TB-NAT", name: "Natural Titanium / 1TB", options: { color: "Natural Titanium", storage: "1TB" }, price: 37999, comparePrice: 43999, images: [], isActive: true },
    { id: "v4", sku: "APP-IP15PM-256-BLU", name: "Blue Titanium / 256GB", options: { color: "Blue Titanium", storage: "256GB" }, price: 27999, comparePrice: 32999, images: [], isActive: true },
    { id: "v5", sku: "APP-IP15PM-256-BLK", name: "Black Titanium / 256GB", options: { color: "Black Titanium", storage: "256GB" }, price: 27999, comparePrice: 32999, images: [], isActive: true },
    { id: "v6", sku: "APP-IP15PM-256-WHT", name: "White Titanium / 256GB", options: { color: "White Titanium", storage: "256GB" }, price: 27999, comparePrice: 32999, images: [], isActive: true },
  ],
  specs: {
    "Pantalla": "Super Retina XDR OLED 6.7\" ProMotion 120Hz",
    "Chip": "A17 Pro (3 nm)",
    "RAM": "8 GB",
    "Cámara principal": "48 MP, f/1.78, OIS, 24/28/35mm",
    "Cámara teleobjetivo": "12 MP, 5x zoom óptico (120mm)",
    "Cámara ultra gran angular": "12 MP, f/2.2",
    "Batería": "4,422 mAh — hasta 29h reproducción video",
    "Carga": "USB-C 3.2 Gen 2, MagSafe 15W",
    "Conectividad": "5G, WiFi 6E, Bluetooth 5.3, NFC, UWB",
    "Seguridad": "Face ID, Emergency SOS vía satélite",
    "Sistema operativo": "iOS 17",
    "Resistencia": "IP68 — 6m / 30 min",
    "Dimensiones": "159.9 × 76.7 × 8.25 mm",
    "Peso": "221 g",
    "Materiales": "Titanio grado 5, vidrio de infusión de color",
    "Almacenamiento": "256GB / 512GB / 1TB",
    "SIM": "Nano-SIM + eSIM (Dual eSIM)",
    "Color": "Natural, Azul, Negro, Blanco Titanio",
  },
  features: [
    "Botón de acción personalizable — acceso instantáneo a lo que más usas",
    "Zoom óptico 5x con teleobjetivo tetraprismático exclusivo del Pro Max",
    "Grabación en ProRes 4K a 60fps directamente a almacenamiento externo",
    "Action Mode para videos estabilizados sin gimbal",
    "USB-C 3.2 Gen 2 para transferencias de hasta 10 Gb/s",
    "Chip A17 Pro con Neural Engine de 16 núcleos para IA en dispositivo",
    "Dynamic Island — notificaciones inteligentes integradas a la pantalla",
    "Emergency SOS vía satélite y detección de accidentes",
  ],
  rating: 4.8,
  reviewCount: 247,
  reviews: [
    {
      id: "r1",
      userName: "Carlos M.",
      rating: 5,
      title: "El mejor teléfono que he tenido",
      body: "La cámara es increíble, el zoom de 5x es una bestia. La batería dura todo el día sin problema. El diseño en titanio se siente premium.",
      isVerified: true,
      helpfulCount: 34,
      createdAt: "2024-11-15",
    },
    {
      id: "r2",
      userName: "Sofía R.",
      rating: 5,
      title: "Vale cada centavo",
      body: "Venía de un iPhone 12 y el salto es enorme. El Dynamic Island ya no lo cambiaría por nada. La pantalla en ProMotion se ve fluidísima.",
      isVerified: true,
      helpfulCount: 21,
      createdAt: "2024-11-08",
    },
    {
      id: "r3",
      userName: "Andrés G.",
      rating: 4,
      title: "Excelente, pero caro",
      body: "El teléfono es espectacular en todos los aspectos. Mis únicas quejas son el precio y que el cargador no viene incluido. Aun así 100% recomendado.",
      isVerified: true,
      helpfulCount: 15,
      createdAt: "2024-10-29",
    },
  ],
  isNew: true,
  isHot: true,
  totalSold: 1243,
  relatedProducts: [
    { id: "r1", name: "iPhone 15 Pro 256GB", brand: "Apple", price: 23999, comparePrice: 27999, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009282676", slug: "iphone-15-pro-256gb", rating: 4.7, reviewCount: 189 },
    { id: "r2", name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 29999, comparePrice: 34999, image: "https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-ultra-s928-sm-s928bzadeub-thumb-539573242?$344_344_PNG$", slug: "samsung-galaxy-s24-ultra", rating: 4.6, reviewCount: 134 },
    { id: "r3", name: "iPhone 15 Plus 256GB", brand: "Apple", price: 20999, comparePrice: 24999, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-plus-finish-select-202309-6-7inch-yellow?wid=800&hei=800&fmt=p-jpg", slug: "iphone-15-plus-256gb", rating: 4.5, reviewCount: 98 },
    { id: "r4", name: "iPhone 14 Pro Max 256GB", brand: "Apple", price: 22999, comparePrice: 26999, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=800&hei=800&fmt=p-jpg", slug: "iphone-14-pro-max-256gb", rating: 4.6, reviewCount: 312 },
  ],
};

// ----------------------------------------------
// Star Rating component
// ----------------------------------------------

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={sizeClass}
          fill={star <= Math.round(rating) ? "#ffb77d" : star - 0.5 <= rating ? "#ffb77d80" : "transparent"}
          stroke={star <= Math.round(rating) ? "#ffb77d" : "#ffffff20"}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------
// Color options mapping
// ----------------------------------------------

const COLOR_MAP: Record<string, string> = {
  "Natural Titanium": "#b0a090",
  "Blue Titanium": "#4a6a8a",
  "Black Titanium": "#2a2a2a",
  "White Titanium": "#e8e6e0",
  "Negro": "#1a1a1a",
  "Blanco": "#f5f5f5",
  "Azul": "#2563eb",
  "Rojo": "#dc2626",
  "Verde": "#16a34a",
  "Morado": "#9333ea",
  "Rosa": "#ec4899",
  "Dorado": "#d97706",
  "Plateado": "#9ca3af",
};

// ----------------------------------------------
// Main Page Component
// ----------------------------------------------

export default function ProductDetailPage() {
  const params = useParams();
  const [product] = useState<Product>(MOCK_PRODUCT);

  // Gallery state
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Variant state
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [imei, setImei] = useState("");

  // UI state
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSpecsAll, setShowSpecsAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "features" | "reviews">("specs");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const imageRef = useRef<HTMLDivElement>(null);

  // Derived values
  const colors = [...new Set(product.variants.map((v) => v.options.color).filter(Boolean))];
  const storages = [...new Set(product.variants.map((v) => v.options.storage).filter(Boolean))];

  const activeVariant = product.variants.find(
    (v) => v.options.color === selectedColor && v.options.storage === selectedStorage
  );

  const currentPrice = activeVariant?.price ?? product.price;
  const currentCompare = activeVariant?.comparePrice ?? product.comparePrice;
  const savings = currentCompare ? currentCompare - currentPrice : 0;
  const discountPct = currentCompare ? Math.round((savings / currentCompare) * 100) : 0;

  // Initialize selections
  useEffect(() => {
    if (colors.length > 0) setSelectedColor(colors[0]);
    if (storages.length > 0) setSelectedStorage(storages[0]);
  }, []);

  // Financing — show cheapest plan
  const monthlyPayment3 = Math.round(currentPrice / 3);
  const monthlyPayment12 = Math.round((currentPrice * 1.18) / 12);

  // Handlers
  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const specsEntries = Object.entries(product.specs);
  const visibleSpecs = showSpecsAll ? specsEntries : specsEntries.slice(0, 8);

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => r.rating === star).length;
    const pct = product.reviewCount > 0 ? (count / product.reviewCount) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            description: product.shortDesc,
            sku: product.sku,
            brand: { "@type": "Brand", name: product.brand.name },
            offers: {
              "@type": "Offer",
              url: `https://i-store.shop/productos/${product.slug}`,
              priceCurrency: "MXN",
              price: currentPrice,
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "iStore Pro" },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />

      <div className="min-h-screen bg-[#131313] text-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/productos" className="hover:text-white/70 transition-colors">Productos</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/categorias/${product.category.slug}`} className="hover:text-white/70 transition-colors">{product.category.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Main product section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* -- LEFT: Gallery -- */}
            <div className="space-y-4">
              {/* Main image */}
              <motion.div
                ref={imageRef}
                className="relative aspect-square bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleImageMouseMove}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            transform: "scale(2)",
                          }
                        : {}
                    }
                  >
                    <Image
                      src={product.images[activeImage]?.url}
                      alt={product.images[activeImage]?.alt}
                      fill
                      className="object-contain p-8"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm">
                      Nuevo
                    </span>
                  )}
                  {discountPct > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ff8c00]/20 text-[#ffb77d] border border-[#ff8c00]/30 backdrop-blur-sm">
                      -{discountPct}%
                    </span>
                  )}
                </div>

                {/* Nav arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-[#ff8c00] shadow-[0_0_12px_rgba(255,140,0,0.4)]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-contain p-2" sizes="80px" />
                  </button>
                ))}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: "Garantía oficial", sub: "12 meses" },
                  { icon: Truck, label: "Envío gratis", sub: "En pedidos +$999" },
                  { icon: RotateCcw, label: "Devoluciones", sub: "30 días" },
                  { icon: Check, label: "Producto nuevo", sub: "Sellado de fábrica" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ff8c00]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#ffb77d]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{label}</p>
                      <p className="text-[11px] text-white/40">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* -- RIGHT: Product info -- */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/marca/${product.brand.slug}`} className="text-sm font-bold text-[#ffb77d]/80 uppercase tracking-widest hover:text-[#ffb77d] transition-colors">
                    {product.brand.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center hover:border-[#ff8c00]/40 transition-all"
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted ? "#ff8c00" : "transparent"} stroke={isWishlisted ? "#ff8c00" : "white"} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center hover:border-white/30 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  {product.name}
                </h1>

                <p className="text-white/60 text-sm leading-relaxed">{product.shortDesc}</p>

                {/* Rating row */}
                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={product.rating} size="md" />
                  <span className="text-sm text-white/60">
                    <span className="text-white font-semibold">{product.rating}</span>
                    {" "}({product.reviewCount.toLocaleString("es-MX")} reseñas)
                  </span>
                  <span className="text-sm text-white/40">·</span>
                  <span className="text-sm text-white/40">{product.totalSold.toLocaleString("es-MX")} vendidos</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-black text-white">
                    ${currentPrice.toLocaleString("es-MX")}
                  </span>
                  {currentCompare && currentCompare > currentPrice && (
                    <span className="text-xl text-white/35 line-through">
                      ${currentCompare.toLocaleString("es-MX")}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Tag className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-sm text-green-400 font-semibold">
                      Ahorras ${savings.toLocaleString("es-MX")} MXN ({discountPct}% off)
                    </span>
                  </div>
                )}
                <p className="text-xs text-white/30 mt-2">Precio incluye IVA. Envío calculado en checkout.</p>
              </div>

              {/* Color selector */}
              {colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Color</span>
                    <span className="text-sm text-[#ffb77d]">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const colorHex = COLOR_MAP[color] ?? "#888";
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                          className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? "border-[#ff8c00] scale-110 shadow-[0_0_10px_rgba(255,140,0,0.5)]"
                              : "border-white/20 hover:border-white/50"
                          }`}
                          style={{ backgroundColor: colorHex }}
                        >
                          {selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Storage selector */}
              {storages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Almacenamiento</span>
                    <span className="text-sm text-[#ffb77d]">{selectedStorage}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {storages.map((storage) => {
                      const variant = product.variants.find(
                        (v) => v.options.storage === storage && v.options.color === selectedColor
                      );
                      return (
                        <button
                          key={storage}
                          onClick={() => setSelectedStorage(storage)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            selectedStorage === storage
                              ? "bg-[#ff8c00] text-black border-[#ff8c00]"
                              : "bg-white/[0.04] text-white/70 border-white/10 hover:border-[#ff8c00]/40 hover:text-white"
                          }`}
                        >
                          {storage}
                          {variant && variant.price !== product.price && (
                            <span className="ml-1 text-xs opacity-70">
                              +${(variant.price - product.price).toLocaleString("es-MX")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="text-sm font-semibold text-white block mb-3">Cantidad</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0 bg-white/[0.05] border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-white/40">Máx. 10 por pedido</span>
                </div>
              </div>

              {/* IMEI field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white/60 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  IMEI o número de serie (opcional)
                </label>
                <input
                  type="text"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="Ej: 358240051111110"
                  maxLength={20}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#ff8c00]/40 focus:bg-white/[0.06] transition-all"
                />
                <p className="text-xs text-white/30 mt-1">Requerido para reportar robo o activar garantía extendida.</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    addedToCart
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black hover:shadow-[0_0_30px_rgba(255,140,0,0.35)] hover:scale-[1.01]"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Agregado al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Agregar al carrito
                    </>
                  )}
                </motion.button>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-white/[0.06] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Zap className="w-5 h-5 text-[#ffb77d]" />
                  Comprar ahora
                </Link>
              </div>

              {/* Financiamiento */}
              <div className="bg-gradient-to-r from-[#ff8c00]/10 to-[#ffb77d]/5 border border-[#ff8c00]/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-[#ffb77d]" />
                  <span className="text-sm font-bold text-white">Financiamiento disponible</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">3 meses sin intereses</span>
                    <span className="text-sm font-bold text-white">
                      Desde ${monthlyPayment3.toLocaleString("es-MX")}/mes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">12 meses con intereses</span>
                    <span className="text-sm font-bold text-white">
                      Desde ${monthlyPayment12.toLocaleString("es-MX")}/mes
                    </span>
                  </div>
                </div>
                <Link href="/financiamiento" className="mt-3 text-xs text-[#ffb77d] hover:underline flex items-center gap-1">
                  Ver todos los planes <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Trade-in banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Trade-In — Entrega tu equipo viejo</span>
                </div>
                <p className="text-sm text-white/60">
                  Cambia tu dispositivo actual y obtén hasta{" "}
                  <span className="text-emerald-400 font-bold">$8,500</span> de descuento en tu compra.
                </p>
                <Link href="/trade-in" className="mt-2 text-xs text-emerald-400 hover:underline flex items-center gap-1">
                  Cotizar mi equipo <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* -- Tabs: Specs / Features / Reviews -- */}
          <div className="mt-16">
            {/* Tab headers */}
            <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
              {(["specs", "features", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab ? "text-[#ffb77d]" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab === "specs" ? "Especificaciones" : tab === "features" ? "Características" : `Reseñas (${product.reviewCount})`}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff8c00] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Specs */}
            <AnimatePresence mode="wait">
              {activeTab === "specs" && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/[0.07] rounded-2xl overflow-hidden">
                    {visibleSpecs.map(([key, value], idx) => (
                      <div
                        key={key}
                        className={`flex gap-4 p-4 border-b border-r-0 md:border-r border-white/[0.06] last:border-b-0 ${
                          idx % 2 === 0 ? "md:border-r" : ""
                        } ${idx >= visibleSpecs.length - 2 ? "border-b-0" : ""}`}
                      >
                        <span className="text-sm text-white/40 min-w-[140px] flex-shrink-0">{key}</span>
                        <span className="text-sm text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  {specsEntries.length > 8 && (
                    <button
                      onClick={() => setShowSpecsAll(!showSpecsAll)}
                      className="mt-4 flex items-center gap-2 text-sm text-[#ffb77d] hover:text-[#ff8c00] transition-colors mx-auto"
                    >
                      {showSpecsAll ? (
                        <><ChevronUp className="w-4 h-4" />Ver menos</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" />Ver todas las especificaciones ({specsEntries.length})</>
                      )}
                    </button>
                  )}
                </motion.div>
              )}

              {/* Features */}
              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {product.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#ff8c00]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#ffb77d]" />
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Summary */}
                    <div className="md:col-span-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col items-center text-center">
                      <span className="text-6xl font-black text-white mb-2">{product.rating}</span>
                      <StarRating rating={product.rating} size="lg" />
                      <p className="text-sm text-white/40 mt-2">{product.reviewCount} reseñas verificadas</p>

                      <div className="w-full mt-6 space-y-2">
                        {ratingBreakdown.map(({ star, count, pct }) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-white/50 w-4">{star}</span>
                            <Star className="w-3 h-3 text-[#ffb77d]" fill="#ffb77d" />
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#ff8c00] rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/40 w-4 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review list */}
                    <div className="md:col-span-2 space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-white">{review.userName}</span>
                                {review.isVerified && (
                                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                                    <Check className="w-3 h-3" />
                                    Compra verificada
                                  </span>
                                )}
                              </div>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                            <span className="text-xs text-white/30">
                              {new Date(review.createdAt).toLocaleDateString("es-MX")}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-white mt-3 mb-1">{review.title}</h4>
                          <p className="text-sm text-white/60 leading-relaxed">{review.body}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Útil ({review.helpfulCount})
                            </button>
                          </div>
                        </div>
                      ))}

                      {product.reviewCount > product.reviews.length && (
                        <button className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white/60 hover:bg-white/[0.07] transition-all">
                          Ver todas las {product.reviewCount} reseñas
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* -- Related products -- */}
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white mb-6">También te puede interesar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  id={rp.id}
                  name={rp.name}
                  brand={rp.brand}
                  price={rp.price}
                  comparePrice={rp.comparePrice}
                  image={rp.image}
                  rating={rp.rating}
                  reviewCount={rp.reviewCount}
                  slug={rp.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
