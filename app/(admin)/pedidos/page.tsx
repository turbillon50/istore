"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Search,
  X,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Eye,
  RefreshCw,
  FileText,
  Download,
  Calendar,
  MapPin,
  CreditCard,
  User,
  ArrowRight,
  Zap,
} from "lucide-react";
import DataTable from "@/components/admin/DataTable";

// --- Types --------------------------------------------------------------------

type OrderStatus =
  | "Pendiente"
  | "Confirmado"
  | "En Proceso"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

type PaymentStatus = "Pagado" | "Pendiente" | "Fallido" | "Reembolsado";

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  avatar: string;
  date: string;
  dateRaw: Date;
  items: number;
  total: number;
  payment: PaymentStatus;
  status: OrderStatus;
  address: string;
  products: string[];
}

// --- Mock data ----------------------------------------------------------------

function randomDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(Math.random() * 23), Math.floor(Math.random() * 59));
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

const ORDERS_RAW: Omit<Order, "date">[] = [
  { id: "#ORD-2891", customer: "Carlos Mendoza",   customerEmail: "carlos@email.com",   avatar: "CM", dateRaw: randomDate(0),  items: 1, total: 24999, payment: "Pagado",      status: "Pendiente",  address: "Av. Insurgentes 1234, CDMX",  products: ["iPhone 15 Pro 128GB"] },
  { id: "#ORD-2890", customer: "Ana García",        customerEmail: "ana@email.com",       avatar: "AG", dateRaw: randomDate(0),  items: 2, total: 37498, payment: "Pagado",      status: "En Proceso", address: "Calle Reforma 567, Guadalajara", products: ["MacBook Air M2", "Magic Mouse"] },
  { id: "#ORD-2889", customer: "Luis Torres",       customerEmail: "luis@email.com",      avatar: "LT", dateRaw: randomDate(0),  items: 1, total: 5899,  payment: "Pagado",      status: "Enviado",    address: "Blvd. Kukulcán, Cancún",      products: ["AirPods Pro 2 USB-C"] },
  { id: "#ORD-2888", customer: "María López",       customerEmail: "maria@email.com",     avatar: "ML", dateRaw: randomDate(1),  items: 1, total: 18999, payment: "Pagado",      status: "Entregado",  address: "Av. Chapultepec 890, CDMX",   products: ["iPad Pro 12.9\" M2"] },
  { id: "#ORD-2887", customer: "Roberto Silva",     customerEmail: "roberto@email.com",   avatar: "RS", dateRaw: randomDate(1),  items: 3, total: 34997, payment: "Reembolsado", status: "Cancelado",  address: "Cerrada Tulipanes 23, Monterrey", products: ["Samsung S24+", "Case", "Cargador"] },
  { id: "#ORD-2886", customer: "Patricia Cruz",     customerEmail: "patricia@email.com",  avatar: "PC", dateRaw: randomDate(1),  items: 1, total: 12999, payment: "Pagado",      status: "En Proceso", address: "Calle 5 de Mayo 44, Puebla",  products: ["Apple Watch Ultra 2"] },
  { id: "#ORD-2885", customer: "Diego Ramírez",     customerEmail: "diego@email.com",     avatar: "DR", dateRaw: randomDate(2),  items: 1, total: 19999, payment: "Pagado",      status: "Enviado",    address: "Av. Tecnológico 234, MTY",    products: ["iPhone 15"] },
  { id: "#ORD-2884", customer: "Fernanda Ortiz",    customerEmail: "fernanda@email.com",  avatar: "FO", dateRaw: randomDate(2),  items: 2, total: 8198,  payment: "Pagado",      status: "Entregado",  address: "Privada Robles 78, Tijuana",  products: ["AirPods 3", "USB-C Cable"] },
  { id: "#ORD-2883", customer: "Miguel Herrera",    customerEmail: "miguel@email.com",    avatar: "MH", dateRaw: randomDate(3),  items: 1, total: 6499,  payment: "Pendiente",   status: "Pendiente",  address: "Blvd. Díaz Ordaz 901, GDL",  products: ["AirPods Pro 2"] },
  { id: "#ORD-2882", customer: "Sofía Vega",        customerEmail: "sofia@email.com",     avatar: "SV", dateRaw: randomDate(3),  items: 1, total: 38999, payment: "Pagado",      status: "Confirmado", address: "Av. Américas 456, GDL",       products: ["MacBook Pro 14\" M3"] },
  { id: "#ORD-2881", customer: "Eduardo Morales",   customerEmail: "eduardo@email.com",   avatar: "EM", dateRaw: randomDate(4),  items: 4, total: 11596, payment: "Pagado",      status: "Entregado",  address: "Prol. Paseo de la Reforma",   products: ["Accesorios x4"] },
  { id: "#ORD-2880", customer: "Valentina Ríos",    customerEmail: "valentina@email.com", avatar: "VR", dateRaw: randomDate(5),  items: 1, total: 7999,  payment: "Pagado",      status: "Entregado",  address: "Calle Arteaga 12, SLP",       products: ["Sony WH-1000XM5"] },
  { id: "#ORD-2879", customer: "Javier Castillo",   customerEmail: "javier@email.com",    avatar: "JC", dateRaw: randomDate(5),  items: 2, total: 45498, payment: "Fallido",     status: "Cancelado",  address: "Av. López Mateos Sur",        products: ["Dell XPS 15", "Mouse"] },
  { id: "#ORD-2878", customer: "Isabella Flores",   customerEmail: "isabella@email.com",  avatar: "IF", dateRaw: randomDate(6),  items: 1, total: 22499, payment: "Pagado",      status: "Entregado",  address: "Calzada de Tlalpan 3456",     products: ["iPad Pro 12.9\""] },
  { id: "#ORD-2877", customer: "Alejandro Núñez",   customerEmail: "alejandro@email.com", avatar: "AN", dateRaw: randomDate(7),  items: 1, total: 34999, payment: "Pagado",      status: "Entregado",  address: "Paseo Montejo 234, Mérida",   products: ["Samsung Neo QLED 55\""] },
  { id: "#ORD-2876", customer: "Camila Santos",     customerEmail: "camila@email.com",    avatar: "CS", dateRaw: randomDate(8),  items: 3, total: 54997, payment: "Pagado",      status: "Entregado",  address: "Blvd. Agua Caliente, Tijuana", products: ["iPhone 15 Pro x3"] },
  { id: "#ORD-2875", customer: "Sebastián Rojas",   customerEmail: "sebastian@email.com", avatar: "SR", dateRaw: randomDate(10), items: 1, total: 18999, payment: "Pagado",      status: "Entregado",  address: "Av. Constitución 567, MTY",   products: ["Apple Watch Ultra 2"] },
  { id: "#ORD-2874", customer: "Natalia Jiménez",   customerEmail: "natalia@email.com",   avatar: "NJ", dateRaw: randomDate(12), items: 2, total: 29498, payment: "Pagado",      status: "Entregado",  address: "Calle Zaragoza 89, Oaxaca",   products: ["MacBook Air M3", "Case"] },
];

