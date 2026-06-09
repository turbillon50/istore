"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Battery,
  Camera,
  Wifi,
  Droplets,
  Code2,
  Monitor,
  Cpu,
  Shield,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  Send,
  Phone,
  Mail,
  Wrench,
  Star,
  AlertCircle,
  Package,
} from "lucide-react";

// ----------------------------------------------
// Data
// ----------------------------------------------

const SERVICES = [
  {
    id: "pantalla",
    icon: Monitor,
    name: "Reparación de Pantalla",
    description: "Cambio de display original o de alta calidad. Todos los modelos.",
    priceFrom: 899,
    time: "1-2 horas",
    warranty: "90 días",
    popular: true,
  },
  {
    id: "bateria",
    icon: Battery,
    name: "Cambio de Batería",
    description: "Batería original certificada. Recupera tu autonomía como nuevo.",
    priceFrom: 599,
    time: "30-60 min",
    warranty: "6 meses",
    popular: true,
  },
  {
    id: "camara",
    icon: Camera,
    name: "Reparación de Cámara",
    description: "Módulo de cámara frontal o trasera. OEM y aftermarket disponibles.",
    priceFrom: 799,
    time: "1-3 horas",
    warranty: "90 días",
    popular: false,
  },
  {
    id: "software",
    icon: Code2,
    name: "Reparación de Software",
    description: "Formateo, instalación de iOS/Android, recuperación de datos, virus.",
    priceFrom: 399,
    time: "1-4 horas",
    warranty: "30 días",
    popular: false,
  },
  {
    id: "agua",
    icon: Droplets,
    name: "Daño por Líquidos",
    description: "Diagnóstico y limpieza ultrasónica profesional. Recuperación de datos.",
    priceFrom: 699,
    time: "24-48 horas",
    warranty: "30 días",
    popular: false,
  },
  {
    id: "carga",
    icon: Cpu,
    name: "Puerto de Carga",
    description: "Limpieza o reemplazo del puerto Lightning, USB-C o micro-USB.",
    priceFrom: 499,
    time: "1-2 horas",
    warranty: "90 días",
    popular: false,
  },
  {
    id: "wifi",
    icon: Wifi,
    name: "Antena / Señal",
    description: "Reparación de WiFi, Bluetooth, señal celular o GPS.",
    priceFrom: 699,
    time: "2-4 horas",
    warranty: "60 días",
    popular: false,
  },
  {
    id: "botones",
    icon: Smartphone,
    name: "Botones y Altavoz",
    description: "Reparación de botones físicos, micrófono, altavoz y vibrador.",
    priceFrom: 449,
    time: "1-2 horas",
    warranty: "90 días",
    popular: false,
  },
];

const PRICING = [
  { device: "iPhone 15 Pro Max", screen: "3,499", battery: "1,299", camera: "1,999" },
  { device: "iPhone 15 / 15 Plus", screen: "2,799", battery: "1,099", camera: "1,499" },
  { device: "iPhone 14 Pro Max", screen: "2,999", battery: "1,199", camera: "1,799" },
  { device: "iPhone 14 / 14 Plus", screen: "2,499", battery: "999", camera: "1,299" },
  { device: "iPhone 13 / 13 Pro", screen: "1,999", battery: "799", camera: "1,099" },
  { device: "Samsung S24 Ultra", screen: "3,199", battery: "1,299", camera: "1,899" },
  { device: "Samsung S24 / S23", screen: "2,499", battery: "999", camera: "1,399" },
];

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda una reparación?",
    a: "La mayoría de las reparaciones se completan en el día. Cambio de pantalla y batería: 30-120 min. Reparaciones complejas como daño por agua: 24-48 horas. Te notificamos por WhatsApp cuando esté listo.",
  },
  {
    q: "¿Usan refacciones originales?",
    a: "Sí. Para Apple usamos partes OEM certificadas. También ofrecemos opciones aftermarket de alta calidad a menor costo. Siempre te informamos antes de proceder.",
  },
  {
    q: "¿Qué garantía tienen las reparaciones?",
    a: "Todas nuestras reparaciones incluyen garantía de 30 a 180 días según el tipo de servicio. La garantía cubre defectos de la reparación, no daños posteriores.",
  },
  {
    q: "¿Puedo llevar mi equipo sin cita?",
    a: "Sí, aceptamos clientes sin cita. Sin embargo, recomendamos agendar para garantizar atención inmediata, especialmente en fin de semana.",
  },
  {
    q: "¿Qué pasa si no pueden reparar mi equipo?",
    a: "Si el diagnóstico indica que la reparación no es posible o no es costeable, no cobramos el diagnóstico. Solo pagas si reparamos.",
  },
  {
    q: "¿Hacen respaldo de datos antes de reparar?",
    a: "Sí. Antes de cualquier reparación que implique riesgo de pérdida de datos, hacemos un respaldo completo. El respaldo no tiene costo adicional.",
  },
];

