'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'

type Badge = 'NEW' | 'HOT' | 'SALE' | 'REFURB'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  badge?: Badge
  rating: number
  reviewCount: number
  slug: string
  colors?: string[]
  storage?: string[]
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    price: 32999,
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
    badge: 'NEW',
    rating: 4.9,
    reviewCount: 284,
    slug: 'iphone-16-pro-max',
    colors: ['#2d2d2d', '#d4af8c', '#e8e8e8', '#1c3a5c'],
    storage: ['256GB', '512GB', '1TB'],
  },
  {
    id: '2',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    price: 29999,
    originalPrice: 33999,
    imageUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&q=80',
    badge: 'HOT',
    rating: 4.8,
    reviewCount: 196,
    slug: 'galaxy-s25-ultra',
    colors: ['#1a1a1a', '#8b4513', '#2f4f4f'],
    storage: ['256GB', '512GB', '1TB'],
  },
  {
    id: '3',
    name: 'iPhone 15 Plus',
    brand: 'Apple',
    price: 19999,
    originalPrice: 23999,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    badge: 'SALE',
    rating: 4.7,
    reviewCount: 412,
    slug: 'iphone-15-plus',
    colors: ['#f5d0c8', '#2d4a7a', '#1a1a1a', '#d4e8d0'],
    storage: ['128GB', '256GB', '512GB'],
  },
  {
    id: '4',
    name: 'Samsung Galaxy A55',
    brand: 'Samsung',
    price: 9499,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    badge: 'NEW',
    rating: 4.5,
    reviewCount: 88,
    slug: 'galaxy-a55',
    colors: ['#1a3a6c', '#2d2d2d', '#c8e0d8'],
    storage: ['128GB', '256GB'],
  },
  {
    id: '5',
    name: 'Motorola Edge 50 Pro',
    brand: 'Motorola',
    price: 11999,
    imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&q=80',
    rating: 4.4,
    reviewCount: 53,
    slug: 'moto-edge-50-pro',
    colors: ['#0d0d0d', '#6b3a8c'],
    storage: ['256GB'],
  },
  {
    id: '6',
    name: 'iPhone 14 (Refurbished)',
    brand: 'Apple',
    price: 12999,
    originalPrice: 18999,
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=80',
    badge: 'REFURB',
    rating: 4.6,
    reviewCount: 339,
    slug: 'iphone-14-refurb',
    colors: ['#1a1a1a', '#e8e8e8', '#2d4a7a', '#e8d4c8'],
    storage: ['128GB', '256GB', '512GB'],
  },
]

