"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Smartphone,
  Headphones,
  Tablet,
  Wrench,
  CreditCard,
  RefreshCw,
  MapPin,
  Zap,
} from "lucide-react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const navLinks = [
  {
    label: "Celulares",
    href: "/celulares",
    icon: Smartphone,
    sub: ["iPhone", "Samsung Galaxy", "Xiaomi", "Motorola", "Ver todo"],
  },
  {
    label: "Accesorios",
    href: "/accesorios",
    icon: Headphones,
    sub: ["Cases", "Cargadores", "Audífonos", "Cables", "Ver todo"],
  },
  { label: "Servicios", href: "/servicios", icon: Wrench, sub: null },
  { label: "Financiamiento", href: "/financiamiento", icon: CreditCard, sub: null },
  { label: "Trade-In", href: "/trade-in", icon: RefreshCw, sub: null },
  { label: "Sucursales", href: "/sucursales", icon: MapPin, sub: null },
];

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#131313]/80 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff8c00] to-[#ffb77d] flex items-center justify-center shadow-[0_0_16px_rgba(255,140,0,0.4)]">
                <Zap className="w-4 h-4 text-black" fill="black" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                iStore<span className="text-[#ff8c00]">Pro</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    {link.label}
                    {link.sub && <ChevronDown className="w-3 h-3 opacity-50" />}
                  </Link>

                  {/* Dropdown */}
                  {link.sub && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-44 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                        >
                          {link.sub.map((item) => (
                            <Link
                              key={item}
                              href={`${link.href}/${item.toLowerCase().replace(/ /g, "-")}`}
                              className="block px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                              {item}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                href="/carrito"
                className="relative p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
                aria-label="Carrito"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ff8c00] text-black text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="hidden sm:block">
                {isSignedIn ? (
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                ) : (
                  <SignInButton mode="modal">
                    <button className="text-sm font-semibold text-white/70 hover:text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                      Ingresar
                    </button>
                  </SignInButton>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
                aria-label="Menú"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar expandable */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar iPhone, Samsung, accesorios..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff8c00]/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-[#131313]/95 backdrop-blur-xl border-t border-white/8"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      <Icon className="w-4 h-4 text-[#ff8c00]" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
                <div className="mt-2 pt-2 border-t border-white/8">
                  {!isSignedIn && (
                    <SignInButton mode="modal">
                      <button className="w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] px-4 py-3 rounded-xl transition-all hover:opacity-90">
                        Iniciar sesión
                      </button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
