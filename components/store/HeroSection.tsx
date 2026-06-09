'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Banner {
  id: string
  headline: string
  subheadline: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  mediaUrl: string
  mediaType: 'video' | 'image'
}

const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    headline: 'El futuro\ncabe en tu mano.',
    subheadline: 'Tecnología de punta. Precios que no esperabas. Experiencia que no olvidarás.',
    ctaPrimary: { label: 'Comprar ahora', href: '/products' },
    ctaSecondary: { label: 'Ver novedades', href: '/new-arrivals' },
    mediaUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1920&q=80',
    mediaType: 'image',
  },
  {
    id: '2',
    headline: 'iPhone 16 Pro.\nAquí está.',
    subheadline: 'Chip A18 Pro. Cámara 48MP. Titanio aeroespacial. Desde $24,999.',
    ctaPrimary: { label: 'Ordenar ahora', href: '/products/iphone-16-pro' },
    ctaSecondary: { label: 'Comparar modelos', href: '/compare' },
    mediaUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=80',
    mediaType: 'image',
  },
  {
    id: '3',
    headline: 'Samsung Galaxy S25.\nPoder redefinido.',
    subheadline: 'AI integrada. Pantalla Dynamic AMOLED 2X. Disponible en 3 versiones.',
    ctaPrimary: { label: 'Explorar', href: '/products/galaxy-s25' },
    ctaSecondary: { label: 'Ver especificaciones', href: '/products/galaxy-s25#specs' },
    mediaUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=1920&q=80',
    mediaType: 'image',
  },
]

async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch('/api/banners', { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('fetch failed')
    return res.json()
  } catch {
    return MOCK_BANNERS
  }
}

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS)
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchBanners().then(setBanners)
    setLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [banners.length])

  const banner = banners[current]

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#131313]">
      {/* Background media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {banner.mediaType === 'video' ? (
            <video
              src={banner.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={banner.mediaUrl}
              alt={banner.headline}
              className="w-full h-full object-cover"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id + '-content'}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="w-8 h-px bg-[#60a5fa]" />
                <span className="text-[#60a5fa] text-sm font-medium tracking-widest uppercase">
                  iStore Pro
                </span>
              </motion.div>

              {/* Headline with gradient */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-[#e2e2e2]">
                {banner.headline.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {i === 0 ? (
                      line
                    ) : (
                      <span className="bg-gradient-to-r from-[#60a5fa] to-[#2563eb] bg-clip-text text-transparent">
                        {line}
                      </span>
                    )}
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              <p className="text-[#e2e2e2]/70 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
                {banner.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={banner.ctaPrimary.href}
                  className="px-8 py-4 bg-[#2563eb] hover:bg-[#60a5fa] text-[#131313] font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(37, 99, 235,0.5)] active:scale-95"
                >
                  {banner.ctaPrimary.label}
                </Link>
                <Link
                  href={banner.ctaSecondary.href}
                  className="px-8 py-4 border border-[#60a5fa]/40 text-[#60a5fa] hover:border-[#60a5fa] hover:bg-[#60a5fa]/10 font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  {banner.ctaSecondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-[#2563eb]'
                : 'w-2 h-2 bg-[#e2e2e2]/30 hover:bg-[#e2e2e2]/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[#e2e2e2]/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#60a5fa]/60 to-transparent" />
      </motion.div>

      {/* Side decorative line */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#60a5fa]/40" />
        <span className="text-[#e2e2e2]/30 text-xs tracking-widest rotate-90 my-4">
          {String(current + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-[#60a5fa]/40 to-transparent" />
      </div>
    </section>
  )
}
