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
  categorias: "Categorías",
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
  configuracion: "Configuración",
  nuevo: "Nuevo",
  editar: "Editar",
};

type BreadcrumbItem = { label: string; href: string }
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
    title: "Importación completada",
    message: "200 SKUs importados exitosamente",
    time: "hace 1 hr",
    read: false,
  },
  {
    id: 4,
    type: "warning",
    title: "12 pedidos atrasados",
    message: "Llevan más de 48h en Procesando",
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

type ClosePanelProps = { onClose: () => void }
function UserMenu(props: ClosePanelProps) {
  const { onClose } = props;
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
        <span className="inline-block mt-1.5 text-[10px] font-bold text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
          SUPER ADMIN
        </span>
      </div>
      <div className="py-1">
        {[
          { label: "Mi perfil", icon: User },
          { label: "Configuración", icon: Settings },
          { label: "Ayuda", icon: HelpCircle },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={onClose}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
      <div className="border-t border-[#1a1a1a] py-1">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
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
            <span className="text-[10px] font-bold bg-[#f97316] text-white px-1.5 py-0.5 rounded-full">
           