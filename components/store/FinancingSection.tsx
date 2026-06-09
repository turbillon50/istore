'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface FinancePlan {
  id: string
  name: string
  logo: string
  months: number[]
  minMonthly: number
  badge?: string
  features: string[]
  href: string
  accent: string
}

const PLANS: FinancePlan[] = [
  {
    id: '1',
    name: 'Kueski Pay',
    logo: 'K',
    months: [3, 6, 12],
    minMonthly: 499,
    badge: 'Sin tarjeta',
    features: ['Sin tarjeta de crédito', 'Aprobación en 2 min', 'Sin buró'],
    href: '/financing/kueski',
    accent: '#7c3aed',
  },
  {
    id: '2',
    name: 'BBVA Meses',
    logo: 'B',
    months: [3, 6, 9, 12, 18],
    minMonthly: 399,
    badge: 'Sin intereses',
    features: ['0% interés hasta 18 MSI', 'Todas las tarjetas BBVA', 'Sin penalizaciones'],
    href: '/financing/bbva',
    accent: '#004f9f',
  },
  {
    id: '3',
    name: 'Mercado Pago',
    logo: 'M',
    months: [3, 6, 12],
    minMonthly: 449,
    features: ['Sin tarjeta con MercadoPago', 'Hasta 12 mensualidades', 'Protección al comprador'],
    href: '/financing/mercadopago',
    accent: '#00b1ea',
  },
  {
    id: '4',
    name: 'Clip',
    logo: 'C',
    months: [3, 6],
    minMonthly: 599,
    badge: 'Nuevo',
    features: ['Pago con QR', 'Aprobación inmediata', 'Cualquier banco'],
    href: '/financing/clip',
    accent: '#ff6200',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FinancingSection() {
  return (
    <section className="py-20 bg-[#0e0e0e]">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#ffb77d]" />
            <span className="text-[#ffb77d] text-sm font-medium tracking-widest uppercase">Financiamiento</span>
            <div className="w-6 h-px bg-[#ffb77d]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4">
            Tu iPhone,{' '}
            <span className="bg-gradient-to-r from-[#ffb77d] to-[#ff8c00] bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h2>
          <p className="text-[#e2e2e2]/50 text-lg max-w-xl mx-auto">
            Múltiples opciones de pago. Sin trámites complicados. Llévate tu equipo y paga cómodo.
          </p>
        </div>

        {/* Plans grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
        >
          {PLANS.map((plan) => (
            <motion.div key={plan.id} variants={item}>
              <Link href={plan.href}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-2xl h-full cursor-pointer transition-all duration-300"
                  style={{
                    background: 'rgba(31,31,31,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,183,125,0.08)',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full"
                      style={{ background: `${plan.accent}20`, border: `1px solid ${plan.accent}40` }}>
                      <span className="text-xs font-medium" style={{ color: plan.accent }}>{plan.badge}</span>
                    </div>
                  )}

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `0 0 25px ${plan.accent}25`, border: `1px solid ${plan.accent}40` }} />

                  {/* Logo */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white mb-4"
                    style={{ background: plan.accent }}>
                    {plan.logo}
                  </div>

                  <h3 className="text-[#e2e2e2] font-bold text-lg mb-1">{plan.name}</h3>

                  {/* Months chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {plan.months.map((m) => (
                      <span key={m} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${plan.accent}15`, color: plan.accent, border: `1px solid ${plan.accent}30` }}>
                        {m} meses
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <span className="text-[#e2e2e2]/50 text-xs">Desde</span>
                    <div className="text-2xl font-bold text-[#e2e2e2]">
                      ${plan.minMonthly.toLocaleString('es-MX')}
                      <span className="text-sm font-normal text-[#e2e2e2]/50">/mes</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[#e2e2e2]/60 text-xs">
                        <svg className="w-3 h-3 flex-none" style={{ color: plan.accent }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,140,0,0.1) 0%, rgba(31,31,31,0.9) 100%)', border: '1px solid rgba(255,183,125,0.2)' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #ff8c00 0%, transparent 70%)' }} />
          </div>
          <div className="relative z-10">
            <p className="text-[#ffb77d] text-sm font-medium tracking-widest uppercase mb-3">Calculadora de financiamiento</p>
            <h3 className="text-3xl font-bold text-[#e2e2e2] mb-3">
              ¿Cuánto pagarías al mes?
            </h3>
            <p className="text-[#e2e2e2]/50 mb-6">Calcula tu mensualidad en segundos para cualquier equipo.</p>
            <Link href="/financing/calculator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff8c00] hover:bg-[#ffb77d] text-[#131313] font-bold rounded-full transition-all hover:shadow-[0_0_30px_rgba(255,140,0,0.4)]">
              Calcular mensualidad
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
