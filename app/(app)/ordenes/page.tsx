"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { orders, type OrderStatus } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, SlidersHorizontal, Download, Plus, ChevronRight } from "lucide-react";

const filters: (OrderStatus | "Todas")[] = [
  "Todas", "Recibido", "Diagnóstico", "Autorización Pendiente", "En Reparación", "Terminado", "Entregado",
];

export default function OrdersPage() {
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

  return (
    <div className="space-y-6">
      <PageHeader title="Órdenes de servicio" description={`${orders.length} órdenes · 41 abiertas`}>
        <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Exportar</Button>
        <Button size="sm" asChild><Link href="/recepciones"><Plus className="h-4 w-4" /> Nueva orden</Link></Button>
      </PageHeader>

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
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
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
    </div>
  );
}
