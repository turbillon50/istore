"use client";

import { useState, useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Columns3,
  Loader2,
  InboxIcon,
  Check,
  Minus,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BulkAction<TData> {
  label: string;
  icon?: React.ElementType;
  variant?: "default" | "danger";
  onClick: (rows: TData[]) => void;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  loading?: boolean;
  bulkActions?: BulkAction<TData>[];
  onExportCSV?: (rows: TData[]) => void;
  onExportXLSX?: (rows: TData[]) => void;
  searchValue?: string;
  emptyMessage?: string;
  pageSize?: number;
  showColumnVisibility?: boolean;
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-3.5 bg-[#1f1f1f] rounded-md animate-pulse"
            style={{ width: `${45 + ((i * 37) % 45)}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Column visibility menu ───────────────────────────────────────────────────

function ColumnVisibilityMenu<TData extends object>({
  table,
  onClose,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className="absolute right-0 top-full mt-1 bg-[#111] border border-[#262626] rounded-xl shadow-2xl z-50 min-w-[180px] py-2 overflow-hidden"
    >
      <p className="text-[10px] font-semibold text-[#525252] uppercase tracking-wider px-3 pb-1.5 border-b border-[#1a1a1a] mb-1">
        Columnas visibles
      </p>
      {table
        .getAllLeafColumns()
        .filter((col) => col.id !== "select" && col.id !== "actions")
        .map((col) => (
          <label
            key={col.id}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] cursor-pointer transition-colors"
          >
            <div
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                ${col.getIsVisible()
                  ? "bg-[#f97316] border-[#f97316]"
                  : "border-[#404040]"}`}
              onClick={(e) => {
                e.preventDefault();
                col.toggleVisibility();
              }}
            >
              {col.getIsVisible() && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
            {typeof col.columnDef.header === "string"
              ? col.columnDef.header
              : col.id}
          </label>
        ))}
    </motion.div>
  );
}

// ─── Export menu ──────────────────────────────────────────────────────────────

function ExportMenu({
  onCSV,
  onXLSX,
  onClose,
}: {
  onCSV: () => void;
  onXLSX: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className="absolute right-0 top-full mt-1 bg-[#111] border border-[#262626] rounded-xl shadow-2xl z-50 min-w-[160px] py-2 overflow-hidden"
    >
      <button
        onClick={() => { onCSV(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
      >
        <FileText className="w-3.5 h-3.5 text-[#f97316]" />
        Exportar CSV
      </button>
      <button
        onClick={() => { onXLSX(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
        Exportar Excel
      </button>
    </motion.div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export default function DataTable<TData extends object>({
  data,
  columns,
  loading = false,
  bulkActions = [],
  onExportCSV,
  onExportXLSX,
  emptyMessage = "No hay registros",
  pageSize = 20,
  showColumnVisibility = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showColMenu, setShowColMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Inject selection column
  const allColumns = useMemo<ColumnDef<TData, any>[]>(
    () => [
      {
        id: "select",
        size: 44,
        enableSorting: false,
        header: ({ table }) => (
          <button
            onClick={table.getToggleAllPageRowsSelectedHandler()}
            className="flex items-center justify-center"
          >
            {table.getIsAllPageRowsSelected() ? (
              <div className="w-4 h-4 rounded bg-[#f97316] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            ) : table.getIsSomePageRowsSelected() ? (
              <div className="w-4 h-4 rounded bg-[#f97316]/50 border border-[#f97316] flex items-center justify-center">
                <Minus className="w-2.5 h-2.5 text-white" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded border border-[#333] hover:border-[#f97316] transition-colors" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <button
            onClick={row.getToggleSelectedHandler()}
            className="flex items-center justify-center"
          >
            {row.getIsSelected() ? (
              <div className="w-4 h-4 rounded bg-[#f97316] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded border border-[#333] hover:border-[#f97316] transition-colors" />
            )}
          </button>
        ),
      },
      ...columns,
    ],
    [columns]
  );

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection, columnVisibility, columnFilters },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const hasSelection = selectedRows.length > 0;

  const handleDefaultExportCSV = () => {
    if (onExportCSV) {
      onExportCSV(selectedRows.length > 0 ? selectedRows : data);
      return;
    }
    // Built-in CSV export
    const rows = selectedRows.length > 0 ? selectedRows : data;
    const visibleCols = table
      .getVisibleLeafColumns()
      .filter((c) => c.id !== "select" && c.id !== "actions");
    const header = visibleCols
      .map((c) =>
        typeof c.columnDef.header === "string" ? c.columnDef.header : c.id
      )
      .join(",");
    const body = rows
      .map((row) =>
        visibleCols
          .map((col) => {
            const v = (row as any)[col.id] ?? "";
            return `"${String(v).replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDefaultExportXLSX = () => {
    if (onExportXLSX) {
      onExportXLSX(selectedRows.length > 0 ? selectedRows : data);
    } else {
      // Fallback: CSV with xlsx extension notice
      handleDefaultExportCSV();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Toolbar (column visibility + export) */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-[#1a1a1a]">
        {/* Click-away */}
        {(showColMenu || showExportMenu) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => { setShowColMenu(false); setShowExportMenu(false); }}
          />
        )}

        {showColumnVisibility && (
          <div className="relative z-50">
            <button
              onClick={() => { setShowColMenu((v) => !v); setShowExportMenu(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#737373] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] rounded-lg transition-colors border border-transparent hover:border-[#262626]"
            >
              <Columns3 className="w-3.5 h-3.5" />
              Columnas
            </button>
            <AnimatePresence>
              {showColMenu && (
                <ColumnVisibilit