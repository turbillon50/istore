"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  Upload,
  Zap,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";

// --- Seeded deterministic data ------------------------------------------------

function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor(min + (x - Math.floor(x)) * (max - min));
}

const salesData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  label: i % 5 === 0 ? `${i + 1}` : "",
  ventas: seeded(i + 1, 6000, 22000),
  pedidos: seeded(i + 100, 8, 45),
}));

const weeklyData = Array.from({ length: 7 }, (_, i) => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  return {
    day: days[i],
    ventas: seeded(i + 200, 4000, 18000),
    meta: 12000,
  };
});

const recentOrders = [
  { id: "#ORD-2891", customer: "Carlos Mendoza", product: "iPhone 15 Pro", total: "$24,999", status: "Pendiente", time: "hace 5 min", avatar: "CM" },
  { id: "#ORD-2890", customer: "Ana García", product: "MacBook Air M2", total: "$31,499", status: "Procesando", time: "hace 18 min", avatar: "AG" },
  { id: "#ORD-2889", customer: "Luis Torres", product: "AirPods Pro 2", total: "$5,899", status: "Enviado", time: "hace 42 min", avatar: "LT" },
  { id: "#ORD-2888", customer: "María López", product: "iPad Pro 12.9", total: "$18,999", status: "Entregado", time: "hace 1 hr", avatar: "ML" },
  { id: "#ORD-2887", customer: "Roberto Silva", product: "Samsung S24+", total: "$19,499", status: "Cancelado", time: "hace 2 hr", avatar: "RS" },
  { id: "#ORD-2886", customer: "Patricia Cruz", product: "Apple Watch Ultra 2", total: "$12,999", status: "Procesando", time: "hace 3 hr", avatar: "PC" },
  { id: "#ORD-2885", customer: "Diego Ramírez", product: "iPhone 15", total: "$19,999", status: "Enviado", time: "hace 4 hr", avatar: "DR" },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", sku: "APL-IP15PM-256", sales: 142, revenue: "$4.2M", stock: 18, change: +12 },
  { name: 'MacBook Pro M3 14"', sku: "APL-MBP14-M3", sales: 89, revenue: "$3.8M", stock: 7, change: +5 },
  { name: "Samsung Galaxy S24 Ultra", sku: "SAM-S24U-512", sales: 115, revenue: "$2.9M", stock: 32, change: -3 },
  { name: "AirPods Pro 2nd Gen", sku: "APL-APP2-USB", sales: 234, revenue: "$1.4M", stock: 61, change: +22 },
  { name: 'iPad Pro 12.9" M2', sku: "APL-IPP129-256", sales: 67, revenue: "$1.3M", stock: 14, change: +7 },
];

const alerts = [
  { type: "danger", message: 'MacBook Pro M3 14"  -  Solo 7 unidades en stock', time: "ahora" },
  { type: "warning", message: "12 pedidos llevan más de 48h en 'Procesando'", time: "hace 1 hr" },
  { type: "warning", message: "Promo 'Verano 2026' vence mañana", time: "hace 2 hr" },
  { type: "info", message: "Importación de 200 SKUs completada exitosamente", time: "hace 3 hr" },
  { type: "danger", message: "AirPods Pro 2  -  Agotado en línea", time: "hace 5 hr" },
];

// --- Status config ------------------------------------------------------------

const STATUS_CONFIG = {
  Pendiente: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    icon: Clock,
  },
  Procesando: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    icon: Package,
  },
  Enviado: {
    color: "text-[#f97316]",
    bg: "bg-[#f97316]/10",
    border: "border-[#f97316]/20",
    icon: Truck,
  },
  Entregado: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: CheckCircle2,
  },
  Cancelado: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    icon: XCircle,
  },
} as const;

const ALERT_STYLE = {
  danger: { text: "text-red-400", bg: "bg-red-400/8", border: "border-red-400/20", dot: "bg-red-400" },
  warning: { text: "text-yellow-400", bg: "bg-yellow-400/8", border: "border-yellow-400/20", dot: "bg-yellow-400" },
  info: { text: "text-blue-400", bg: "bg-blue-400/8", border: "border-blue-400/20", dot: "bg-blue-400" },
};

// --- KPI Card -----------------------------------------------------------------

interface KpiProps {
  title: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  icon: React.ElementType;
  accentColor: string;
  sparkline: number[];
  delay?: number;
}

