"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Store as StoreIcon, Plus, Crown, CreditCard, Loader2 } from "lucide-react";
import type { Store } from "@/lib/types";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input {...props} />
    </div>
  );
}

export function StoresPanel({ initialStores }: { initialStores: Store[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [f, setF] = React.useState({ name: "", email: "", phone: "", paymentProvider: "", paymentAccount: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) { toast({ title: "Falta el nombre de la tienda", tone: "warning" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) { toast({ title: "No se pudo crear la tienda", description: data?.error, tone: "warning" }); return; }
      toast({ title: `Tienda "${data.store.name}" agregada`, tone: "success" });
      setF({ name: "", email: "", phone: "", paymentProvider: "", paymentAccount: "" });
      setOpen(false);
      router.refresh();
    } catch {
      toast({ title: "Error de red", tone: "warning" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <StoreIcon className="h-5 w-5 text-primary" /> Tiendas en el sistema
          <Badge variant="secondary">{initialStores.length}</Badge>
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Agregar tienda</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva tienda</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-4">
              <Field label="Nombre de la tienda *" placeholder="Ej. CelExpress Centro" value={f.name} onChange={set("name")} autoComplete="off" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" type="email" placeholder="contacto@tienda.com" value={f.email} onChange={set("email")} autoComplete="off" />
                <Field label="Teléfono" placeholder="55 0000 0000" value={f.phone} onChange={set("phone")} autoComplete="off" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Proveedor de pago" placeholder="Mercado Pago / Stripe" value={f.paymentProvider} onChange={set("paymentProvider")} autoComplete="off" />
                <Field label="Cuenta de pago" placeholder="ID de cuenta (Connect)" value={f.paymentAccount} onChange={set("paymentAccount")} autoComplete="off" />
              </div>
              <p className="text-xs text-muted-foreground">
                La cuenta de pago queda guardada para cuando se active Mercado Pago / Stripe Connect.
              </p>
              <div className="flex justify-end gap-2">
                <DialogClose ref={closeRef} asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Crear tienda
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {initialStores.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <StoreIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">/{s.slug}</p>
                  </div>
                </div>
                {s.isPrincipal && (
                  <Badge variant="success" className="gap-1 shrink-0"><Crown className="h-3 w-3" /> Principal</Badge>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <Badge variant={s.status === "Activa" ? "default" : "secondary"}>{s.status}</Badge>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  {s.paymentAccount ? "Cuenta de pago lista" : "Sin cuenta de pago"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
