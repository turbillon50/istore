"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { useToast } from "@/components/ui/toast";
import type { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search, SlidersHorizontal, Download, Plus, ChevronRight, Table2, KanbanSquare,
} from "lucide-react";

const filters: (OrderStatus | "Todas")[] = [
  "Todas", "Recibido", "Diagnóstico", "Autorización Pendiente", "En Reparación", "Terminado", "Entregado",
];

const kanbanCols: OrderStatus[] = [
  "Recibido", "Diagnóstico", "Autorización Pendiente", "En Reparación", "Terminado", "Entregado",
];

export default function OrdersPage({ seedOrders }: { seedOrders: Order[] }) {
  const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>(seedOrders);
  const [view, setView] = React.useState<"tabla" | "tablero">("tabla");
  const [active, setActive] = React.useState<(typeof filters)[number]>("Todas");
  const [q, setQ] = React.useState("");

  const filtered = orders.filter((o) => {
    const matchStatus = active === "Todas" || o.status === active;
    const matchQ =
      o.client.toLowerCase().includes(q.toLowerCase()) ||
      o.id.toLowerCase().includes(q.toLowerCase()) ||
      o.device.toLowerCase().includes(q.toLowerCase());
    return matchStatus && matchQ;
  });

  const move = (id: string, status: OrderStatus) => {
    setOrders((prev) => {
      const o = prev.find((x) => x.id === id);
      if (!o || o.status === status) return prev;
      toast({ title: `Orden #${id} → ${status}`, description: `${o.client} · ${o.device}`, tone: "success" });
      return prev.map((x) => (x.id === id ? { ...x, status } : x));
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Órdenes de servicio" description={`${orders.length} órdenes · ${orders.filter(o => !["Entregado","Cancelado"].includes(o.status)).length} abiertas`}>
        <div className="flex rounded-lg border border-border p-0.5">
          <button onClick={() => setView("tabla")} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${view === "tabla" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
            <Table2 className="h-3.5 w-3.5" /> Tabla
          </button>
          <button onClick={() => setView("tablero")} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${view === "tablero" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
            <KanbanSquare className="h-3.5 w-3.5" /> Tablero
          </button>
        </div>
        <Button variant="secondary" size="sm" onClick={() => toast({ title: "Exportando…", description: "Se generará un CSV con las órdenes filtradas.", tone: "info" })}>
          <Download className="h-4 w-4" /> Exportar
        </Button>
        <Button size="sm" asChild><Link href="/recepciones"><Plus className="h-4 w-4" /> Nueva orden</Link></Button>
      </PageHeader>

      {view === "tabla" && (
        <>
          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por folio, cliente o equipo…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Button variant="secondary" size="sm"><SlidersHorizontal className="h-4 w-4" /> Filtros</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f} onClick={() => setActive(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {f}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Folio</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Equipo</th>
                    <th className="px-5 py-3 font-medium">Técnico</th>
                    <th className="px-5 py-3 font-medium">Prioridad</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium">Promesa</th>
                    <th className="px-5 py-3 text-right font-medium">Costo</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="group border-b border-border/50 transition-colors hover:bg-accent/40">
                      <td className="px-5 py-3"><span className="font-mono text-xs text-primary">#{o.id}</span></td>
                      <td className="px-5 py-3 font-medium">{o.client}</td>
                      <td className="px-5 py-3 text-muted-foreground">{o.device}</td>
                      <td className="px-5 py-3 text-muted-foreground">{o.technician}</td>
                      <td className="px-5 py-3"><PriorityBadge priority={o.priority} /></td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(o.promiseAt)}</td>
                      <td className="px-5 py-3 text-right font-medium">{formatCurrency(o.cost)}</td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/ordenes/${o.id}`} className="inline-flex items-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} className="py-10 text-center text-sm text-muted-foreground">Sin resultados para los filtros aplicados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {view === "tablero" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanCols.map((col) => {
            const cards = orders.filter((o) => o.status === col);
            return (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id) move(id, col); }}
                className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-card/40"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <StatusBadge status={col} />
                  </span>
                  <span className="text-xs text-muted-foreground">{cards.length}</span>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto p-2.5" style={{ minHeight: 120, maxHeight: "65vh" }}>
                  {cards.map((o) => (
                    <motion.div
                      layout
                      key={o.id}
                      draggable
                      onDragStart={(e) => (e as any).dataTransfer.setData("text/plain", o.id)}
                      className="cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/40 active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between">
                        <Link href={`/ordenes/${o.id}`} className="font-mono text-[11px] text-primary hover:underline">#{o.id}</Link>
                        <PriorityBadge priority={o.priority} />
                      </div>
                      <p className="mt-1.5 text-sm font-medium leading-tight">{o.client}</p>
                      <p className="text-xs text-muted-foreground">{o.device}</p>
                      <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                        <span className="text-muted-foreground">{o.technician}</span>
                        <span className="font-medium">{formatCurrency(o.cost)}</span>
                      </div>
                    </motion.div>
                  ))}
                  {cards.length === 0 && (
                    <div className="grid h-24 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                      Arrastra aquí
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
