"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ClipboardList, ShoppingCart, Users, Menu } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

// Tab bar inferior fija — patrón nativo (App Store / Uber / Revolut).
// Una sola fuente de navegación: los accesos rápidos apuntan a las mismas
// rutas que el drawer completo (nav-config). "Más" abre ese drawer.
const tabs = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { label: "Órdenes", href: "/ordenes", icon: ClipboardList },
  { label: "Vender", href: "/ventas", icon: ShoppingCart },
  { label: "Clientes", href: "/clientes", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Navegación principal"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5">
          {tabs.map((t) => {
            const active = isActive(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-active"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <t.icon
                  className={cn(
                    "h-[22px] w-[22px] transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className={cn(active ? "text-primary" : "text-muted-foreground")}>
                  {t.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground active:scale-95"
            aria-label="Más opciones"
          >
            <Menu className="h-[22px] w-[22px]" />
            <span>Más</span>
          </button>
        </div>
      </nav>

      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
