"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  ChevronRight,
  ArrowLeft,
  X,
  ShoppingBag,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import ProductCard from "@/components/store/product-card";

// ----------------------------------------------
// Types
// ----------------------------------------------

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  slug: string;
  image: string;
  variant: string;
  sku: string;
  price: number;
  comparePrice?: number;
  quantity: number;
}

// ----------------------------------------------
// Mock data
// ----------------------------------------------

const INITIAL_CART: CartItem[] = [
  {
    id: "ci_1",
    productId: "prod_01",
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    slug: "iphone-15-pro-max-256gb",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009283816",
    variant: "Natural Titanium / 256GB",
    sku: "APP-IP15PM-256-NAT",
    price: 27999,
    comparePrice: 32999,
    quantity: 1,
  },
  {
    id: "ci_2",
    productId: "prod_02",
    name: "AirPods Pro (2da generación)",
    brand: "Apple",
    slug: "airpods-pro-2",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg",
    variant: "Blanco / USB-C",
    sku: "APP-APP2-USBC",
    price: 4999,
    comparePrice: 5999,
    quantity: 1,
  },
];

const UPSELL_PRODUCTS = [
  {
    id: "up_1", name: "Funda MagSafe iPhone 15 Pro Max", brand: "Apple", price: 849,
    comparePrice: 999, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT1G3?wid=800&hei=800&fmt=jpeg",
    slug: "funda-magsafe-iphone-15-pro-max", rating: 4.3, reviewCount: 67,
  },
  {
    id: "up_2", name: "Cargador USB-C 30W", brand: "Apple", price: 699,
    comparePrice: 849, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQUN3?wid=800&hei=800&fmt=jpeg",
    slug: "cargador-usb-c-30w", rating: 4.6, reviewCount: 124,
  },
  {
    id: "up_3", name: "Cable USB-C a Lightning 1m", brand: "Apple", price: 399,
    comparePrice: 499, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQGJ3?wid=800&hei=800&fmt=jpeg",
    slug: "cable-usb-c-lightning-1m", rating: 4.4, reviewCount: 201,
  },
  {
    id: "up_4", name: "Apple Watch SE (2da gen) 40mm", brand: "Apple", price: 6499,
    comparePrice: 7499, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MRE53?wid=800&hei=800&fmt=jpeg",
    slug: "apple-watch-se-40mm", rating: 4.5, reviewCount: 89,
  },
];

// ----------------------------------------------
// Shipping tiers
// ----------------------------------------------

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + (item.comparePrice ?? item.price) * item.quantity, 0);
  const itemSavings = originalTotal - subtotal;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 149;
  const tax = Math.round((subtotal - couponDiscount) * 0.16);
  const total = subtotal - couponDiscount + shipping;
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Handlers
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + delta)) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const applyCoupon = async () => {
    setCouponError("");
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setCouponLoading(false);

    const validCoupons: Record<string, number> = {
      ISTORE10: 0.1,
      PROMO15: 0.15,
      BFRIDAY20: 0.2,
    };

    const upper = coupon.toUpperCase().trim();
    if (validCoupons[upper]) {
      setAppliedCoupon({ code: upper, discount: validCoupons[upper] });
      setCoupon("");
    } else {
      setCouponError("Cupón no válido o expirado");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white/20" />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Tu carrito está vacío</h1>
          <p className="text-white/50 mb-8">
            Explora nuestro catálogo y encuentra el dispositivo perfecto para ti.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-black font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_30px_rgba(37, 99, 235,0.3)] transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Explorar productos
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Mi carrito</h1>
            <p className="text-sm text-white/40 mt-1">{items.length} {items.length === 1 ? "producto" : "productos"}</p>
          </div>
          <Link href="/productos" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* -- Cart items -- */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping progress */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-[#60a5fa]" />
                {shipping === 0 ? (
                  <span className="text-sm font-semibold text-emerald-400">
                    ¡Envío gratis desbloqueado!
                  </span>
                ) : (
                  <span className="text-sm text-white/70">
                    Agrega{" "}
                    <span className="font-bold text-white">
                      ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("es-MX")}
                    </span>{" "}
                    más para envío gratis
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Items */}
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: removingId === item.id ? 0 : 1, x: removingId === item.id ? 40 : 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/productos/${item.slug}`} className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-white/[0.04] rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-[#60a5fa]/70 uppercase tracking-wider mb-0.5">
                            {item.brand}
                          </p>
                          <Link
                            href={`/productos/${item.slug}`}
                            className="font-semibold text-sm text-white hover:text-[#60a5fa] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-white/40 mt-1">{item.variant}</p>
                          <p className="text-xs text-white/25">SKU: {item.sku}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>

                      {/* Price + Qty row */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-0 bg-white/[0.05] border border-white/10 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-white">
                            ${(item.price * item.quantity).toLocaleString("es-MX")}
                          </p>
                          {item.comparePrice && item.comparePrice > item.price && (
                            <p className="text-xs text-white/35 line-through">
                              ${(item.comparePrice * item.quantity).toLocaleString("es-MX")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Upsell */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                <h2 className="text-base font-bold text-white">También te puede interesar</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {UPSELL_PRODUCTS.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    brand={p.brand}
                    price={p.price}
                    comparePrice={p.comparePrice}
                    image={p.image}
                    slug={p.slug}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* -- Order summary -- */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sticky top-24">
              <h2 className="text-base font-bold text-white mb-5">Resumen del pedido</h2>

              {/* Coupon input */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold text-emerald-400">{appliedCoupon.code}</p>
                        <p className="text-xs text-white/40">-{Math.round(appliedCoupon.discount * 100)}% aplicado</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-white/30 hover:text-white/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Código de descuento"
                        className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#2563eb]/40 transition-all"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!coupon.trim() || couponLoading}
                        className="px-4 py-2.5 bg-[#2563eb]/15 border border-[#2563eb]/30 text-[#60a5fa] text-sm font-semibold rounded-xl hover:bg-[#2563eb]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {couponLoading ? (
                          <div className="w-4 h-4 border-2 border-[#60a5fa]/50 border-t-[#60a5fa] rounded-full animate-spin" />
                        ) : (
                          <><Tag className="w-3.5 h-3.5" />Aplicar</>
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <div className="flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {couponError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Line items */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} artículos)</span>
                  <span className="text-white">${subtotal.toLocaleString("es-MX")}</span>
                </div>

                {itemSavings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento en productos</span>
                    <span>-${itemSavings.toLocaleString("es-MX")}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Cupón {appliedCoupon?.code}</span>
                    <span>-${couponDiscount.toLocaleString("es-MX")}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/60">
                  <span>Envío</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-400 font-semibold">Gratis</span>
                  ) : (
                    <span className="text-white">${shipping.toLocaleString("es-MX")}</span>
                  )}
                </div>

                <div className="flex justify-between text-white/60">
                  <span className="flex items-center gap-1">
                    IVA (16%)
                    <span className="text-[10px] text-white/30">(incluido)</span>
                  </span>
                  <span className="text-white">${tax.toLocaleString("es-MX")}</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-black text-xl text-white">${total.toLocaleString("es-MX")}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-black font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(37, 99, 235,0.3)] transition-all"
              >
                Proceder al pago
                <ChevronRight className="w-5 h-5" />
              </Link>

              {/* Trust */}
              <div className="mt-4 flex flex-col gap-2">
                {[
                  { icon: "🔒", text: "Pago 100% seguro con cifrado SSL" },
                  { icon: "↩️", text: "Devoluciones gratis en 30 días" },
                  { icon: "📦", text: "Envío rápido a todo México" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-white/35">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
