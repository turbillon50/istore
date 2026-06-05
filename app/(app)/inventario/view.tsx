"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Search, Plus, Package, AlertTriangle, TrendingUp, Boxes, Download } from "lucide-react";

const categories = ["Todas", "Pantallas", "Baterías", "Flex", "Cámaras", "Tapas", "Herramientas", "Accesorios"];

export default function InventarioPage({ products }: { products: Product[] }) {
  const [cat, setCat] = React.useState("Todas");
  const [q, setQ] = React.useState("");

  const filtered = products.filter(
    (p) => (cat === "Todas" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())
  );
  const lowStock = products.filter((p) => p.stock <= p.minStock).length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventario" description={`${products.length} productos · ${lowStock} bajo stock mínimo`}>
        <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Exportar</Button>
        <Button size="sm"><Plus className="h-4 w-4" /> Nuevo producto</Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Productos totales" value={`${products.length}`} icon={Boxes} tone="primary" />
        <MetricCard label="Valor de inventario" value={formatCurrency(totalValue)} icon={Package} tone="success" delta={4.1} />
        <MetricCard label="Bajo stock mínimo" value={`${lowStock}`} icon={AlertTriangle} tone="warning" />
        <MetricCard label="Margen promedio" value="52%" icon={TrendingUp} tone="success" delta={1.8} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar refacción o accesorio…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 text-right font-medium">Costo</th>
                <th className="px-5 py-3 text-right font-medium">Precio</th>
                <th className="px-5 py-3 text-right font-medium">Margen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const margin = Math.round(((p.price - p.cost) / p.price) * 100);
                const low = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="border-b border-border/50 transition-colors hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3"><Badge variant="secondary">{p.category}</Badge></td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className={low ? "font-semibold text-destructive" : "font-medium"}>{p.stock}</span>
                        <div className="w-16">
                          <Progress value={Math.min(100, (p.stock / 40) * 100)} indicatorClassName={low ? "bg-destructive" : p.stock < 20 ? "bg-warning" : "bg-success"} />
                        </div>
                        {low && <Badge variant="danger" className="text-[10px]">Bajo</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.supplier}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{formatCurrency(p.cost)}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(p.price)}</td>
                    <td className="px-5 py-3 text-right"><span className="text-success">{margin}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