function KpiCard({ title, value, trend, trendLabel, icon: Icon, accentColor, sparkline, delay = 0 }: KpiProps) {
  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const sparkData = sparkline.map((v) => ({ v }));
  const max = Math.max(...sparkline);
  const min = Math.min(...sparkline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25, ease: "easeOut" }}
      className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#262626] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#525252] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[#e5e5e5] mt-1 tabular-nums tracking-tight">
            {value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: accentColor }} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{isPositive ? "+" : ""}{trend}%</span>
          <span className="text-[#404040] font-normal">{trendLabel}</span>
        </div>

        {/* Sparkline */}
        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.5}
                fill={`url(#spark-${title})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// --- Custom chart tooltip -----------------------------------------------------

function SalesTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-3 shadow-2xl">
      <p className="text-[#737373] text-xs mb-2 font-medium">Día {label}</p>
      <div className="space-y-1">
        <p className="text-[#f97316] text-sm font-bold">
          ${payload[0]?.value?.toLocaleString()}
          <span className="text-xs font-normal text-[#737373] ml-1">ventas</span>
        </p>
        {payload[1] && (
          <p className="text-[#a3a3a3] text-xs">
            {payload[1].value} pedidos
          </p>
        )}
      </div>
    </div>
  );
}

// --- Page ---------------------------------------------------------------------

export default function DashboardPage() {
  const [chartMode, setChartMode] = useState<string>("30d");
  const chartData = chartMode === "30d" ? salesData : weeklyData;

  const totalRevenue30d = salesData.reduce((s, d) => s + d.ventas, 0);
  const avgDaily = Math.round(totalRevenue30d / 30);
  const todayVentas = salesData[salesData.length - 1]?.ventas ?? 0;

  const kpis: KpiProps[] = useMemo(
    () => [
      {
        title: "Ventas hoy",
        value: `$${(todayVentas / 1000).toFixed(1)}k`,
        trend: 8.2,
        trendLabel: "vs ayer",
        icon: DollarSign,
        accentColor: "#f97316",
        sparkline: salesData.slice(-7).map((d) => d.ventas),
      },
      {
        title: "Pedidos pendientes",
        value: 12,
        trend: -3,
        trendLabel: "vs ayer",
        icon: ShoppingCart,
        accentColor: "#facc15",
        sparkline: [15, 18, 12, 20, 14, 16, 12],
      },
      {
        title: "Clientes nuevos",
        value: 34,
        trend: 12.5,
        trendLabel: "esta semana",
        icon: Users,
        accentColor: "#34d399",
        sparkline: [18, 22, 25, 28, 30, 32, 34],
      },
      {
        title: "Inventario bajo",
        value: 7,
        trend: 40,
        trendLabel: "más que ayer",
        icon: AlertTriangle,
        accentColor: "#f87171",
        sparkline: [2, 3, 3, 4, 5, 5, 7],
      },
    ],
    [todayVentas]
  );

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#e5e5e5] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#404040] mt-0.5">
            Lunes, 9 de junio 2026 · Resumen ejecutivo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#737373] hover:border-[#262626] hover:text-[#e5e5e5] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#737373] hover:border-[#262626] hover:text-[#e5e5e5] transition-colors">
            <FileText className="w-3.5 h-3.5" />
            Reporte
          </button>
          <Link
            href="/pedidos/nuevo"
            className="flex items-center gap-2 px-3 py-2 bg-[#f97316] rounded-lg text-xs text-white font-semibold hover:bg-[#ea6c0a] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo pedido
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.title} {...kpi} delay={i * 0.05} />
        ))}
      </div>

      {/* Chart + Alerts grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="xl:col-span-2 bg-[#111] border border-[#1a1a1a] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#e5e5e5]">Ventas</h2>
              <p className="text-xs text-[#404040] mt-0.5">
                Total 30d: ${totalRevenue30d.toLocaleString()} ·{" "}
                Promedio diario: ${avgDaily.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(["30d", "7d"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium
                    ${chartMode === mode
                      ? "bg-[#f97316] text-white"
                      : "text-[#525252] hover:text-[#a3a3a3] hover:bg-[#1a1a1a]"}`}
                >
                  {mode === "30d" ? "30 días" : "7 días"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chartData} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#161616" vertical={false} />
              <XAxis
                dataKey={chartMode === "30d" ? "label" : "day"}
                tick={{ fill: "#3d3d3d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#3d3d3d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={44}
              />
              <Tooltip content={<SalesTooltip />} />
              {chartMode === "7d" && (
                <ReferenceLine
                  y={12000}
                  stroke="#f97316"
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                  label={{ value: "Meta", fill: "#f97316", fontSize: 10 }}
                />
              )}
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#gradVentas)"
                dot={false}
                activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alerts + Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="bg-[#111] border border-[#1a1a1a] rounded-xl flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-[#e5e5e5]">Alertas</h2>
            <span className="text-[10px] fon