'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface PhoneModel {
  id: string
  brand: string
  model: string
  year: number
  maxValue: number
  conditions: {
    perfect: number
    good: number
    fair: number
    broken: number
  }
}

const PHONE_MODELS: PhoneModel[] = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    year: 2023,
    maxValue: 12000,
    conditions: { perfect: 12000, good: 10500, fair: 8500, broken: 4000 },
  },
  {
    id: '2',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    year: 2023,
    maxValue: 10500,
    conditions: { perfect: 10500, good: 9000, fair: 7500, broken: 3500 },
  },
  {
    id: '3',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    year: 2022,
    maxValue: 8500,
    conditions: { perfect: 8500, good: 7000, fair: 5500, broken: 2500 },
  },
  {
    id: '4',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    year: 2024,
    maxValue: 11000,
    conditions: { perfect: 11000, good: 9500, fair: 7500, broken: 3000 },
  },
  {
    id: '5',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    year: 2023,
    maxValue: 8000,
    conditions: { perfect: 8000, good: 6500, fair: 5000, broken: 2000 },
  },
  {
    id: '6',
    brand: 'Apple',
    model: 'iPhone 13',
    year: 2021,
    maxValue: 5000,
    conditions: { perfect: 5000, good: 4000, fair: 3000, broken: 1200 },
  },
]

type Condition = 'perfect' | 'good' | 'fair' | 'broken'

const CONDITIONS: { key: Condition; label: string; desc: string; icon: string }[] = [
  { key: 'perfect', label: 'Perfecto', desc: 'Sin rayones, funciona al 100%', icon: '✨' },
  { key: 'good', label: 'Bueno', desc: 'Rayones leves, funciona perfecto', icon: '👍' },
  { key: 'fair', label: 'Regular', desc: 'Daños visibles, funciona', icon: '🔸' },
  { key: 'broken', label: 'Roto', desc: 'Pantalla rota o no enciende', icon: '🔨' },
]

export default function TradeInSection() {
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null)
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null)
  const [brandFilter, setBrandFilter] = useState<string>('all')

  const brands = ['all', ...Array.from(new Set(PHONE_MODELS.map((m) => m.brand)))]
  const filteredModels = brandFilter === 'all' ? PHONE_MODELS : PHONE_MODELS.filter((m) => m.brand === brandFilter)

  const estimatedValue = selectedModel && selectedCondition
    ? selectedModel.conditions[selectedCondition]
    : null

  return (
    <section className="py-20 bg-[#131313]">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-[#ffb77d]" />
              <span className="text-[#ffb77d] text-sm font-medium tracking-widest uppercase">Trade-In</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-5">
              Entrega tu equipo,{' '}
              <span className="bg-gradient-to-r from-[#ffb77d] to-[#ff8c00] bg-clip-text text-transparent">
                estrena uno nuevo
              </span>
            </h2>
            <p className="text-[#e2e2e2]/60 text-lg mb-8 leading-relaxed">
              Cambia tu smartphone actual por crédito para tu próximo equipo. Avalúo justo, proceso en minutos, sin complicaciones.
            </p>

            {/* Steps */}
            <div className="space-y-4">
              {[
                { n: '01', text: 'Selecciona tu equipo y condición' },
                { n: '02', text: 'Obtén tu valuación estimada al instante' },
                { n: '03', text: 'Visítanos o envíalo — confirmamos en 24 hrs' },
                { n: '04', text: 'Aplica el crédito a tu próximo equipo' },
              ].map((step) => (
                <div key={step.n} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-none text-xs font-bold text-[#ff8c00]"
                    style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,183,125,0.2)' }}>
                    {step.n}
                  </div>
                  <p className="text-[#e2e2e2]/70">{step.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: calculator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl p-6 md:p-8"
            style={{
              background: 'rgba(31,31,31,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,183,125,0.15)',
            }}
          >
            <h3 className="text-[#e2e2e2] font-bold text-xl mb-6">Calcula el valor de tu equipo</h3>

            {/* Brand filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => { setBrandFilter(b); setSelectedModel(null) }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    brandFilter === b
                      ? 'bg-[#ff8c00] text-[#131313]'
                      : 'border border-[#ffb77d]/20 text-[#e2e2e2]/60 hover:border-[#ffb77d]/50'
                  }`}
                >
                  {b === 'all' ? 'Todos' : b}
                </button>
              ))}
            </div>

            {/* Model selector */}
            <div className="mb-5">
              <label className="text-[#e2e2e2]/50 text-xs uppercase tracking-wider mb-2 block">Modelo</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model); setSelectedCondition(null) }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all ${
                      selectedModel?.id === model.id
                        ? 'bg-[#ff8c00]/20 border border-[#ff8c00]/50 text-[#ffb77d]'
                        : 'border border-[#e2e2e2]/8 text-[#e2e2e2]/70 hover:border-[#ffb77d]/30 hover:bg-[#ffb77d]/5'
                    }`}
                  >
                    <span className="text-sm font-medium">{model.brand} {model.model}</span>
                    <span className="text-xs opacity-60">{model.year}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition selector */}
            <AnimatePresence>
              {selectedModel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <label className="text-[#e2e2e2]/50 text-xs uppercase tracking-wider mb-2 block">Condición</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setSelectedCondition(c.key)}
                        className={`flex flex-col items-start p-3 rounded-xl transition-all ${
                          selectedCondition === c.key
                            ? 'bg-[#ff8c00]/20 border border-[#ff8c00]/50'
                            : 'border border-[#e2e2e2]/8 hover:border-[#ffb77d]/30'
                        }`}
                      >
                        <span className="text-lg mb-1">{c.icon}</span>
                        <span className={`text-sm font-semibold ${selectedCondition === c.key ? 'text-[#ffb77d]' : 'text-[#e2e2e2]/80'}`}>
                          {c.label}
                        </span>
                        <span className="text-[#e2e2e2]/40 text-xs">{c.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Estimated value */}
            <AnimatePresence>
              {estimatedValue !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-2xl text-center"
                  style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,183,125,0.25)' }}
                >
                  <p className="text-[#e2e2e2]/50 text-xs uppercase tracking-wider mb-2">Valor estimado de trade-in</p>
                  <div className="text-5xl font-black text-[#ff8c00] mb-1">
                    ${estimatedValue.toLocaleString('es-MX')}
                  </div>
                  <p className="text-[#e2e2e2]/40 text-xs">*Sujeto a inspección física final</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Link
              href={estimatedValue ? `/trade-in/start?model=${selectedModel?.id}&condition=${selectedCondition}` : '/trade-in'}
              className={`w-full py-4 font-bold rounded-full text-center block transition-all ${
                estimatedValue
                  ? 'bg-[#ff8c00] hover:bg-[#ffb77d] text-[#131313] hover:shadow-[0_0_25px_rgba(255,140,0,0.4)]'
                  : 'border border-[#ffb77d]/20 text-[#e2e2e2]/40 cursor-default'
              }`}
            >
              {estimatedValue ? 'Iniciar mi Trade-In' : 'Selecciona tu equipo para comenzar'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
