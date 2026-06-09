"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Settings,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

// --- Breadcrumbs --------------------------------------------------------------

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  productos: "Productos",
  categorias: "Categorias",
  marcas: "Marcas",
  inventario: "Inventario",
  pedidos: "Pedidos",
  clientes: "Clientes",
  promociones: "Promociones",
  banners: "Banners",
  carruseles: "Carruseles",
  cms: "CMS",
  importar: "Importar/Exportar",
  analytics: "Analytics",
  reportes: "Reportes",
  comunicaciones: "Comunicaciones",
  configuracion: "Configuracion",
  nuevo: "Nuevo",
  editar: "Editar",
};

interface BreadcrumbItem { label: string; href: string }
function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  let accumulated = "";
  return segments.map((seg) => {
    accumulated += `/${seg}`;
    return {
      label: LABEL_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: accumulated,
    };
  });
}

// --- Notification mock data ---------------------------------------------------

const NOTIFICATIONS = [
  {
    id: 1,
    type: "warning",
    title: "Stock bajo",
    message: "MacBook Pro M3 - solo 7 unidades",
    time: "hace 5 min",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Pedido nuevo",
    message: "#ORD-2891 de Carlos Mendoza",
    time: "hace 12 min",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Importacion completada",
    message: "200 SKUs importados exitosamente",
    time: "hace 1 hr",
    read: false,
  },
  {
    id: 4,
    type: "warning",
    title: "12 pedidos atrasados",
    message: "Llevan mas de 48h en Procesando",
    time: "hace 2 hr",
    read: true,
  },
];

const notifDotColor: Record<string, string> = {
  warning: "bg-yellow-400",
  info: "bg-blue-400",
  success: "bg-emerald-400",
  danger: "bg-red-400",
};

// --- UserMenu -----------------------------------------------------------------

interface ClosePanelProps { onClose: () => void }

function UserMenu(props: ClosePanelProps) {
  const { onClose } = props;
  const menuItems = [
    { label: "Mi perfil", icon: User },
    { label: "Configuracion", icon: Settings },
    { label: "Ayuda", icon: HelpCircle },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-full mt-2 w-52 bg-[#111] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="px-3 py-3 border-b border-[#1a1a1a]">
        <p className="text-xs font-semibold text-[#e5e5e5]">Admin User</p>
        <p className="text-[11px] text-[#525252] mt-0.5">admin@istore.mx</p>
        <span className="inline-block mt-1.5 text-[10px] font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded">
          SUPER ADMIN
        </span>
      </div>
      <div className="py-1">
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <button
              key={item.label}
              onClick={onClose}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
            >
              <ItemIcon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="border-t border-[#1a1a1a] py-1">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesion
        </button>
      </div>
    </motion.div>
  );
}

// --- NotifPanel ---------------------------------------------------------------

function NotifPanel(props: ClosePanelProps) {
  const { onClose } = props;
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-full mt-2 w-80 bg-[#111] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#e5e5e5]">Notificaciones</span>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-[#3b82f6] text-white px-1.5 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[10px] text-[#3b82f6] hover:underline"
        >
          Marcar todo leido
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`flex gap-3 px-4 py-3 border-b border-[#1a1a1a] last:border-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors ${n.read ? "opacity-50" : ""}`}
          >
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${notifDotColor[n.type] ?? "bg-[#525252]"}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#e5e5e5]">{n.title}</p>
              <p className="text-[11px] text-[#737373] mt-0.5 truncate">{n.message}</p>
              <p className="text-[10px] text-[#404040] mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-[#1a1a1a]">
        <button
          onClick={onClose}
          className="text-xs text-[#3b82f6] hover:underline"
        >
          Ver todas las notificaciones
        </button>
      </div>
    </motion.div>
  );
}

// --- Layout -------------------------------------------------------------------

export default function AdminLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname() ?? "";
  const breadcrumbs = getBreadcrumbs(pathname);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const closeAll = () => {
    setShowNotifs(false);
    setShowUserMenu(false);
  };

  return (
    <div
      className="flex h-screen bg-[#0a0a0a] overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {(showNotifs || showUserMenu) && (
        <div className="fixed inset-0 z-30" onClick={closeAll} />
      )}

      <div className="hidden md:flex h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
            >
              <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center gap-3 px-4 border-b border-[#1a1a1a] bg-[#0a0a0a] flex-shrink-0 relative z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <nav className="flex items-center gap-1 text-sm min-w-0 flex-1" aria-label="breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                {i > 0 && (
                  <ChevronRight className="w-3 h-3 text-[#333] flex-shrink-0" />
                )}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-[#e5e5e5] font-medium text-sm truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[#404040] hover:text-[#737373] transition-colors text-sm truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#404040] hover:border-[#2a2a2a] hover:text-[#737373] transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span>Buscar...</span>
              <kbd className="ml-3 text-[10px] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#2a2a2a] font-mono">
                K
              </kbd>
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs((v) => !v);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] rounded-lg transition-colors"
                aria-label="Notificaciones"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#3b82f6] rounded-full" />
                )}
              </button>
              <AnimatePresence>
                {showNotifs && <NotifPanel onClose={() => setShowNotifs(false)} />}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu((v) => !v);
                  setShowNotifs(false);
                }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                aria-label="Menu de usuario"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#c2410c] flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
              </button>
              <AnimatePresence>
                {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0a0a]">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="p-6 min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
