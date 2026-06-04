"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { posCatalog } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, QrCode, Tag } from "lucide-react";

interface CartLine { id: string; name: string; price: number; qty: number; }

const methods = [
  { name: "Efectivo", icon: Banknote },
  { name: "Tarjeta", icon: CreditCard },
  { name: "Transferencia", icon: Smartphone },
  { name: "QR", icon: QrCode },
];

export default function VentasPage() {
  const [cart, setCart] = React.useState<CartLine[]>([
    { id: "p1", name: "Pantalla iPhone 13 Pro", price: 2350, qty: 1 },
    { id: "p4", name: "Cristal Templado 9H", price: 120, qty: 2 },
  ]);
  const [q, setQ] = React.useState("");
  const [method, setMethod] = React.useState("Efectivo");

  const add = (p: (typeof posCatalog)[number]) =>
    setCart((c) => {
      const ex = c.find((l) => l.id === p.id);
      if (ex) return c.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  const setQty = (id: string, d: number) =>
    setCart((c) => c.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + d) } : l)));
  const remove = (id: string) => setCart((c) => c.filter((l) => l.id !== id));

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const tax = Math.round((subtotal - discount) * 0.16);
  const total = subtotal - discount + tax;
  const filtered = posCatalog.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Punto de venta" description="Cobra refacciones, accesorios y servicios al instante." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Catalog */}
        <div className="space-y-4 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar producto o servicio…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => add(p)}>
                <Card className="flex h-full flex-col justify-between p-4 text-left transition-all hover:border-primary/50 hover:bg-accent/40">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-[10px]">{p.category}</Badge>
                    <p className="text-sm font-medium leading-tight">{p.name}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold">{formatCurrency(p.price)}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary"><Plus className="h-4 w-4" /></span>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <Card className="flex h-fit flex-col lg:sticky lg:top-20">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Carrito ({cart.length})</CardTitle>
            <Button variant="ghost" size="xs" onClick={() => setCart([])}>Vaciar</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Carrito vacío.</p>}
            {cart.map((l) => (
              <div key={l.id} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(l.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="secondary" size="icon" className="h-6 w-6" onClick={() => setQty(l.id, -1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-5 text-center text-sm">{l.qty}</span>
                  <Button variant="secondary" size="icon" className="h-6 w-6" onClick={() => setQty(l.id, 1)}><Plus className="h-3 w-3" /></Button>
                </div>
                <button onClick={() => remove(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}

            <div className="mt-2 space-y-1.5 border-t border-border pt-3 text-sm">
              <Line label="Subtotal" value={formatCurrency(subtotal)} />
              <Line label="Descuento (5%)" value={`- ${formatCurrency(discount)}`} accent="text-success" />
              <Line label="IVA (16%)" value={formatCurrency(tax)} />
              <div className="flex items-center justify-between pt-1 text-base font-semibold">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Método de pago</p>
              <div className="grid grid-cols-4 gap-2">
                {methods.map((m) => (
                  <button key={m.name} onClick={() => setMethod(m.name)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] transition-colors ${method === m.name ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>
                    <m.icon className="h-4 w-4" />{m.name}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" size="lg" disabled={cart.length === 0}>
              Cobrar {formatCurrency(total)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Line({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ?? ""}>{value}</span>
    </div>
  );
}
