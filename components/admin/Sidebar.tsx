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

// --- Navigation config ------------------------------------------------------

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

// --- NavLink -----------------------------------------------------------------

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isActive: boolean;
  collapsed: boolean;
}

function NavLink(props: NavLinkProps) {
  const { href, label, icon: Icon, badge, isActive, collapsed } = props;
  return (
    <Link
      href={href}
      className={`relative group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none
        ${
          isActive
            ? "bg-[#3b82f6]/10 text-[#3b82f6]"
            : "text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
        }
        ${collapsed ? "justify-center" : ""}`}
    >
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#3b82f6] rounded-r"
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
        <span className="ml-auto text-[10px] font-bold bg-[#3b82f6]/20 text-[#3b82f6] px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
      {badge && collapsed && (
        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#3b82f6] rounded-full" />
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

// --- NavGroup (collapsible with children) ------------------------------------

interface NavGroupProps {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
}

function NavGroup(props: NavGroupProps) {
  const { item, collapsed, pathname } = props;
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
                ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                : "text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
            }`}
        >
          <Icon className="w-4 h-4" />
          {isChildActive && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#3b82f6] rounded-full" />
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
                    ? "text-[#3b82f6] bg-[#3b82f6]/10"
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
              ? "text-[#3b82f6]"
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
              <div className="border-l border-[#262626] pl-3 space-y-0.5">
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block px-2 py-1.5 text-xs rounded-md transition-colors
                      ${
                        pathname.startsWith(child.href)
                          ? "text-[#3b82f6] bg-[#3b82f6]/10"
                          : "text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                      }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sidebar ------------------------------------------------------------------

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar(props: SidebarProps) {
  const { collapsed = false, onToggle } = props;
  const pathname = usePathname() ?? "";

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="flex flex-col h-full bg-[#111111] border-r border-[#1a1a1a] overflow-hidden flex-shrink-0"
    >
      {/* Logo bar */}
      <div
        className={`flex items-center h-14 flex-shrink-0 border-b border-[#1a1a1a] px-3
          ${collapsed ? "justify-center" : "gap-3"}`}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#c2410c] flex items-center justify-center flex-shrink-0 shadow-lg">
          <Store className="w-4 h-4 text-white" />
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="min-w-0 flex-1"
            >
              <p className="text-sm font-bold text-[#e5e5e5] tracking-tight leading-none">
                iStore
              </p>
              <p className="text-[10px] text-[#3b82f6] font-bold tracking-[0.2em] uppercase leading-none mt-0.5">
                Pro
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="p-1.5 rounded-md text-[#404040] hover:text-[#a3a3a3] hover:bg-[#1a1a1a] transition-colors"
              title="Colapsar sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expand button (collapsed state) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2.5 text-[#404040] hover:text-[#a3a3a3] hover:bg-[#1a1a1a] transition-colors border-b border-[#1a1a1a]"
          title="Expandir sidebar"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#262626]">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.title && !collapsed && (
              <p className="text-[10px] font-semibold text-[#3a3a3a] uppercase tracking-[0.12em] px-3 mb-1.5">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="flex justify-center mb-1.5">
                <div className="w-5 h-px bg-[#262626]" />
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, ii) => {
                if (item.children) {
                  return (
                    <NavGroup
                      key={`${si}-${ii}`}
                      item={item}
                      collapsed={collapsed}
                      pathname={pathname}
                    />
                  );
                }
                const href = item.href!;
                const isActive =
                  href === "/dashboard"
                    ? pathname === href || pathname === "/"
                    : pathname.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    isActive={isActive}
                    collapsed={collapsed}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-[#1a1a1a] p-2 flex-shrink-0">
        <div
          className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer
            ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#c2410c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            A
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[#e5e5e5] text-xs font-medium truncate leading-none mb-1">
                  Admin User
                </p>
                <span className="text-[10px] font-semibold text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded">
                  SUPER ADMIN
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-1 rounded text-[#525252] hover:text-red-400 transition-colors flex-shrink-0"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
