'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  icon: string
  productCount: number
  featured?: boolean
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'iPhones',
    slug: 'iphones',
    description: 'Últimos modelos Apple',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
    icon: '',
    productCount: 48,
    featured: true,
  },
  {
    id: '2',
    name: 'Samsung',
    slug: 'samsung',
    description: 'Galaxy S, A y Z Series',
    imageUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80',
    icon: '',
    productCount: 62,
    featured: true,
  },
  {
    id: '3',
    name: 'MacBooks',
    slug: 'macbooks',
    description: 'M3, M3 Pro y M3 Max',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    icon: '',
    productCount: 24,
  },
  {
    id: '4',
    name: 'AirPods & Audio',
    slug: 'audio',
    description: 'AirPods, Beats y más',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    icon: '',
    productCount: 35,
  },
  {
    id: '5',
    name: 'Tablets',
    slug: 'tablets',
    description: 'iPad, Tab S y más',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    icon: '',
    productCount: 19,
  },
  {
    id: '6',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Cases, cables, cargadores',
    imageUrl: 'https://images.unsplash.com/photo-1583394293214-0b8b6e2c2e9d?w=600&q=80',
    icon: '',
    productCount: 120,
  },
]

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', { next: { revalidate: 300 } })
    if (!res.ok) throw new Error('fetch failed')
    return res.json()
  } catch {
    return MOCK_CATEGORIES
  }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  return (
    <section className="py-20 bg-[#131313]">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-[#60a5fa]" />
              <span className="text-[#60a5fa] text-sm font-medium tracking-widest uppercase">
                Explora
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2]">
              Categorías
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 text-[#60a5fa] hover:text-[#2563eb] text-sm font-medium transition-colors"
          >
            Ver todo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat, index) => (
            <motion.div key={cat.id} variants={item}>
              <Link href={`/categories/${cat.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                    cat.featured && index < 2 ? 'md:col-span-1 aspect-[3/4]' : 'aspect-[3/4]'
                  }`}
                  style={{
                    background: 'rgba(31,31,31,0.7)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Image */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/30 to-transparent" />
                  {/* Orange glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#2563eb]/20 to-transparent" />
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#60a5fa]/40 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(37, 99, 235,0.2)]" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <h3 className="text-[#e2e2e2] font-bold text-sm leading-tight">{cat.name}</h3>
                    <p className="text-[#e2e2e2]/50 text-xs mt-0.5">{cat.description}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-[#60a5fa] text-xs font-medium">{cat.productCount}</span>
                      <span className="text-[#e2e2e2]/40 text-xs">productos</span>
                    </div>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#2563eb]/0 group-hover:bg-[#2563eb] flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <svg className="w-3 h-3 text-[#131313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
