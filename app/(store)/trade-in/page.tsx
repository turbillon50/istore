"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  Upload,
  X,
  Info,
  Smartphone,
  Search,
  DollarSign,
  Send,
  AlertCircle,
  Star,
} from "lucide-react";

// ----------------------------------------------
// Data
// ----------------------------------------------

const BRANDS = [
  { id: "apple", name: "Apple", logo: "🍎" },
  { id: "samsung", name: "Samsung", logo: "📱" },
  { id: "xiaomi", name: "Xiaomi", logo: "📲" },
  { id: "motorola", name: "Motorola", logo: "📳" },
  { id: "huawei", name: "Huawei", logo: "📱" },
  { id: "lg", name: "LG", logo: "📱" },
  { id: "sony", name: "Sony", logo: "📱" },
  { id: "other", name: "Otra", logo: "📱" },
];

const MODELS_BY_BRAND: Record<string, string[]> = {
  apple: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11", "iPhone XS Max", "iPhone XS", "iPhone XR", "Otro iPhone"],
  samsung: ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S22 Ultra", "Galaxy A54", "Galaxy A34", "Galaxy A14", "Otro Samsung"],
  xiaomi: ["Xiaomi 14 Ultra", "Xiaomi 13T Pro", "Redmi Note 13 Pro", "Redmi Note 12", "POCO X6 Pro", "Otro Xiaomi"],
  motorola: ["Motorola Edge 50 Ultra", "Motorola Edge 40 Pro", "Moto G84", "Moto G54", "Otro Motorola"],
  huawei: ["P60 Pro", "P50 Pro", "Mate 60 Pro", "Nova 11", "Otro Huawei"],
  lg: ["LG G8", "LG V60", "Otro LG"],
  sony: ["Xperia 1 V", "Xperia 5 V", "Otro Sony"],
  other: ["Especificar en descripción"],
};

// Estimated values by condition
const VALUE_MATRIX: Record<string, Record<string, number>> = {
  "iPhone 15 Pro Max": { EXCELLENT: 18500, GOOD: 15000, FAIR: 10000, POOR: 5000 },
  "iPhone 15 Pro": { EXCELLENT: 15000, GOOD: 12000, FAIR: 8000, POOR: 4000 },
  "iPhone 14 Pro Max": { EXCELLENT: 12000, GOOD: 9500, FAIR: 6500, POOR: 3500 },
  "iPhone 14 Pro": { EXCELLENT: 10000, GOOD: 8000, FAIR: 5500, POOR: 3000 },
  "Galaxy S24 Ultra": { EXCELLENT: 16000, GOOD: 13000, FAIR: 9000, POOR: 4500 },
  "Galaxy S23 Ultra": { EXCELLENT: 11000, GOOD: 9000, FAIR: 6000, POOR: 3000 },
};

const CONDITIONS = [
  {
    id: "EXCELLENT",
    label: "Excelente",
    emoji: "✨",
    description: "Sin rayones visibles. Pantalla perfecta. Batería +90%. Todos los botones funcionan. Caja original.",
    color: "emerald",
  },
  {
    id: "GOOD",
    label: "Bueno",
    emoji: "👍",
    description: "Rayones menores que no se ven encendido. Batería +80%. Funciona perfectamente.",
    color: "blue",
  },
  {
    id: "FAIR",
    label: "Regular",
    emoji: "🔧",
    description: "Rayones visibles o golpes leves. Batería +60%. Funciona con pequeños defectos.",
    color: "amber",
  },
  {
    id: "POOR",
    label: "Dañado",
    emoji: "⚠️",
    description: "Pantalla rota, golpes fuertes, no enciende o falla constantemente.",
    color: "red",
  },
];

const STEPS_INFO = [
  { num: 1, title: "Selecciona tu equipo", desc: "Marca y modelo" },
  { num: 2, title: "Evalúa la condición", desc: "Estado del dispositivo" },
  { num: 3, title: "Tu cotización", desc: "Precio estimado" },
];

const conditionColors: Record<string, string> = {
  emerald: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
  blue: "border-blue-500 bg-blue-500/10 text-blue-400",
  amber: "border-amber-500 bg-amber-500/10 text-amber-400",
  red: "border-red-500 bg-red-500/10 text-red-400",
};

const conditionInactive = "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25";

// ----------------------------------------------
// Main
// ----------------------------------------------

