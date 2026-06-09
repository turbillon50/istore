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

function KpiCard(props: KpiProps) {
  const { title, value, trend, trendLabel, icon: Icon, accentColor, sparkline, delay = 0 } = props;
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

function SalesTooltip(props: any) {
  const { active, payload, label } = props;
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
            <span className="text-[10px] font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded-full">
              {alerts.filter((a) => a.type !== "info").length} activas
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {alerts.map((alert, i) => {
              const s = ALERT_STYLE[alert.type as keyof typeof ALERT_STYLE];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className={`flex gap-2.5 p-2.5 rounded-lg border text-xs ${s.bg} ${s.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`${s.text} leading-relaxed`}>{alert.message}</p>
                    <p className="text-[#3a3a3a] mt-0.5">{alert.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="px-4 py-4 border-t border-[#1a1a1a]">
            <p className="text-[10px] font-semibold text-[#3a3a3a] uppercase tracking-wider mb-3">
              Acciones rápidas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Nuevo producto", icon: Plus, href: "/productos/nuevo" },
                { label: "Ver inventario", icon: Package, href: "/inventario" },
                { label: "Importar CSV", icon: Upload, href: "/importar" },
                { label: "Ver reportes", icon: FileText, href: "/reportes" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-2 px-3 py-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg text-xs text-[#737373] hover:text-[#e5e5e5] hover:border-[#262626] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#f97316]" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.25 }}
          className="xl:col-span-3 bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-[#e5e5e5]">Pedidos recientes</h2>
            <Link
              href="/pedidos"
              className="flex items-center gap-1 text-xs text-[#f97316] hover:underline"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#141414]">
                  {["Pedido", "Cliente", "Total", "Estado", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-[10px] text-[#3a3a3a] font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111]">
                {recentOrders.map((order, i) => {
                  const cfg =
                    STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                  const Icon = cfg?.icon ?? Clock;
                  return (
                    <tr key={i} className="hover:bg-[#0f0f0f] transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-mono text-[#525252] text-[11px]">
                        {order.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[9px] font-bold text-[#737373] flex-shrink-0">
                            {order.avatar}
                          </div>
                          <div>
                            <p className="text-[#e5e5e5] font-medium">{order.customer}</p>
                            <p className="text-[#404040] text-[10px]">{order.product}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#e5e5e5] font-semibold tabular-nums">
                        {order.total}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border
                            ${cfg?.color} ${cfg?.bg} ${cfg?.border}`}
                        >
                          <Icon className="w-2.5 h-2.5" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#333] text-[10px] whitespace-nowrap">
                        {order.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top products */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.25 }}
          className="xl:col-span-2 bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-[#e5e5e5]">Top productos</h2>
            <span className="text-xs text-[#404040]">últimos 30 días</span>
          </div>
          <div className="p-3 space-y-1">
            {topProducts.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#0f0f0f] transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-[#333] w-4 flex-shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#e5e5e5] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#404040] font-mono">{p.sku}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-[#f97316]">{p.revenue}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="text-[10px] text-[#404040]">{p.sales} uds</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        p.change >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {p.change >= 0 ? "+" : ""}
                      {p.change}%
                    </span>
                  </div>
                </div>
                {p.stock < 10 && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                    ¡{p.stock}!
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