const ORDERS: Order[] = ORDERS_RAW.map((o) => ({
  ...o,
  date: fmtDate(o.dateRaw),
}));

// --- Config -------------------------------------------------------------------

const STATUS_TABS: { label: string; value: OrderStatus | "Todos" }[] = [
  { label: "Todos",        value: "Todos" },
  { label: "Pendientes",   value: "Pendiente" },
  { label: "Confirmados",  value: "Confirmado" },
  { label: "En Proceso",   value: "En Proceso" },
  { label: "Enviados",     value: "Enviado" },
  { label: "Entregados",   value: "Entregado" },
  { label: "Cancelados",   value: "Cancelado" },
];

const ORDER_STATUS_CFG: Record<OrderStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Pendiente:  { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: Clock },
  Confirmado: { color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20",   icon: CheckCircle2 },
  "En Proceso": { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", icon: Package },
  Enviado:    { color: "text-[#f97316]",  bg: "bg-[#f97316]/10",  border: "border-[#f97316]/20",  icon: Truck },
  Entregado:  { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: CheckCircle2 },
  Cancelado:  { color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20",    icon: XCircle },
};

const PAYMENT_CFG: Record<PaymentStatus, { color: string; bg: string }> = {
  Pagado:      { color: "text-emerald-400", bg: "bg-emerald-400/10" },
  Pendiente:   { color: "text-yellow-400",  bg: "bg-yellow-400/10" },
  Fallido:     { color: "text-red-400",     bg: "bg-red-400/10" },
  Reembolsado: { color: "text-purple-400",  bg: "bg-purple-400/10" },
};

const STATUS_FLOW: OrderStatus[] = [
  "Pendiente", "Confirmado", "En Proceso", "Enviado", "Entregado",
];

// --- Status badge -------------------------------------------------------------

function OrderStatusBadge(props: { status: OrderStatus }) {
  const { status } = props;
  const cfg = ORDER_STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border
        ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {status}
    </span>
  );
}

function PaymentBadge(props: { status: PaymentStatus }) {
  const { status } = props;
  const cfg = PAYMENT_CFG[status];
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
      {status}
    </span>
  );
}

