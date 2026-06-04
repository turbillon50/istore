import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  Stethoscope,
  Package,
  Users,
  ShoppingCart,
  Wallet,
  Bell,
  BarChart3,
  Building2,
  Sparkles,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "iStore AI", href: "/asistente", icon: Sparkles, badge: "AI" },
    ],
  },
  {
    title: "Operación",
    items: [
      { label: "Recepciones", href: "/recepciones", icon: Inbox },
      { label: "Órdenes", href: "/ordenes", icon: ClipboardList, badge: "41" },
      { label: "Diagnósticos", href: "/diagnosticos", icon: Stethoscope },
      { label: "Inventario", href: "/inventario", icon: Package },
    ],
  },
  {
    title: "Comercial",
    items: [
      { label: "Clientes", href: "/clientes", icon: Users },
      { label: "Ventas (POS)", href: "/ventas", icon: ShoppingCart },
      { label: "Caja", href: "/caja", icon: Wallet },
      { label: "Notificaciones", href: "/notificaciones", icon: Bell, badge: "3" },
    ],
  },
  {
    title: "Administración",
    items: [
      { label: "Reportes", href: "/reportes", icon: ClipboardList },
      { label: "Sucursales", href: "/sucursales", icon: Building2 },
      { label: "Usuarios", href: "/usuarios", icon: ShieldCheck },
      { label: "Configuración", href: "/configuracion", icon: Settings },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
