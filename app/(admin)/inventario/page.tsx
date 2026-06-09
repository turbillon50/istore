"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
  Plus,
  Minus,
  Search,
  ChevronDown,
  History,
  X,
  Store,
  Filter,
} from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import KPICard from "@/components/admin/KPICard";

// ─── Types & Mock ──────────────────────────────────────────────────────────────

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  total: number;
  reserved: number;
  available: number;
  minStock: number;
  location: string;
  lastMovement: string;
}

interface Movement {
  date: string;
  type: "entrada" | "salida" | "ajuste";
  qty: number;
  reason: string;
  user: string;
}

const MOCK: InventoryItem[] = [
  { id: "1", sku: "APL-IP15P-128", name: "iPhone 15 Pro 128GB", category: "Smartphones", total: 24, reserved: 6, available: 18, minStock: 10, location: "CDMX-A1", lastMovement: "hace 2 hr" },
  { id: "2", sku: "APL-MBP14-M3", name: "MacBook Pro 14\" M3", category: "Laptops", total: 7, reserved: 2, available: 5, minStock: 8, location: "CDMX-B2", lastMovement: "hace 5 hr" },
  { id: "3", sku: "SAM-S24U-256", name: "Samsung Galaxy S24 Ultra", category: "Smartphones", total: 31, reserved: 4, available: 27, minStock: 15, location: "MTY-A1", lastMovement: "hace 1 día" },
  { id: "4", sku: "APL-APP2-USB", name: "AirPods Pro 2 USB-C", category: "Audio", total: 0, reserved: 0, available: 0, minStock: 20, location: "CDMX-A2", lastMovement: "hace 3 días" },
  { id: "5", sku: "SON-WH1000XM5", name: "Sony WH-1000XM5", category: "Audio", total: 15, reserved: 1, available: 14, minStock: 5, location: "GDL-A1", lastMovement: "hace 6 hr" },
  { id: "6", sku: "SAM-T7-1TB", name: "Samsung T7 SSD 1TB", category: "Almacenamiento", total: 88, reserved: 12, available: 76, minStock: 30, location: "CDMX-C1", lastMovement: "hace 1 hr" },
  { id: "7", sku: "APL-IPP129-256", name: "iPad Pro 12.9\" M2 256GB", category: "Tablets", total: 9, reserved: 3, available: 6, minStock: 10, location: "MTY-B1", lastMovement: "hace 8 hr" },
  { id: "8", sku: "LG-27UP850N", name: "LG UltraFine 27\" 4K USB-C", category: "Monitores", total: 4, reserved: 0, available: 4, minStock: 5, location: "CDMX-D1", lastMovement: "hace 2 días" },
  { id: "9", sku: "APL-AWU2-TIT", name: "Apple Watch Ultra 2", category: "Wearables", total: 12, reserved: 2, available: 10, minStock: 8, location: "GDL-A2", lastMovement: "hace 3 hr" },
  { id: "10", sku: "APL-MB13-M3", name: "MacBook Air 13\" M3", category: "Laptops", total: 19, reserved: 5, available: 14, minStock: 10, location: "CDMX-B1", lastMovement: "hace 4 hr" },
];

const MOCK_MOVEMENTS: Movement[] = [
  { date: "Hoy 14:30", type: "salida", qty: -2, reason: "Pedido #ORD-2891", user: "Sistema" },
  { date: "Hoy 11:15", type: "entrada", qty: 10, reason: "Recepción de proveedor", user: "Carlos M." },
  { date: "Ayer 16:00", type: "ajuste", qty: -1, reason: "Producto dañado", user: "Ana G." },
  { date: "Ayer 09:30", type: "salida", qty: -3, reason: "Pedidos #2885, #2886, #2887", user: "Sistema" },
  { date: "Hace 3 días", type: "entrada", qty: 20, reason: "Reposición mensual", user: "Luis T." },
];

