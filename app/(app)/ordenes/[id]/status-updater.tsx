"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";
import { RefreshCw, Loader2, Check } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "Recibido", "Diagnóstico", "Autorización Pendiente", "En Reparación",
  "Terminado", "Entregado", "Cancelado",
];

export function StatusUpdater({ id, current }: { id: string; current: OrderStatus }) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  async function update(status: OrderStatus) {
    if (status === current) return;
    setSaving(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ title: "No se pudo actualizar", description: data?.error, tone: "warning" }); return; }
      toast({ title: `Orden #${id} → ${status}`, tone: "success" });
      router.refresh();
    } catch {
      toast({ title: "Error de red", tone: "warning" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Actualizar estado
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUSES.map((s) => (
          <DropdownMenuItem key={s} onClick={() => update(s)} className="gap-2">
            <span className="flex-1">{s}</span>
            {s === current && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
