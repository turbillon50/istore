"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronDown,
  X,
  Package,
  FileSpreadsheet,
  AlertTriangle,
  Save,
  MoreHorizontal,
} from "lucide-react";
import DataTable from "@/components/admin/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: "Activo" | "Inactivo" | "Agotado";
  sales: number;
}

type EditingCell = { id: string; field: "price" | "stock"; value: string } | null;

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK: Product[] = [
  { id: "1",  sku: "APL-IP15P-128",   name: "iPhone 15 Pro 128GB",         category: "Smartphones",    brand: "Apple",    price: 22999, stock: 24, status: "Activo",   sales: 142 },
  { id: "2",  sku: "APL-MBP14-M3",    name: 'MacBook Pro 14" M3',          category: "Laptops",        brand: "Apple",    price: 38999, stock: 7,  status: "Activo",   sales: 89  },
  { id: "3",  sku: "SAM-S24U-256",    name: "Samsung Galaxy S24 Ultra",    category: "Smartphones",    brand: "Samsung",  price: 27999, stock: 31, status: "Activo",   sales: 115 },
  { id: "4",  sku: "APL-APP2-USB",    name: "AirPods Pro 2 USB-C",         category: "Audio",          brand: "Apple",    price: 6499,  stock: 0,  status: "Agotado",  sales: 234 },
  { id: "5",  sku: "SON-WH1000XM5",   name: "Sony WH-1000XM5",            category: "Audio",          brand: "Sony",     price: 7999,  stock: 15, status: "Activo",   sales: 67  },
  { id: "6",  sku: "SAM-T7-1TB",      name: "Samsung T7 SSD 1TB",         category: "Almacenamiento", brand: "Samsung",  price: 1899,  stock: 88, status: "Activo",   sales: 203 },
  { id: "7",  sku: "APL-IPP129-256",  name: 'iPad Pro 12.9" M2 256GB',    category: "Tablets",        brand: "Apple",    price: 22499, stock: 9,  status: "Activo",   sales: 67  },
  { id: "8",  sku: "LG-27UP850N",     name: "LG UltraFine 27\" 4K USB-C", category: "Monitores",      brand: "LG",       price: 12999, stock: 4,  status: "Activo",   sales: 28  },
  { id: "9",  sku: "APL-AWU2-TIT",    name: "Apple Watch Ultra 2 Titanio", category: "Wearables",     brand: "Apple",    price: 18999, stock: 12, status: "Activo",   sales: 55  },
  { id: "10", sku: "GOO-PXFL-256",    name: "Google Pixel 9 Fold 256GB",  category: "Smartphones",    brand: "Google",   price: 34999, stock: 0,  status: "Inactivo", sales: 0   },
  { id: "11", sku: "APL-MB13-M3",     name: 'MacBook Air 13" M3',         category: "Laptops",        brand: "Apple",    price: 24999, stock: 19, status: "Activo",   sales: 178 },
  { id: "12", sku: "DEL-XPS15-i9",    name: "Dell XPS 15 i9-13900H",      category: "Laptops",        brand: "Dell",     price: 42999, stock: 5,  status: "Activo",   sales: 34  },
  { id: "13", sku: "APL-IP14-256",    name: "iPhone 14 256GB",            category: "Smartphones",    brand: "Apple",    price: 16999, stock: 42, status: "Activo",   sales: 89  },
  { id: "14", sku: "MSF-SUR9-256",    name: "Microsoft Surface Pro 9",    category: "Tablets",        brand: "Microsoft",price: 28999, stock: 8,  status: "Activo",   sales: 22  },
  { id: "15", sku: "SAM-QN85B-55",    name: 'Samsung Neo QLED 55"',       category: "Televisores",    brand: "Samsung",  price: 34999, stock: 6,  status: "Activo",   sales: 41  },
];

