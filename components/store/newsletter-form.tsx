"use client";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="tu@email.com"
        className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#2563eb]/40 focus:bg-white/8 transition-all"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-black font-bold px-7 py-3.5 rounded-full hover:shadow-[0_0_24px_rgba(37, 99, 235,0.35)] hover:scale-105 transition-all whitespace-nowrap text-sm"
      >
        Suscribirme gratis
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