export default function TradeInPage() {
  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [imei, setImei] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", storage: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const estimatedValue = selectedModel && selectedCondition
    ? (VALUE_MATRIX[selectedModel]?.[selectedCondition] ?? 2500)
    : null;

  const models = MODELS_BY_BRAND[selectedBrand] ?? [];
  const filteredModels = models.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.slice(0, 4 - photos.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.07),transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-6"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Trade-In — Dispositivos usados
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-4"
          >
            Renueva tu equipo —<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              nosotros te pagamos el viejo
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/55 max-w-xl mx-auto mb-10"
          >
            Obtén hasta $18,500 por tu dispositivo y aplícalo a tu nueva compra. Rápido, justo y sin complicaciones.
          </motion.p>

          {/* Steps info */}
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {STEPS_INFO.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center px-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 mb-2">
                    {s.num}
                  </div>
                  <p className="text-xs font-semibold text-white">{s.title}</p>
                  <p className="text-[11px] text-white/40">{s.desc}</p>
                </div>
                {idx < STEPS_INFO.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main evaluator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* STEP 1: Brand + Model */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                ¿Qué equipo quieres entregar?
              </h2>

              {/* Brand selection */}
              {!selectedBrand ? (
                <div>
                  <p className="text-sm text-white/50 mb-4">Selecciona la marca</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BRANDS.map((brand) => (
                      <motion.button
                        key={brand.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedBrand(brand.id)}
                        className="flex flex-col items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                      >
                        <span className="text-3xl">{brand.logo}</span>
                        <span className="text-sm font-semibold text-white">{brand.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => { setSelectedBrand(""); setSelectedModel(""); setModelSearch(""); }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Cambiar marca
                    </button>
                    <span className="text-white/20">·</span>
                    <span className="text-sm text-white font-semibold">
                      {BRANDS.find((b) => b.id === selectedBrand)?.name}
                    </span>
                  </div>

                  <p className="text-sm text-white/50 mb-3">Selecciona el modelo</p>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Buscar modelo..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-emerald-500/30 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {filteredModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => setSelectedModel(model)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          selectedModel === model
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.07] text-white/70 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        {model}
                        {selectedModel === model && <Check className="inline ml-2 w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setForm({ ...form, storage })}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                          form.storage === storage
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selectedModel}
                    onClick={() => setStep(2)}
                    className="mt-6 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Condition */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => setStep(1)} className="text-emerald-400 hover:text-emerald-300">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-bold text-white">
                    ¿En qué condición está tu {selectedModel}?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {CONDITIONS.map((cond) => (
                    <motion.button
                      key={cond.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCondition(cond.id)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${
                        selectedCondition === cond.id
                          ? conditionColors[cond.color]
                          : conditionInactive
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{cond.emoji}</span>
                        <span className="font-bold text-base">{cond.label}</span>
                        {selectedCondition === cond.id && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                      <p className="text-xs leading-relaxed opacity-70">{cond.description}</p>

                      {selectedCondition === cond.id && estimatedValue && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 pt-3 border-t border-current/20"
                        >
                          <p className="text-xs opacity-70">Valor estimado</p>
                          <p className="text-xl font-black">
                            ${estimatedValue.toLocaleString("es-MX")}
                          </p>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Photos upload */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-white/40" />
                    Fotos del equipo (opcional, sube hasta 4)
                  </p>
                  <p className="text-xs text-white/35 mb-3">Las fotos ayudan a confirmar la cotización más rápido.</p>

                  <div className="flex flex-wrap gap-3">
                    {photos.map((src, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                        <Image src={src} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                        <button
                          onClick={() => setPhotos((p) => p.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 4 && (
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-1 hover:border-emerald-500/40 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-white/30" />
                        <span className="text-[10px] text-white/30">Subir</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>

                <button
                  disabled={!selectedCondition}
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Ver mi cotización
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Quote + Form */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Quote card */}
              <div className="bg-gradient-to-br from-emerald-500/15 to-teal-500/5 border border-emerald-500/25 rounded-2xl p-6 text-center">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-emerald-400 text-xs mb-4 hover:text-emerald-300">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Volver
                </button>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
                  <DollarSign className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-sm text-white/60 mb-1">{selectedModel} · {CONDITIONS.find(c => c.id === selectedCondition)?.label}</p>
                <p className="text-5xl font-black text-white mb-2">
                  ${estimatedValue?.toLocaleString("es-MX")}
                </p>
                <p className="text-sm text-emerald-400 font-semibold">Valor estimado de intercambio</p>
                <p className="text-xs text-white/35 mt-2">
                  El valor final se confirma tras revisión física del equipo en tienda. Válido por 7 días.
                </p>
              </div>

              {/* Contact form */}
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Cotización registrada!</h3>
                  <p className="text-white/55 text-sm max-w-xs mx-auto">
                    Un asesor se pondrá en contacto contigo en 1-2 horas hábiles para confirmar los detalles.
                  </p>
                </motion.div>
              ) : (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" />
                    Confirmar solicitud de Trade-In
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Nombre</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Tu nombre" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/30 transition-all" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Teléfono</label>
                        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="55 1234 5678" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/30 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Correo</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="tu@correo.com" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/30 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">IMEI (opcional)</label>
                      <input value={imei} onChange={(e) => setImei(e.target.value)}
                        placeholder="15 dígitos — marca *#06# en tu teléfono" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/30 transition-all" />
                      <p className="text-xs text-white/25 mt-1">El IMEI permite verificar que el equipo no está reportado como robado.</p>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Notas adicionales</label>
                      <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Cualquier detalle adicional sobre el equipo..."
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/30 transition-all resize-none" />
                    </div>

                    <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-70">
                      {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" />Confirmar Trade-In</>}
                    </motion.button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-white mb-8 text-center">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Cotiza en línea", desc: "Selecciona tu equipo y condición para obtener una estimación al instante.", icon: "💻" },
              { step: "02", title: "Lleva tu equipo", desc: "Trae tu dispositivo a cualquiera de nuestras sucursales.", icon: "🏪" },
              { step: "03", title: "Revisión técnica", desc: "Nuestros técnicos verifican el estado real del equipo en 15 minutos.", icon: "🔍" },
              { step: "04", title: "Aplica el valor", desc: "El valor aprobado se descuenta directamente de tu nueva compra.", icon: "✅" },
            ].map(({ step: s, title, desc, icon }) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
                  {icon}
                </div>
                <p className="text-xs text-emerald-400 font-bold mb-1">Paso {s}</p>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