const BRANCHES = ["Todas las sucursales", "CDMX", "MTY", "GDL"];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(onViewHistory: (item: InventoryItem) => void, onAdjust: (item: InventoryItem) => void): ColumnDef<InventoryItem, any>[] {
  return [
    {
      id: "product",
      header: "Producto",
      accessorFn: (r) => r.name,
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <p className="text-xs font-medium text-[#e5e5e5]">{row.original.name}</p>
          <p className="text-[11px] font-mono text-[#525252]">{row.original.sku}</p>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      enableSorting: true,
      size: 80,
      cell: ({ getValue }) => (
        <span className="text-xs font-semibold text-[#e5e5e5] tabular-nums">{getValue()}</span>
      ),
    },
    {
      accessorKey: "reserved",
      header: "Reservado",
      enableSorting: true,
      size: 90,
      cell: ({ getValue }) => (
        <span className="text-xs text-yellow-400 tabular-nums">{getValue()}</span>
      ),
    },
    {
      accessorKey: "available",
      header: "Disponible",
      enableSorting: true,
      size: 90,
      cell: ({ row }) => {
        const v = row.original.available;
        const min = row.original.minStock;
        const critical = v === 0;
        const low = v > 0 && v < min;
        return (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold tabular-nums ${critical ? "text-red-400" : low ? "text-yellow-400" : "text-emerald-400"}`}>
              {v}
            </span>
            {(critical || low) && (
              <AlertTriangle className={`w-3 h-3 ${critical ? "text-red-400" : "text-yellow-400"}`} />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "minStock",
      header: "Mín.",
      size: 60,
      cell: ({ getValue }) => (
        <span className="text-xs text-[#525252] tabular-nums">{getValue()}</span>
      ),
    },
    {
      accessorKey: "location",
      header: "Ubicación",
      size: 100,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Store className="w-3 h-3 text-[#525252]" />
          <span className="text-xs text-[#a3a3a3] font-mono">{getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastMovement",
      header: "Último mov.",
      cell: ({ getValue }) => (
        <span className="text-xs text-[#525252]">{getValue()}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 100,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAdjust(row.original)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#262626] transition-colors"
          >
            <ArrowUpDown className="w-3 h-3" />
            Ajustar
          </button>
          <button
            onClick={() => onViewHistory(row.original)}
            className="p-1.5 rounded-md text-[#525252] hover:text-[#e5e5e5] hover:bg-[#262626] transition-colors"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventarioPage() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("Todas las sucursales");
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("0");

  const filtered = useMemo(() =>
    MOCK.filter((p) => {
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchBranch = branch === "Todas las sucursales" || p.location.startsWith(branch === "CDMX" ? "CDMX" : branch === "MTY" ? "MTY" : "GDL");
      const matchLow = !showLowOnly || p.available < p.minStock;
      return matchSearch && matchBranch && matchLow;
    }), [search, branch, showLowOnly]);

  const lowStockCount = MOCK.filter((p) => p.available < p.minStock && p.available > 0).length;
  const outOfStockCount = MOCK.filter((p) => p.available === 0).length;
  const totalUnits = MOCK.reduce((s, p) => s + p.total, 0);
  const totalReserved = MOCK.reduce((s, p) => s + p.reserved, 0);

  const columns = useMemo(
    () => buildColumns(setHistoryItem, setAdjustItem),
    []
  );

  const movTypeConfig = {
    entrada: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: TrendingUp, label: "Entrada" },
    salida: { color: "text-red-400", bg: "bg-red-400/10", icon: TrendingDown, label: "Salida" },
    ajuste: { color: "text-blue-400", bg: "bg-blue-400/10", icon: ArrowUpDown, label: "Ajuste" },
  };

  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e5e5e5]">Inventario</h1>
          <p className="text-sm text-[#525252] mt-0.5">{MOCK.length} productos · {totalUnits.toLocaleString()} unidades totales</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-[#ff8c00] rounded-lg text-sm text-white font-medium hover:bg-[#e07000] transition-colors">
          <ArrowUpDown className="w-4 h-4" />
          Ajuste masivo
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Unidades totales" value={totalUnits.toLocaleString()} icon={Package} variant="default" />
        <KPICard title="Reservadas" value={totalReserved} icon={Package} variant="warning" />
        <KPICard title="Stock bajo" value={lowStockCount} icon={AlertTriangle} variant="warning" />
        <KPICard title="Sin stock" value={outOfStockCount} icon={AlertTriangle} variant="danger" />
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[#262626]">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#525252]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto o SKU..."
              className="w-full bg-[#111] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-[#e5e5e5] placeholder:text-[#525252]
                focus:outline-none focus:border-[#ff8c00] transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="appearance-none bg-[#1a1a1a] border border-[#262626] text-[#a3a3a3] text-xs rounded-lg pl-3 pr-7 py-2
                focus:outline-none focus:border-[#ff8c00] hover:border-[#333] transition-colors cursor-pointer"
            >
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#525252] pointer-events-none" />
          </div>

          <button
            onClick={() => setShowLowOnly((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              showLowOnly
                ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                : "bg-[#1a1a1a] text-[#a3a3a3] border-[#262626] hover:border-[#333]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Solo stock bajo
          </button>
        </div>

        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="No hay productos con los filtros aplicados"
          pageSize={10}
        />
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {historyItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setHistoryItem(null)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111] border-l border-[#262626] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <div>
                  <h2 className="text-sm font-semibold text-[#e5e5e5]">Historial de movimientos</h2>
                  <p className="text-xs text-[#525252] mt-0.5">{historyItem.name}</p>
                </div>
                <button onClick={() => setHistoryItem(null)} className="p-2 rounded-lg text-[#525252] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {MOCK_MOVEMENTS.map((m, i) => {
                  const cfg = movTypeConfig[m.type];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#262626]">
                      <div className={`p-1.5 rounded-md ${cfg.bg} flex-shrink-0`}>
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${cfg.color}`}>
                            {m.qty > 0 ? `+${m.qty}` : m.qty} unidades
                          </span>
                          <span className="text-[11px] text-[#525252]">{m.date}</span>
                        </div>
                        <p className="text-xs text-[#a3a3a3] mt-0.5">{m.reason}</p>
                        <p className="text-[11px] text-[#525252]">por {m.user}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Adjust Panel */}
      <AnimatePresence>
        {adjustItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAdjustItem(null)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[#111] border border-[#262626] rounded-xl w-full max-w-sm p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-[#e5e5e5]">Ajustar inventario</h2>
                  <button onClick={() => setAdjustItem(null)} className="p-1.5 rounded-lg text-[#525252] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#a3a3a3] mb-4">{adjustItem.name}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-[#525252] mb-1">Actual</p>
                    <p className="text-2xl font-bold text-[#e5e5e5]">{adjustItem.available}</p>
                  </div>
                  <ArrowUpDown className="w-4 h-4 text-[#525252]" />
                  <div className="flex-1 text-center">
                    <p className="text-xs text-[#525252] mb-1">Nuevo</p>
                    <p className="text-2xl font-bold text-[#ff8c00]">{adjustItem.available + Number(adjustQty)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setAdjustQty((v) => String(Number(v) - 1))}
                    className="p-2 bg-[#1a1a1a] border border-[#262626] rounded-lg text-[#e5e5e5] hover:bg-[#262626] transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    className="flex-1 text-center bg-[#1a1a1a] border border-[#262626] rounded-lg py-2 text-sm text-[#e5e5e5]
                      focus:outline-none focus:border-[#ff8c00] transition-colors"
                  />
                  <button onClick={() => setAdjustQty((v) => String(Number(v) + 1))}
                    className="p-2 bg-[#1a1a1a] border border-[#262626] rounded-lg text-[#e5e5e5] hover:bg-[#262626] transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  placeholder="Motivo del ajuste..."
                  rows={2}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-xs text-[#e5e5e5] placeholder:text-[#525252]
                    focus:outline-none focus:border-[#ff8c00] transition-colors resize-none mb-4"
                />
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdjustItem(null)}
                    className="flex-1 py-2 text-sm text-[#a3a3a3] border border-[#262626] rounded-lg hover:text-[#e5e5e5] transition-colors">
                    Cancelar
                  </button>
                  <button onClick={() => setAdjustItem(null)}
                    className="flex-1 py-2 bg-[#ff8c00] text-white text-sm font-medium rounded-lg hover:bg-[#e07000] transition-colors">
                    Aplicar ajuste
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
