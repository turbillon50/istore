'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

interface Brand {
  id: string
  name: string
  slug: string
  logoUrl?: string
  logoText?: string
  accent?: string
}

const MOCK_BRANDS: Brand[] = [
  { id: '1', name: 'Apple', slug: 'apple', logoText: '', accent: '#e8e8e8' },
  { id: '2', name: 'Samsung', slug: 'samsung', logoText: 'SAMSUNG', accent: '#1428a0' },
  { id: '3', name: 'Motorola', slug: 'motorola', logoText: 'motorola', accent: '#e1001a' },
  { id: '4', name: 'Xiaomi', slug: 'xiaomi', logoText: 'xiaomi', accent: '#ff6900' },
  { id: '5', name: 'OnePlus', slug: 'oneplus', logoText: 'OnePlus', accent: '#f5010c' },
  { id: '6', name: 'Google', slug: 'google', logoText: 'Google', accent: '#4285f4' },
  { id: '7', name: 'Sony', slug: 'sony', logoText: 'SONY', accent: '#003087' },
  { id: '8', name: 'Huawei', slug: 'huawei', logoText: 'HUAWEI', accent: '#cf0a2c' },
  { id: '9', name: 'Oppo', slug: 'oppo', logoText: 'OPPO', accent: '#1fa95c' },
  { id: '10', name: 'Nothing', slug: 'nothing', logoText: 'Nothing', accent: '#e2e2e2' },
]

// Duplicate for seamless scroll
const BRANDS_LOOP = [...MOCK_BRANDS, ...MOCK_BRANDS]

export default function FeaturedBrands() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-16 bg-[#0e0e0e] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-px bg-[#ffb77d]" />
          <span className="text-[#ffb77d] text-sm font-medium tracking-widest uppercase">
            Marcas
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2]">
          Las mejores marcas
        </h2>
      </div>

      {/* Scrolling strip */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0e0e0e] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0e0e0e] to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-4 px-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{ width: 'max-content' }}
        >
          {BRANDS_LOOP.map((brand, index) => (
            <Link key={`${brand.id}-${index}`} href={`/brands/${brand.slug}`}>
              <motion.div
                whileHover={{ y: -4, scale: 1.05 }}
                className="group relative flex items-center justify-center w-36 h-20 rounded-xl cursor-pointer transition-all duration-300 flex-none"
                style={{
                  background: 'rgba(31,31,31,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,183,125,0.08)',
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 25px rgba(255,140,0,0.2)', border: '1px solid rgba(255,183,125,0.3)' }}
                />

                {/* Brand display */}
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-8 w-auto object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                    style={{ filter: 'grayscale(1) brightness(0.6)', WebkitFilter: 'grayscale(1) brightness(0.6)' }}
                  />
                ) : (
                  <span
                    className="text-lg font-bold tracking-tight transition-colors duration-300"
                    style={{
                      color: 'rgba(226,226,226,0.4)',
                    }}
                  >
                    {brand.logoText || brand.name}
                  </span>
                )}

                {/* Hover color reveal */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span
                    className="text-lg font-bold tracking-tight"
                    style={{ color: brand.accent || '#ffb77d' }}
                  >
                    {brand.logoText || brand.name}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Static grid for mobile fallback / secondary display */}
      <div className="container mx-auto px-6 lg:px-16 mt-10">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {MOCK_BRANDS.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.slug}`}>
              <motion.div
                whileHover={{ y: -3 }}
                className="group flex items-center justify-center h-12 rounded-lg cursor-pointer transition-all duration-300"
                style={{
                  background: 'rgba(31,31,31,0.5)',
                  border: '1px solid rgba(255,183,125,0.06)',
                }}
              >
                <span className="text-[#e2e2e2]/30 group-hover:text-[#ffb77d] text-xs font-semibold transition-colors duration-300 truncate px-2">
                  {brand.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