const BADGE_STYLES: Record<Badge, string> = {
  NEW: 'bg-[#2563eb] text-[#131313]',
  HOT: 'bg-red-500 text-white',
  SALE: 'bg-emerald-500 text-white',
  REFURB: 'bg-purple-500 text-white',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-[#60a5fa]' : 'text-[#e2e2e2]/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

interface QuickViewProps {
  product: Product | null
  onClose: () => void
}

function QuickViewModal({ product, onClose }: QuickViewProps) {
  if (!product) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden"
          style={{ background: 'rgba(31,31,31,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,183,125,0.2)' }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-square">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[#60a5fa] text-sm font-medium mb-1">{product.brand}</p>
                    <h3 className="text-[#e2e2e2] text-2xl font-bold">{product.name}</h3>
                  </div>
                  <button onClick={onClose} className="text-[#e2e2e2]/40 hover:text-[#e2e2e2] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <StarRating rating={product.rating} />
                  <span className="text-[#e2e2e2]/50 text-sm">({product.reviewCount})</span>
                </div>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-bold text-[#e2e2e2]">
                    ${product.price.toLocaleString('es-MX')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[#e2e2e2]/40 line-through text-lg">
                      ${product.originalPrice.toLocaleString('es-MX')}
                    </span>
                  )}
                </div>
                {product.storage && (
                  <div className="mb-4">
                    <p className="text-[#e2e2e2]/60 text-xs mb-2">Almacenamiento</p>
                    <div className="flex gap-2 flex-wrap">
                      {product.storage.map((s) => (
                        <button key={s} className="px-3 py-1 rounded-full border border-[#60a5fa]/30 text-[#e2e2e2] text-xs hover:border-[#60a5fa] hover:bg-[#60a5fa]/10 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button className="w-full py-3 bg-[#2563eb] hover:bg-[#60a5fa] text-[#131313] font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(37, 99, 235,0.4)]">
                  Agregar al carrito
                </button>
                <Link href={`/products/${product.slug}`} className="w-full py-3 border border-[#60a5fa]/30 text-[#60a5fa] font-semibold rounded-full text-center hover:bg-[#60a5fa]/10 transition-all text-sm">
                  Ver producto completo
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface ProductCarouselProps {
  title?: string
  subtitle?: string
  apiEndpoint?: string
}

export default function ProductCarousel({
  title = 'Lo más vendido',
  subtitle = 'Los productos que todos quieren tener',
  apiEndpoint = '/api/products/featured',
}: ProductCarouselProps) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [autoplay.current]
  )
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  useEffect(() => {
    fetch(apiEndpoint)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts(MOCK_PRODUCTS))
  }, [apiEndpoint])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="py-20 bg-[#131313] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-[#60a5fa]" />
              <span className="text-[#60a5fa] text-sm font-medium tracking-widest uppercase">
                Populares
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2]">{title}</h2>
            <p className="text-[#e2e2e2]/50 mt-2">{subtitle}</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="w-10 h-10 rounded-full border border-[#60a5fa]/30 flex items-center justify-center text-[#60a5fa] hover:bg-[#60a5fa]/10 hover:border-[#60a5fa] disabled:opacity-30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="w-10 h-10 rounded-full border border-[#60a5fa]/30 flex items-center justify-center text-[#60a5fa] hover:bg-[#60a5fa]/10 hover:border-[#60a5fa] disabled:opacity-30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[260px] md:w-[280px]"
                onMouseEnter={() => autoplay.current.stop()}
                onMouseLeave={() => autoplay.current.play()}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(31,31,31,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,183,125,0.08)',
                  }}
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold ${BADGE_STYLES[product.badge]}`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Wishlist */}
                  <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#131313]/50 backdrop-blur-sm flex items-center justify-center text-[#e2e2e2]/50 hover:text-[#2563eb] transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-[#1f1f1f]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Glow border on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 25px rgba(37, 99, 235,0.15)', border: '1px solid rgba(255,183,125,0.3)' }} />

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[#60a5fa] text-xs font-medium mb-1">{product.brand}</p>
                    <h3 className="text-[#e2e2e2] font-semibold text-sm leading-snug mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={product.rating} />
                      <span className="text-[#e2e2e2]/40 text-xs">({product.reviewCount})</span>
                    </div>

                    {/* Colors */}
                    {product.colors && (
                      <div className="flex gap-1.5 mb-3">
                        {product.colors.slice(0, 4).map((color) => (
                          <div
                            key={color}
                            className="w-3.5 h-3.5 rounded-full border border-[#e2e2e2]/20 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[#e2e2e2] font-bold text-lg">
                          ${product.price.toLocaleString('es-MX')}
                        </span>
                        {product.originalPrice && (
                          <p className="text-[#e2e2e2]/40 line-through text-xs">
                            ${product.originalPrice.toLocaleString('es-MX')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#60a5fa] text-[#131313] font-bold rounded-xl text-xs transition-all hover:shadow-[0_0_15px_rgba(37, 99, 235,0.3)]">
                        + Carrito
                      </button>
                      <button
                        onClick={() => setQuickView(product)}
                        className="px-3 py-2.5 border border-[#60a5fa]/30 text-[#60a5fa] rounded-xl text-xs hover:bg-[#60a5fa]/10 transition-all"
                      >
                        Vista rápida
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex justify-center gap-3 mt-8 md:hidden">
          <button onClick={scrollPrev} className="w-10 h-10 rounded-full border border-[#60a5fa]/30 flex items-center justify-center text-[#60a5fa]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={scrollNext} className="w-10 h-10 rounded-full border border-[#60a5fa]/30 flex items-center justify-center text-[#60a5fa]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  )
}
