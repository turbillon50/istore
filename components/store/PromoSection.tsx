'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ hours, minutes, seconds })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center relative overflow-hidden"
        style={{ background: 'rgba(37, 99, 235,0.15)', border: '1px solid rgba(255,183,125,0.3)' }}
      >
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl md:text-3xl font-bold text-[#2563eb]"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-[#e2e2e2]/50 text-xs mt-1.5 uppercase tracking-wider">{label}</span>
    </div>
  )
}

interface PromoData {
  tag: string
  headline: string
  subheadline: string
  endDate: string
  cta: { label: string; href: string }
  bgImageUrl: string
  discount?: string
}

const MOCK_PROMO: PromoData = {
  tag: 'Flash Sale',
  headline: '¡Hasta 40% de descuento!',
  subheadline: 'En los mejores smartphones del momento. Oferta por tiempo limitado.',
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 23 + 1000 * 60 * 47).toISOString(),
  cta: { label: 'Ver ofertas', href: '/sale' },
  bgImageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&q=80',
  discount: '40%',
}

export default function PromoSection() {
  const [promo, setPromo] = useState<PromoData>(MOCK_PROMO)
  const endDate = new Date(promo.endDate)
  const timeLeft = useCountdown(endDate)

  useEffect(() => {
    fetch('/api/promos/active')
      .then((r) => r.json())
      .then(setPromo)
      .catch(() => {})
  }, [])

  return (
    <section className="py-4 px-6 lg:px-16 bg-[#131313]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ minHeight: '280px' }}
      >
        {/* Background */}
        <img
          src={promo.bgImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-[#131313]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#131313]/60" />

        {/* Orange glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Left */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563eb] mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#131313] animate-pulse" />
              <span className="text-[#131313] text-xs font-bold uppercase tracking-widest">{promo.tag}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[#e2e2e2] mb-3">
              {promo.discount && (
                <span className="bg-gradient-to-r from-[#60a5fa] to-[#2563eb] bg-clip-text text-transparent">
                  {promo.discount}{' '}
                </span>
              )}
              {promo.headline.replace(promo.discount || '', '')}
            </h2>
            <p className="text-[#e2e2e2]/60 text-lg max-w-md mb-6">{promo.subheadline}</p>
            <Link
              href={promo.cta.href}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563eb] hover:bg-[#60a5fa] text-[#131313] font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(37, 99, 235,0.5)]"
            >
              {promo.cta.label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[#e2e2e2]/50 text-sm uppercase tracking-widest">Termina en</p>
            <div className="flex items-center gap-3">
              <TimeBlock value={timeLeft.hours} label="Horas" />
              <span className="text-[#2563eb] text-3xl font-bold mb-5">:</span>
              <TimeBlock value={timeLeft.minutes} label="Min" />
              <span className="text-[#2563eb] text-3xl font-bold mb-5">:</span>
              <TimeBlock value={timeLeft.seconds} label="Seg" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
