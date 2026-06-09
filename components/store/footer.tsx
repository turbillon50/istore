import Link from "next/link";
import {
  Zap,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const footerLinks = {
  Productos: [
    { label: "Smartphones", href: "/celulares" },
    { label: "iPhone", href: "/celulares/iphone" },
    { label: "Samsung Galaxy", href: "/celulares/samsung" },
    { label: "Accesorios", href: "/accesorios" },
    { label: "Audio", href: "/audio" },
    { label: "Tablets", href: "/tablets" },
  ],
  Servicios: [
    { label: "Reparación", href: "/servicios/reparacion" },
    { label: "Financiamiento", href: "/financiamiento" },
    { label: "Trade-In", href: "/trade-in" },
    { label: "Envíos Express", href: "/envios" },
    { label: "Garantía Extendida", href: "/garantia" },
    { label: "Configuración", href: "/servicios/configuracion" },
  ],
  Empresa: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Sucursales", href: "/sucursales" },
    { label: "Blog", href: "/blog" },
    { label: "Trabaja con nosotros", href: "/empleos" },
    { label: "Prensa", href: "/prensa" },
    { label: "Afiliados", href: "/afiliados" },
  ],
  Legal: [
    { label: "Aviso de Privacidad", href: "/privacidad" },
    { label: "Términos de Uso", href: "/terminos" },
    { label: "Política de Devoluciones", href: "/devoluciones" },
    { label: "Garantías", href: "/garantias" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/istorepro", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/istorepro", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/istorepro", label: "Twitter/X" },
  { icon: Youtube, href: "https://youtube.com/istorepro", label: "YouTube" },
];

const paymentMethods = [
  { label: "Visa", abbr: "VISA" },
  { label: "Mastercard", abbr: "MC" },
  { label: "AMEX", abbr: "AMEX" },
  { label: "Mercado Pago", abbr: "MP" },
  { label: "OXXO Pay", abbr: "OXXO" },
  { label: "BBVA", abbr: "BBVA" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/8">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff8c00] to-[#ffb77d] flex items-center justify-center shadow-[0_0_16px_rgba(255,140,0,0.3)]">
                <Zap className="w-5 h-5 text-black" fill="black" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                iStore<span className="text-[#ff8c00]">Pro</span>
              </span>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              La tienda de tecnología más completa de México. Smartphones, accesorios, reparaciones y financiamiento sin buró.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              <a
                href="tel:+525512345678"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-[#ffb77d] transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#ff8c00]/60 group-hover:text-[#ff8c00]" />
                +52 55 1234 5678
              </a>
              <a
                href="mailto:hola@i-store.shop"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-[#ffb77d] transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#ff8c00]/60 group-hover:text-[#ff8c00]" />
                hola@i-store.shop
              </a>
              <div className="flex items-start gap-3 text-sm text-white/40">
                <Clock className="w-4 h-4 text-[#ff8c00]/60 mt-0.5 shrink-0" />
                <span>Lun-Vie 9am–8pm · Sáb 10am–6pm</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-[#ff8c00]/60 mt-0.5 shrink-0" />
                <span>Ciudad de México · Guadalajara · Monterrey</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((sl) => {
                const SlIcon = sl.icon;
                return (
                <a
                  key={sl.label}
                  href={sl.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={sl.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-[#ffb77d] hover:bg-[#ff8c00]/10 hover:border-[#ff8c00]/30 transition-all"
                >
                  <SlIcon className="w-4 h-4" />
                </a>
                );
              })}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">
                {category}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/35 hover:text-[#ffb77d] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 text-center sm:text-left">
            © {new Date().getFullYear()} iStore Pro — All Global Holding LLC. Todos los derechos reservados.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-white/25 mr-1">Pagos seguros:</span>
            {paymentMethods.map(({ label, abbr }) => (
              <div
                key={label}
                title={label}
                className="h-6 px-2.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white/40 flex items-center"
              >
                {abbr}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