// --- Order detail drawer ------------------------------------------------------

interface OrderDrawerProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

function OrderDrawer(props: OrderDrawerProps) {
  const { order, onClose, onStatusChange } = props;
  const cfg = ORDER_STATUS_CFG[order.status];
  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const canAdvance =
    currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1;
  const nextStatus = canAdvance ? STATUS_FLOW[currentIdx + 1] : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0f0f0f] border-l border-[#1f1f1f] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#e5e5e5] font-mono">{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-[#404040] mt-0.5">{order.date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#404040] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status flow */}
          {order.status !== "Cancelado" && (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">
                Flujo del pedido
              </p>
              <div className="flex items-center gap-1">
                {STATUS_FLOW.map((s, i) => {
                  const idx = STATUS_FLOW.indexOf(order.status);
                  const done = i <= idx;
                  const sCfg = ORDER_STATUS_CFG[s];
                  return (
                    <div key={s} className="flex items-center gap-1 flex-1 min-w-0">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors
                            ${done ? `${sCfg.bg} ${sCfg.border} ${sCfg.color}` : "bg-[#1a1a1a] border-[#262626] text-[#333]"}`}
                        >
                          <sCfg.icon className="w-3 h-3" />
                        </div>
                        <span className={`text-[9px] text-center leading-tight ${done ? sCfg.color : "text-[#333]"}`}>
                          {s}
                        </span>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={`flex-1 h-px mb-4 ${i < idx ? "bg-[#f97316]/40" : "bg-[#1f1f1f]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
              Cliente
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1f1f1f] flex items-center justify-center text-xs font-bold text-[#737373]">
                {order.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-[#e5e5e5]">{order.customer}</p>
                <p className="text-xs text-[#404040]">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#737373]">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#404040]" />
              {order.address}
            </div>
          </div>

          {/* Products */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">
              Productos ({order.items})
            </p>
            <div className="space-y-2">
              {order.products.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#1f1f1f] border border-[#262626] flex items-center justify-center">
                      <Package className="w-3.5 h-3.5 text-[#404040]" />
                    </div>
                    <span className="text-xs text-[#a3a3a3]">{p}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
              <span className="text-xs text-[#737373]">Total</span>
              <span className="text-sm font-bold text-[#e5e5e5] tabular-nums">
                ${order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#737373]">
              <CreditCard className="w-3.5 h-3.5" />
              Método de pago
            </div>
            <PaymentBadge status={order.payment} />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#1a1a1a] space-y-3">
          {canAdvance && nextStatus && (
            <button
              onClick={() => { onStatusChange(order.id, nextStatus); onClose(); }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors
                ${ORDER_STATUS_CFG[nextStatus].bg} ${ORDER_STATUS_CFG[nextStatus].color} border ${ORDER_STATUS_CFG[nextStatus].border}
                hover:opacity-90`}
            >
              <Zap className="w-4 h-4" />
              Mover a: {nextStatus}
            </button>
          )}
          {order.status !== "Cancelado" && order.status !== "Entregado" && (
            <button
              onClick={() => { onStatusChange(order.id, "Cancelado"); onClose(); }}
              className="w-full py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              Cancelar pedido
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-xs text-[#737373] hover:text-[#e5e5e5] border border-[#1f1f1f] rounded-lg hover:border-[#262626] transition-colors"
            >
              Cerrar
            </button>
            <button className="flex-1 py-2 text-xs text-[#737373] hover:text-[#e5e5e5] border border-[#1f1f1f] rounded-lg hover:border-[#262626] transition-colors flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Factura
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// --- Page ---------------------------------------------------------------------

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [activeTab, setActiveTab] = useState<OrderStatus | "Todos">("Todos");
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "Todos">("Todos");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchTab = activeTab === "Todos" || o.status === activeTab;
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.products.some((p) => p.toLowerCase().includes(q));
      const matchPayment = paymentFilter === "Todos" || o.payment === paymentFilter;
      const matchFrom = !dateFrom || o.dateRaw >= new Date(dateFrom);
      const matchTo = !dateTo || o.dateRaw <= new Date(dateTo + "T23:59:59");
      return matchTab && matchSearch && matchPayment && matchFrom && matchTo;
    });
  }, [orders, activeTab, search, paymentFilter, dateFrom, dateTo]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    });
    return counts;
  }, [orders]);

  const columns = useMemo<ColumnDef<Order, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Pedido",
        enableSorting: true,
        size: 120,
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-[#a3a3a3] font-semibold">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "customer",
        header: "Cliente",
        enableSorting: true,
        size: 200,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[10px] font-bold text-[#737373] flex-shrink-0">
              {row.original.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#e5e5e5] truncate">{row.original.customer}</p>
              <p className="text-[10px] text-[#404040] truncate">{row.original.customerEmail}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Fecha",
        enableSorting: true,
        size: 130,
        cell: ({ row }) => (
          <div>
            <p className="text-xs text-[#a3a3a3]">{row.original.date}</p>
            <p className="text-[10px] text-[#333]">
              {row.original.dateRaw.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "items",
        header: "Items",
        enableSorting: true,
        size: 70,
        cell: ({ getValue }) => (
          <span className="text-xs text-[#737373] tabular-nums">{getValue() as number}</span>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        enableSorting: true,
        size: 110,
        cell: ({ getValue }) => (
          <span className="text-xs font-bold text-[#e5e5e5] tabular-nums">
            ${(getValue() as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "payment",
        header: "Pago",
        enableSorting: true,
        size: 110,
        cell: ({ getValue }) => <PaymentBadge status={getValue() as PaymentStatus} />,
      },
      {
        accessorKey: "status",
        header: "Estado",
        enableSorting: true,
        size: 130,
        cell: ({ getValue }) => <OrderStatusBadge status={getValue() as OrderStatus} />,
      },
      {
        id: "actions",
        header: "",
        size: 80,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setSelectedOrder(row.original)}
              className="p-1.5 rounded-md text-[#404040] hover:text-[#e5e5e5] hover:bg-[#1f1f1f] transition-colors"
              title="Ver detalle"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {ORDER_STATUS_CFG[row.original.status] && (
              <button
                onClick={() => {
                  const idx = STATUS_FLOW.indexOf(row.original.status);
                  if (idx >= 0 && idx < STATUS_FLOW.length - 1) {
                    handleStatusChange(row.original.id, STATUS_FLOW[idx + 1]);
                  }
                }}
                className="p-1.5 rounded-md text-[#404040] hover:text-[#f97316] hover:bg-[#f97316]/10 transition-colors"
                title="Avanzar estado"
                disabled={STATUS_FLOW.indexOf(row.original.status) >= STATUS_FLOW.length - 1}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#e5e5e5] tracking-tight">Pedidos</h1>
          <p className="text-sm text-[#404040] mt-0.5">
            {orders.length} pedidos ·{" "}
            {orders.filter((o) => o.status === "Pendiente").length} pendientes ·{" "}
            {orders.filter((o) => o.status === "Enviado").length} en tránsito
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#737373] hover:border-[#262626] hover:text-[#e5e5e5] transition-colors">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#737373] hover:border-[#262626] hover:text-[#e5e5e5] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        {/* Status tabs */}
        <div className="flex items-center gap-0 border-b border-[#1a1a1a] overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const count = tabCounts[tab.value] ?? 0;
            const isActive = activeTab === tab.value;
            const cfg =
              tab.value !== "Todos"
                ? ORDER_STATUS_CFG[tab.value as OrderStatus]
                : null;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors
                  ${isActive
                    ? `border-[#f97316] text-[#f97316]`
                    : "border-transparent text-[#525252] hover:text-[#a3a3a3] hover:bg-[#0f0f0f]"}`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                      ${isActive
                        ? "bg-[#f97316]/20 text-[#f97316]"
                        : "bg-[#1f1f1f] text-[#525252]"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#404040]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por pedido, cliente..."
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg pl-9 pr-3 py-2 text-xs text-[#e5e5e5]
                placeholder:text-[#404040] focus:outline-none focus:border-[#f97316] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#404040] hover:text-[#a3a3a3]">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Payment filter */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "Todos")}
              className="appearance-none bg-[#111] border border-[#1f1f1f] text-[#737373] text-xs rounded-lg pl-3 pr-7 py-2
                focus:outline-none focus:border-[#f97316] hover:border-[#262626] transition-colors cursor-pointer"
            >
              {["Todos", "Pagado", "Pendiente", "Fallido", "Reembolsado"].map((p) => (
                <option key={p} value={p}>
                  {p === "Todos" ? "Todos los pagos" : p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#404040] pointer-events-none" />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#404040]" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-[#111] border border-[#1f1f1f] text-[#737373] text-xs rounded-lg pl-7 pr-3 py-2
                  focus:outline-none focus:border-[#f97316] hover:border-[#262626] transition-colors cursor-pointer"
              />
            </div>
            <span className="text-[#333] text-xs"> - </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-[#111] border border-[#1f1f1f] text-[#737373] text-xs rounded-lg px-3 py-2
                focus:outline-none focus:border-[#f97316] hover:border-[#262626] transition-colors cursor-pointer"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-[#404040] hover:text-[#a3a3a3]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Count */}
          <span className="ml-auto text-xs text-[#404040]">
            {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <DataTable
          data={filtered}
          columns={columns}
          bulkActions={[
            {
              label: "Confirmar selección",
              icon: CheckCircle2,
              onClick: (rows) =>
                rows.forEach((r) => {
                  if (r.status === "Pendiente") handleStatusChange(r.id, "Confirmado");
                }),
            },
            {
              label: "Exportar selección",
              icon: Download,
              onClick: (rows) => console.log("export", rows.length),
            },
            {
              label: "Cancelar selección",
              icon: XCircle,
              variant: "danger",
              onClick: (rows) =>
                rows.forEach((r) => handleStatusChange(r.id, "Cancelado")),
            },
          ]}
          emptyMessage="No se encontraron pedidos con los filtros aplicados"
          pageSize={12}
        />
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
