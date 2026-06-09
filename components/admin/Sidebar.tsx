"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  Bookmark,
  Warehouse,
  ShoppingCart,
  Users,
  Megaphone,
  Image,
  FileText,
  Layers,
  ArrowLeftRight,
  BarChart3,
  FileBarChart,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  ChevronDown,
} from "lucide-react";

// ─── Navigation config ──────────────────────────────────────────────────────

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavChild[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Catálogo",
    items: [
      {
        label: "Catálogo",
        icon: Package,
        children: [
          { href: "/productos", label: "Productos" },
          { href: "/categorias", label: "Categorías" },
          { href: "/marcas", label: "Marcas" },
        ],
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { href: "/inventario", label: "Inventario", icon: Warehouse, badge: 3 },
      { href: "/pedidos", label: "Pedidos", icon: ShoppingCart, badge: 12 },
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/promociones", label: "Promociones", icon: Megaphone },
    ],
  },
  {
    title: "Contenido",
    items: [
      {
        label: "Contenido",
        icon: Layers,
        children: [
          { href: "/cms", label: "CMS" },
          { href: "/banners", label: "Banners" },
          { href: "/carruseles", label: "Carruseles" },
        ],
      },
      { href: "/importar", label: "Importar/Exportar", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Inteligencia",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/reportes", label: "Reportes", icon: FileBarChart },
      { href: "/comunicaciones", label: "Comunicaciones", icon: MessageSquare },
    ],
  },
  {
    items: [
      { href: "/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  isActive,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isActive: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none
        ${
          isActive
            ? "bg-[#f97316]/10 text-[#f97316]"
            : "text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
        }
        ${collapsed ? "justify-center" : ""}`}
    >
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#f97316] rounded-r"
        />
      )}

      <Icon className="w-4 h-4 flex-shrink-0" />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {badge && !collapsed && (
        <span className="ml-auto text-[10px] font-bold bg-[#f97316]/20 text-[#f97316] px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
      {badge && collapsed && (
        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#f97316] rounded-full" />
      )}

      {collapsed && (
        <div
          className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1f1f1f] text-[#e5e5e5] text-xs rounded-lg
          whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50
          shadow-xl border border-[#2a2a2a]"
        >
          {label}
          {badge ? ` (${badge})` : ""}
        </div>
      )}
    </Link>
  );
}

// ─── NavGroup (collapsible with children) ────────────────────────────────────

function NavGroup({
  item,
  collapsed,
  pathname,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
}) {
  const isChildActive =
    item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
  const [open, setOpen] = useState(isChildActive);
  const Icon = item.icon;

  // Collapsed: show flyout on hover
  if (collapsed) {
    return (
      <div className="relative group">
        <button
          className={`relative flex items-center justify-center w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors
            ${
              isChildActive
                ? "bg-[#f97316]/10 text-[#f97316]"
                : "text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
            }`}
        >
          <Icon className="w-4 h-4" />
          {isChildActive && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#f97316] rounded-full" />
          )}
        </button>
        {/* Flyout */}
        <div
          className="absolute left-full top-0 ml-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-2xl
          opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
          transition-opacity z-50 min-w-[160px] py-2 overflow-hidden"
        >
          <p className="text-[10px] font-semibold text-[#525252] uppercase tracking-wider px-3 pb-1.5 border-b border-[#262626] mb-1">
            {item.label}
          </p>
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-3 py-1.5 text-xs transition-colors
                ${
                  pathname.startsWith(child.href)
                    ? "text-[#f97316] bg-[#f97316]/10"
                    : "text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#262626]"
                }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Expanded: accordion
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors
          ${
            isChildActive
              ? "text-[#f97316]"
              : "text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
          }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pt-0.5 pb-1">
