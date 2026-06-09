"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Calculator,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Send,
  TrendingDown,
  Banknote,
  Shield,
  Clock,
  Users,
  Percent,
  DollarSign,
} from "lucide-react";

// ----------------------------------------------
// Data
// ----------------------------------------------

const FINANCING_OPTIONS = [
  {
    id: "msi_3",
    name: "3 Meses Sin Intereses",
    provider: "Visa / MasterCard participantes",
    months: 3,
    rate: 0,
    minAmount: 2000,
    maxAmount: 50000,
    badge: "Sin intereses",
    badgeColor: "emerald",
    popular: false,
  },
  {
    id: "msi_6",
    name: "6 Meses Sin Intereses",
    provider: "Banamex, BBVA, Santander, HSBC",
    months: 6,
    rate: 0,
    minAmount: 3000,
    maxAmount: 50000,
    badge: "Sin intereses",
    badgeColor: "emerald",
    popular: true,
  },
  {
    id: "msi_12",
    name: "12 Meses Sin Intereses",
    provider: "Bancos seleccionados",
    months: 12,
    rate: 0,
    minAmount: 5000,
    maxAmount: 50000,
    badge: "Sin intereses",
    badgeColor: "emerald",
    popular: false,
  },
  {
    id: "ci_18",
    name: "18 Meses con Intereses",
    provider: "Todas las tarjetas",
    months: 18,
    rate: 18,
    minAmount: 2000,
    maxAmount: 100000,
    badge: "18% anual",
    badgeColor: "amber",
    popular: false,
  },
  {
    id: "ci_24",
    name: "24 Meses con Intereses",
    provider: "Todas las tarjetas",
    months: 24,
    rate: 24,
    minAmount: 2000,
    maxAmount: 100000,
    badge: "24% anual",
    badgeColor: "amber",
    popular: false,
  },
  {
    id: "kueski",
    name: "Kueski Pay",
    provider: "Sin tarjeta de crédito",
    months: 4,
    rate: 0,
    minAmount: 500,
    maxAmount: 20000,
    badge: "Sin buró",
    badgeColor: "purple",
    popular: false,
  },
];

const REQUIREMENTS = [
  "Identificación oficial vigente (INE, pasaporte)",
  "Tarjeta de crédito o débito a tu nombre",
  "Teléfono celular activo para validación",
  "Comprobante de domicilio (no mayor a 3 meses) para montos +$20,000",
  "Para Kueski Pay: solo tu CURP y número de teléfono",
];

const FAQS = [
  {
    q: "¿Necesito buen historial crediticio?",
    a: "Para tarjetas de crédito bancarias sí depende del banco. Para Kueski Pay no se revisa buró de crédito.",
  },
  {
    q: "¿Puedo pagar antes sin penalización?",
    a: "Sí. Para meses sin intereses puedes liquidar en cualquier momento. Para meses con intereses consulta tu banco.",
  },
  {
    q: "¿Qué tarjetas aplican para MSI?",
    a: "BBVA, Banamex, Santander, HSBC, Scotiabank, Inbursa, Banjercito. Las condiciones exactas dependen de tu banco.",
  },
  {
    q: "¿Puedo combinar financiamiento con descuentos?",
    a: "Sí. Los cupones de descuento y promociones se aplican antes de calcular el monto a financiar.",
  },
];

// ----------------------------------------------
// Calculator
// ----------------------------------------------

