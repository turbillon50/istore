'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Service {
  id: string
  icon: string
  title: string
  description: string
  priceRange: string
  timeEstimate: string
  href: string
  popular?: boolean
}

const SERVICES: Service[] = [
  {
    id: '1',
    icon: '🔧',
    title: 'Reparación de pantalla',
    description: 'Reemplazo de pantalla original. iPhone, Samsung y más marcas. Garantía incluida.',
    priceRange: 'Desde $799',
    timeEstimate: '1-2 horas',
    href: '/services/screen-repair',
    popular: true,
  },
  {
    id: '2',
    icon: '🔓',
    title: 'Desbloqueo de carrier',
    description: 'Libera tu iPhone o Android de cualquier operadora. Permanente y oficial.',
    priceRange: 'Desde $299',
    timeEstimate: '24-48 hrs',
    href: '/services/unlock',
  },
  {
    id: '3',
    icon: '🔋',
    title: 'Cambio de batería',
    description: 'Batería 100% de capacidad. Diagnóstico gratuito incluido.',
    priceRange: 'Desde $499',
    timeEstimate: '30-60 min',
    href: '/services/battery',
    popular: true,
  },
  {
    id: '4',
    icon: '💾',
    title: 'Respaldo y transferencia',
    description: 'Mueve todos tus datos al nuevo equipo. iCloud, Google, transferencia directa.',
    priceRange: 'Desde $199',
    timeEstimate: '30-90 min',
    href: '/services/backup',
  },
  {
    id: '5',
    icon: '📱',
    title: 'Diagnóstico gratuito',
    description: 'Revisión completa de hardware y software sin costo. Estimado al instante.',
    priceRange: 'Gratis',
    timeEstimate: '15-20 min',
    href: '/services/diagnostic',
  },
  {
    id: '6',
    icon: '🛡️',
    title: 'Plan de protección',
    description: 'Cobertura total contra daños accidentales, robos y fallas. Mensualidad fija.',
    priceRange: 'Desde $99/mes',
    timeEstimate: 'Cobertura inmediata',
    href: '/services/protection',
    popular: true,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesSection() {
  return (
    <section className="py-20 bg-[#131313]">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#60a5fa]" />
            <span className="text-[#60a5fa] text-sm font-medium tracking-widest uppercase">Servicios</span>
            <div className="w-6 h-px bg-[#60a5fa]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4">
            Tu tech, en manos expertas
          </h2>
          <p className="text-[#e2e2e2]/50 text-lg max-w-xl mx-auto">
            Reparaciones certificadas, desbloqueos oficiales y más. Técnicos especializados con años de experiencia.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SERVICES.map((service) => (
            <motion.div key={service.id} variants={card}>
              <Link href={service.href}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-2xl h-full cursor-pointer transition-all duration-300"
                  style={{
                    background: 'rgba(31,31,31,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,183,125,0.08)',
                  }}
                >
                  {/* Popular badge */}
                  {service.popular && (
                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#2563eb]/20 border border-[#2563eb]/30">
                      <span className="text-[#2563eb] text-xs font-medium">Popular</span>
                    </div>
                  )}

                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: '0 0 25px rgba(37, 99, 235,0.15)', border: '1px solid rgba(255,183,125,0.25)' }}
                  />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(37, 99, 235,0.1)', border: '1px solid rgba(255,183,125,0.15)' }}
                  >
                    {service.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-[#e2e2e2] font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-[#e2e2e2]/50 text-sm leading-relaxed mb-5">{service.description}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-[#2563eb] font-bold">{service.priceRange}</div>
                      <div className="text-[#e2e2e2]/40 text-xs mt-0.5">{service.timeEstimate}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#2563eb]/0 group-hover:bg-[#2563eb] flex items-center justify-center transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-[#e2e2e2] group-hover:text-[#131313] transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl"
          style={{ background: 'rgba(37, 99, 235,0.06)', border: '1px solid rgba(255,183,125,0.15)' }}
        >
          <div className="text-center md:text-left">
            <p className="text-[#e2e2e2] font-semibold">¿No encuentras el servicio que necesitas?</p>
            <p className="text-[#e2e2e2]/50 text-sm">Contáctanos — atendemos casos especiales.</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 border border-[#60a5fa]/40 text-[#60a5fa] hover:border-[#60a5fa] hover:bg-[#60a5fa]/10 font-semibold rounded-full transition-all whitespace-nowrap"
          >
            Hablar con un técnico
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
