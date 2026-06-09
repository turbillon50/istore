"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#131313]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#131313]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-[#2563eb] blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#2563eb] blur-[140px]"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-24">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-fit"
            >
              <Zap className="w-4 h-4 text-[#60a5fa]" fill="#60a5fa" />
              <span className="text-sm text-[#60a5fa] font-medium">
                Nuevos lanzamientos disponibles
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
            >
              <span className="text-white">Tecnología</span>
              <br />
              <span className="bg-gradient-to-r from-[#60a5fa] via-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent">
                que inspira
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/60 max-w-lg leading-relaxed"
            >
              Los mejores smartphones, accesorios y servicios tecnológicos.
              Financiamiento sin buró, envíos a todo México.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <Link
                href="/productos"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-black font-bold px-8 py-4 rounded-full text-base transition-all hover:shadow-[0_0_30px_rgba(37, 99, 235,0.4)] hover:scale-105 active:scale-95"
              >
                Ver Colección
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/financiamiento"
                className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:bg-white/10 hover:border-white/25 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                Financiamiento
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 mt-4 pt-4 border-t border-white/10"
            >
              {[
                { value: "50K+", label: "Clientes felices" },
                { value: "500+", label: "Modelos disponibles" },
                { value: "24h", label: "Envío express" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-black text-[#60a5fa]">{stat.value}</span>
                  <span className="text-xs text-white/40 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup CSS-only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-72 h-72 rounded-full bg-[#2563eb] opacity-20 blur-[80px]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[380px] h-[380px] rounded-full border border-[#2563eb]/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[460px] h-[460px] rounded-full border border-[#2563eb]/5"
            />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {/* Phone frame */}
              <div className="relative w-56 h-[480px] rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-2 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
                {/* Side buttons */}
                <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-white/10 rounded-l-sm" />
                <div className="absolute -left-[3px] top-36 w-[3px] h-10 bg-white/10 rounded-l-sm" />
                <div className="absolute -left-[3px] top-[190px] w-[3px] h-10 bg-white/10 rounded-l-sm" />
                <div className="absolute -right-[3px] top-32 w-[3px] h-14 bg-white/10 rounded-r-sm" />

                {/* Screen */}
                <div className="absolute inset-[6px] rounded-[38px] overflow-hidden bg-[#0a0a0a]">
                  <div className="flex justify-between items-center px-6 pt-3 pb-2">
                    <span className="text-[10px] text-white/70 font-semibold">9:41</span>
                    <div className="w-3 h-2 border border-white/50 rounded-[2px] relative">
                      <div className="absolute inset-0.5 left-0.5 bg-white/70 rounded-[1px]" />
                    </div>
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className="w-24 h-7 bg-black rounded-full" />
                  </div>
                  <div className="px-4 pt-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00] via-[#0d0d0d] to-[#0a0a0a]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#2563eb] opacity-30 blur-[40px]" />
                    <div className="relative z-10 grid grid-cols-4 gap-3 mt-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-2xl"
                          style={{ background: `hsla(${(i * 30) % 360}, 60%, 40%, 0.6)` }}
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 bg-white/10 backdrop-blur-md rounded-3xl p-3 flex justify-around">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-2xl bg-white/20" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-4 bg-[#2563eb] opacity-20 blur-xl rounded-full" />
            </motion.div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute top-16 right-0 lg:-right-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3"
            >
              <div className="text-xs text-white/50">Precio desde</div>
              <div className="text-lg font-black text-[#60a5fa]">$4,999 MXN</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-24 left-0 lg:-left-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div>
                <div className="text-xs text-white/50">Envío gratis</div>
                <div className="text-sm font-bold text-white">Hoy mismo</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-1.5 bg-[#2563eb] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