function calculateMonthly(amount: number, months: number, annualRate: number): number {
  if (annualRate === 0) return Math.ceil(amount / months);
  const r = annualRate / 100 / 12;
  const payment = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.ceil(payment);
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 py-4 text-left">
        <span className="text-sm font-semibold text-white">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-white/55 pb-4 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------
// Main
// ----------------------------------------------

export default function FinanciamientoPage() {
  const [productPrice, setProductPrice] = useState(27999);
  const [rawPrice, setRawPrice] = useState("27999");

  // Form
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    productInterest: "", incomeRange: "", preferredPlan: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePriceChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    setRawPrice(clean);
    const num = parseInt(clean, 10);
    if (!isNaN(num)) setProductPrice(num);
  };

  const plans = useMemo(() =>
    FINANCING_OPTIONS.map((opt) => ({
      ...opt,
      monthly: calculateMonthly(productPrice, opt.months, opt.rate),
      totalCost: calculateMonthly(productPrice, opt.months, opt.rate) * opt.months,
      available: productPrice >= opt.minAmount && productPrice <= opt.maxAmount,
    })),
    [productPrice]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const badgeStyles: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  };

  return (
    <div className="min-h-screen bg-[#131313] text-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#131313] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.08),transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#ff8c00]/10 border border-[#ff8c00]/20 text-[#ffb77d] text-xs font-semibold px-4 py-2 rounded-full mb-6"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Financiamiento flexible sin complicaciones
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-4"
          >
            Tu equipo,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c00] to-[#ffb77d]">
              a tu ritmo
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/55 max-w-xl mx-auto"
          >
            Hasta 24 meses de financiamiento. Sin buró con Kueski. Sin intereses en bancos participantes.
          </motion.p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Input */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ff8c00]/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#ffb77d]" />
              </div>
              <div>
                <h2 className="font-bold text-white">Calculadora de pagos</h2>
                <p className="text-xs text-white/40">Ingresa el precio del producto</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm text-white/60 mb-2 block">Precio del producto (MXN)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">$</span>
                <input
                  type="text"
                  value={rawPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-8 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-white/30 mt-2">
                Monto: ${productPrice.toLocaleString("es-MX")} MXN
              </p>
            </div>

            {/* Quick presets */}
            <div>
              <p className="text-xs text-white/40 mb-3">Productos populares</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "iPhone 15 PM", price: 27999 },
                  { label: "Galaxy S24 U", price: 29999 },
                  { label: "MacBook Air M2", price: 24999 },
                  { label: "iPad Pro 11\"", price: 19999 },
                ].map(({ label, price }) => (
                  <button
                    key={price}
                    onClick={() => { setProductPrice(price); setRawPrice(String(price)); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      productPrice === price
                        ? "bg-[#ff8c00]/20 border-[#ff8c00]/40 text-[#ffb77d]"
                        : "bg-white/[0.04] border-white/10 text-white/60 hover:border-white/25"
                    }`}
                  >
                    {label} · ${(price / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plans table */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/60 mb-4">Planes disponibles para ${productPrice.toLocaleString("es-MX")}</h3>
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                layout
                className={`rounded-2xl border p-4 transition-all ${
                  !plan.available
                    ? "opacity-40 border-white/[0.05] bg-white/[0.02]"
                    : plan.popular
                    ? "border-[#ff8c00]/30 bg-[#ff8c00]/5"
                    : "border-white/[0.07] bg-white/[0.03] hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{plan.name}</span>
                      {plan.popular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#ff8c00]/15 text-[#ffb77d] border border-[#ff8c00]/20 rounded-full">
                          Popular
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${badgeStyles[plan.badgeColor]}`}>
                        {plan.badge}
                      </span>
                    </div>
                    <p className="text-xs text-white/40">{plan.provider}</p>
                    {!plan.available && (
                      <p className="text-xs text-red-400 mt-1">
                        Monto mínimo: ${plan.minAmount.toLocaleString("es-MX")}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black text-white">
                      ${plan.monthly.toLocaleString("es-MX")}
                      <span className="text-xs font-normal text-white/40">/mes</span>
                    </p>
                    {plan.rate > 0 && plan.available && (
                      <p className="text-xs text-white/35">
                        Total: ${plan.totalCost.toLocaleString("es-MX")}
                      </p>
                    )}
                    {plan.rate === 0 && plan.available && (
                      <p className="text-xs text-emerald-400">Sin costo extra</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ffb77d]" />
              Requisitos
            </h2>
            <ul className="space-y-3">
              {REQUIREMENTS.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-white/65">
                  <div className="w-5 h-5 rounded-full bg-[#ff8c00]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#ffb77d]" />
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#ffb77d]" />
              Beneficios
            </h2>
            <div className="space-y-4">
              {[
                { icon: Shield, title: "Sin buró con Kueski", desc: "No importa tu historial, aplica con CURP y teléfono." },
                { icon: Percent, title: "0% de interés", desc: "En bancos participantes hasta 12 meses sin pagar más." },
                { icon: Clock, title: "Aprobación inmediata", desc: "En tienda o en línea en menos de 2 minutos." },
                { icon: Banknote, title: "Sin enganche", desc: "Llevas tu equipo hoy sin desembolso inicial." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff8c00]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#ffb77d]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-white/45">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <h2 className="font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#ffb77d]" />
            Pre-solicitar financiamiento
          </h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white mb-2">¡Solicitud enviada!</h3>
              <p className="text-sm text-white/55 max-w-xs mx-auto">
                Un asesor se pondrá en contacto contigo en menos de 1 hora hábil.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Nombre completo</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Juan Pérez" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Teléfono</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="55 1234 5678" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Correo</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@correo.com" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all" />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">¿Qué producto te interesa?</label>
                <input value={form.productInterest} onChange={(e) => setForm({ ...form, productInterest: e.target.value })}
                  placeholder="iPhone 15 Pro Max, MacBook Air..." className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Plan preferido</label>
                  <select value={form.preferredPlan} onChange={(e) => setForm({ ...form, preferredPlan: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff8c00]/40 transition-all appearance-none">
                    <option value="" className="bg-[#1e1e1e]">Seleccionar...</option>
                    {FINANCING_OPTIONS.map((o) => <option key={o.id} value={o.id} className="bg-[#1e1e1e]">{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Rango de ingresos</label>
                  <select value={form.incomeRange} onChange={(e) => setForm({ ...form, incomeRange: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff8c00]/40 transition-all appearance-none">
                    <option value="" className="bg-[#1e1e1e]">Seleccionar...</option>
                    {["Menos de $10,000", "$10,000 - $20,000", "$20,000 - $40,000", "Más de $40,000"].map((r) => (
                      <option key={r} value={r} className="bg-[#1e1e1e]">{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] transition-all disabled:opacity-70">
                {submitting ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Send className="w-4 h-4" />Enviar pre-solicitud</>}
              </motion.button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <h2 className="text-2xl font-black text-white mb-6">Preguntas frecuentes</h2>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 divide-y divide-white/[0.06]">
          {FAQS.map((faq) => <FaqItem key={faq.q} question={faq.q} answer={faq.a} />)}
        </div>
      </section>
    </div>
  );
}