const CATEGORIES = ["Todos", "Smartphones", "Laptops", "Audio", "Tablets", "Monitores", "Wearables", "Almacenamiento", "Televisores"];
const BRANDS = ["Todos", "Apple", "Samsung", "Sony", "LG", "Google", "Dell", "Microsoft"];
const STATUSES = ["Todos", "Activo", "Inactivo", "Agotado"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Product["status"] }) {
  const map = {
    Activo:   { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle2 },
    Inactivo: { cls: "text-[#525252] bg-[#1a1a1a] border-[#262626]",            icon: XCircle },
    Agotado:  { cls: "text-red-400 bg-red-400/10 border-red-400/20",            icon: AlertTriangle },
  };
  const { cls, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      <Icon className="w-2.5 h-2.5" />
      {status}
    </span>
  );
}

function ProductAvatar({ name, sku }: { name: string; sku: string }) {
  const colors: Record<string, string> = {
    APL: "from-[#1a1a2e] to-[#16213e]",
    SAM: "from-[#0d1b2a] to-[#1b2838]",
    SON: "from-[#1a0000] to-[#2d0000]",
    GOO: "from-[#0f2027] to-[#203a43]",
    DEL: "from-[#141414] to-[#1f1f1f]",
    MSF: "from-[#001a00] to-[#002200]",
    LG:  "from-[#1a0a00] to-[#2a1000]",
  };
  const prefix = sku.slice(0, 3);
  const grad = colors[prefix] ?? "from-[#1a1a1a] to-[#262626]";
  return (
    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${grad} border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#a3a3a3] flex-shrink-0`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function FilterSelect({
  label, value, options, onChange,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#111] border border-[#1f1f1f] text-[#737373] text-xs rounded-lg pl-3 pr-7 py-2
          focus:outline-none focus:border-[#f97316] hover:border-[#262626] hover:text-[#a3a3a3] transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "Todos" ? label : o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#404040] pointer-events-none" />
    </div>
  );
}

// ─── Inline edit cell ─────────────────────────────────────────────────────────

function InlineEditCell({
  id, field, value, isEditing, onStart, onSave, onCancel,
}: {
  id: string; field: "price" | "stock"; value: number;
  isEditing: boolean; onStart: () => void; onSave: (v: string) => void; onCancel: () => void;
}) {
  const [draft, setDraft] = useState(String(value));

  if (!isEditing) {
    return (
      <button
        onDoubleClick={onStart}
        title="Doble clic para editar"
        className={`text-xs font-semibold tabular-nums hover:text-[#f97316] transition-colors cursor-text
          ${field === "stock"
            ? value === 0 ? "text-red-400" : value < 10 ? "text-yellow-400" : "text-[#e5e5e5]"
            : "text-[#e5e5e5]"
          }`}
      >
        {field === "price" ? `$${value.toLocaleString()}` : value}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(draft);
          if (e.key === "Escape") onCancel();
        }}
        className="w-20 bg-[#0f0f0f] border border-[#f97316] rounded px-1.5 py-0.5 text-xs text-[#e5e5e5] tabular-nums focus:outline-none"
      />
      <button onClick={() => onSave(draft)} className="p-0.5 text-emerald-400 hover:text-emerald-300">
        <Save className="w-3 h-3" />
      </button>
      <button onClick={onCancel} className="p-0.5 text-[#525252] hover:text-[#a3a3a3]">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductosPage() {
  const [data, setData] = useState<Product[]>(MOCK);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [brand, setBrand] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const filtered = useMemo(
    () =>
      data.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
        return (
          matchSearch &&
          (category === "Todos" || p.category === category) &&
          (brand === "Todos" || p.brand === brand) &&
          (status === "Todos" || p.status === status)
        );
      }),
    [data, search, category, brand, status]
  );

  const handleInlineSave = useCallback(
    (id: string, field: "price" | "stock", raw: string) => {
      const n = Number(raw.replace(/[$,]/g, ""));
      if (isNaN(n) || n < 0) { setEditingCell(null); return; }
      setData((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                [field]: n,
                status: field === "stock" && n === 0 ? "Agotado" : p.status,
              }
            : p
        )
      );
      setEditingCell(null);
    },
    []
  );

  const handleBulkActivate = (rows: Product[]) => {
    const ids = new Set(rows.map((r) => r.id));
    setData((prev) =>
      prev.map((p) => (ids.has(p.id) && p.stock > 0 ? { ...p, status: "Activo" } : p))
    );
  };

  const handleBulkDeactivate = (rows: Product[]) => {
    const ids = new Set(rows.map((r) => r.id));
    setData((prev) =>
      prev.map((p) => (ids.has(p.id) ? { ...p, status: "Inactivo" } : p))
    );
  };

  const handleBulkDelete = (rows: Product[]) => {
    const ids = new Set(rows.map((r) => r.id));
    setData((prev) => prev.filter((p) => !ids.has(p.id)));
  };

  const columns = useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        id: "product",
        header: "Producto",
        accessorFn: (r) => r.name,
        enableSorting: true,
        size: 260,
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <ProductAvatar name={row.original.name} sku={row.original.sku} />
            <div className="min-w-0">
              <p className="text-[#e5e5e5] text-xs font-medium truncate max-w-[180px]">
                {row.original.name}
              </p>
              <p className="text-[#404040] text-[10px] font-mono">{row.original.sku}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Categoría",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-xs text-[#737373]">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "brand",
        header: "Marca",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-xs font-medium text-[#a3a3a3]">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "price",
        header: "Precio",
        enableSorting: true,
        size: 120,
        cell: ({ row }) => {
          const id = row.original.id;
          const isEdit = editingCell?.id === id && editingCell.field === "price";
          return (
            <InlineEditCell
              id={id}
              field="price"
              value={row.original.price}
              isEditing={isEdit}
              onStart={() => setEditingCell({ id, field: "price", value: String(row.original.price) })}
              onSave={(v) => handleInlineSave(id, "price", v)}
              onCancel={() => setEditingCell(null)}
            />
          );
        },
      },
      {
        accessorKey: "stock",
        header: "Stock",
        enableSorting: true,
        size: 100,
        cell: ({ row }) => {
          const id = row.original.id;
          const isEdit = editingCell?.id === id && editingCell.field === "stock";
          return (
            <InlineEditCell
              id={id}
              field="stock"
              value={row.original.stock}
              isEditing={isEdit}
              onStart={() => setEditingCell({ id, field: "stock", value: String(row.original.stock) })}
              onSave={(v) => handleInlineSave(id, "stock", v)}
              onCancel={() => setEditingCell(null)}
            />
          );
        },
      },
      {
        accessorKey: "sales",
        header: "Ventas",
        enableSorting: true,
        size: 80,
        cell: ({ getValue }) => (
          <span className="text-xs text-[#737373] tabular-nums">{getValue() as number}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Estado",
        enableSorting: true,
        size: 110,
        cell: ({ getValue }) => <StatusBadge status={getValue() as Product["status"]} />,
      },
      {
        id: "actions",
        header: "",
        size: 90,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditProduct(row.original)}
              className="p-1.5 rounded-md text-[#404040] hover:text-[#e5e5e5] hover:bg-[#1f1f1f] transition-colors"
              title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 rounded-md text-[#404040] hover:text-[#e5e5e5] hover:bg-[#1f1f1f] transition-colors"
              title="Ver"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleBulkDelete([row.original])}
              className="p-1.5 rounded-md text-[#404040] hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [editingCell, handleInlineSave]
  );

  const activeFilters = [
    category !== "Todos" ? { label: category, clear: () => setCategory("Todos") } : null,
    brand !== "Todos" ? { label: brand, clear: () => setBrand("Todos") } : null,
    status !== "Todos" ? { label: status, clear: () => setStatus("Todos") } : null,
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#e5e5e5] tracking-tight">Productos</h1>
          <p className="text-sm text-[#404040] mt-0.5">
            {data.length} en catálogo · {data.filter((p) => p.status === "Activo").length} activos ·{" "}
            {data.filter((p) => p.status === "Agotado").length} agotados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#737373] hover:border-[#262626] hover:text-[#e5e5e5] transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Importar Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-lg text-xs text-[#737373] hover