// ----------------------------------------------
// Subcomponents
// ----------------------------------------------

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
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

export default function ServiciosPage() {
  const [trackFolio, setTrackFolio] = useState("");
  const [trackResult, setTrackResult] = useState<null | "found" | "not_found">(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    deviceBrand: "", deviceModel: "", service: "",
    problemDesc: "", preferredDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTrack = async () => {
    if (!trackFolio.trim()) return;
    setTrackLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setTrackLoading(false);
    setTrackResult(trackFolio.toUpperCase().startsWith("SRV") ? "found" : "not_found");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
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
            <Wrench className="w-3.5 h-3.5" />
            Centro de Servicio Técnico Certificado
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-4"
          >
            Reparamos tu equipo
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c00] to-[#ffb77d]">
              como el primer día
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/55 max-w-2xl mx-auto mb-8"
          >
            Técnicos certificados por Apple, Samsung y más marcas. Refacciones originales. Garantía por escrito.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50"
          >
            {[
              { icon: Star, text: "4.9/5 en Google" },
              { icon: CheckCircle2, text: "+10,000 reparaciones" },
              { icon: Shield, text: "Garantía por escrito" },
              { icon: Clock, text: "Mismo día" },
            ].map((svc) => {
              const SvcIcon = svc.icon;
              return (
              <div key={svc.text} className="flex items-center gap-1.5">
                <SvcIcon className="w-4 h-4 text-[#ffb77d]" />
                {svc.text}
              </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Service cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-black text-white mb-8">Nuestros servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-[#ff8c00]/30 hover:bg-white/[0.05] transition-all group"
            >
              {service.popular && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-[#ff8c00]/15 text-[#ffb77d] border border-[#ff8c00]/20 rounded-full">
                  Popular
                </span>
              )}
              <div className="w-11 h-11 rounded-xl bg-[#ff8c00]/10 flex items-center justify-center mb-4 group-hover:bg-[#ff8c00]/20 transition-colors">
                <service.icon className="w-5 h-5 text-[#ffb77d]" />
              </div>
              <h3 className="font-bold text-sm text-white mb-2">{service.name}</h3>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">{service.description}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Desde</span>
                  <span className="font-bold text-white">${service.priceFrom.toLocaleString("es-MX")}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">
                    <Clock className="w-3 h-3 inline mr-1" />Tiempo
                  </span>
                  <span className="text-white/70">{service.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">
                    <Shield className="w-3 h-3 inline mr-1" />Garantía
                  </span>
                  <span className="text-white/70">{service.warranty}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-black text-white mb-2">Guía de precios</h2>
        <p className="text-white/50 text-sm mb-8">Precios orientativos. El costo exacto se confirma tras diagnóstico gratuito.</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">Modelo</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">
                  <Monitor className="w-4 h-4 inline mr-1" />Pantalla
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">
                  <Battery className="w-4 h-4 inline mr-1" />Batería
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">
                  <Camera className="w-4 h-4 inline mr-1" />Cámara
                </th>
              </tr>
            </thead>
            <tbody>
              {PRICING.map((row, idx) => (
                <tr key={row.device} className={`border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors ${idx % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                  <td className="py-3 px-4 text-sm font-medium text-white">{row.device}</td>
                  <td className="py-3 px-4 text-sm text-center text-white/80">${row.screen}</td>
                  <td className="py-3 px-4 text-sm text-center text-white/80">${row.battery}</td>
                  <td className="py-3 px-4 text-sm text-center text-white/80">${row.camera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/30 mt-3">* Precios en MXN. Incluye mano de obra y refacción. Diagnóstico siempre gratuito.</p>
      </section>

      {/* Track + Form grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Track repair */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ff8c00]/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-[#ffb77d]" />
              </div>
              <div>
                <h2 className="font-bold text-white">Rastrear mi reparación</h2>
                <p className="text-xs text-white/40">Ingresa tu folio para ver el estado</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={trackFolio}
                onChange={(e) => { setTrackFolio(e.target.value); setTrackResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="Ej: SRV-20241115-001"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
              />
              <button
                onClick={handleTrack}
                disabled={!trackFolio.trim() || trackLoading}
                className="px-5 py-3 bg-[#ff8c00]/15 border border-[#ff8c00]/30 text-[#ffb77d] font-semibold text-sm rounded-xl hover:bg-[#ff8c00]/25 disabled:opacity-50 transition-all"
              >
                {trackLoading ? (
                  <div className="w-4 h-4 border-2 border-[#ffb77d]/40 border-t-[#ffb77d] rounded-full animate-spin" />
                ) : (
                  "Buscar"
                )}
              </button>
            </div>

            <AnimatePresence>
              {trackResult === "found" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-sm text-emerald-400">Folio: {trackFolio.toUpperCase()}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Dispositivo", value: "iPhone 14 Pro Max" },
                      { label: "Servicio", value: "Cambio de pantalla" },
                      { label: "Estado", value: "🔧 En reparación" },
                      { label: "Estimado listo", value: "Hoy 18:00" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-white/50">{label}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {trackResult === "not_found" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-300">Folio no encontrado. Verifica el número o llámanos al (55) 1234-5678.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Warranty */}
            <div className="mt-6 bg-[#ff8c00]/5 border border-[#ff8c00]/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#ffb77d]" />
                <span className="text-sm font-bold text-white">Garantía de servicio</span>
              </div>
              <ul className="text-xs text-white/55 space-y-1">
                <li>• Pantalla y cámara: 90 días de garantía</li>
                <li>• Batería: 6 meses de garantía</li>
                <li>• Software: 30 días de garantía</li>
                <li>• Daño por líquidos: 30 días de garantía</li>
                <li className="text-white/35">La garantía no cubre daños físicos posteriores a la reparación.</li>
              </ul>
            </div>
          </div>

          {/* Service request form */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ff8c00]/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#ffb77d]" />
              </div>
              <div>
                <h2 className="font-bold text-white">Solicitar servicio</h2>
                <p className="text-xs text-white/40">Te contactamos en menos de 1 hora hábil</p>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white mb-2">¡Solicitud enviada!</h3>
                <p className="text-sm text-white/55">Te contactaremos pronto al número o correo que proporcionaste.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#ffb77d] hover:underline">
                  Enviar otra solicitud
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Nombre</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Teléfono</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="55 1234 5678"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block">Correo</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@correo.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Marca</label>
                    <input
                      required
                      value={form.deviceBrand}
                      onChange={(e) => setForm({ ...form, deviceBrand: e.target.value })}
                      placeholder="Apple, Samsung..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Modelo</label>
                    <input
                      required
                      value={form.deviceModel}
                      onChange={(e) => setForm({ ...form, deviceModel: e.target.value })}
                      placeholder="iPhone 15 Pro..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block">Tipo de servicio</label>
                  <select
                    required
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff8c00]/40 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#1e1e1e]">Seleccionar...</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#1e1e1e]">{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block">Descripción del problema</label>
                  <textarea
                    required
                    rows={3}
                    value={form.problemDesc}
                    onChange={(e) => setForm({ ...form, problemDesc: e.target.value })}
                    placeholder="Describe qué le pasa a tu equipo con el mayor detalle posible..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff8c00]/40 transition-all resize-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] transition-all disabled:opacity-70"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar solicitud
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <h2 className="text-2xl font-black text-white mb-8">Preguntas frecuentes</h2>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 divide-y divide-white/[0.06]">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
