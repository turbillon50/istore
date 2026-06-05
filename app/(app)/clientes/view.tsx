"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Client } from "@/lib/types";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { Search, Plus, Users, Star, Repeat, Phone, Mail, Smartphone } from "lucide-react";

const tagVariant: Record<Client["tag"], any> = {
  VIP: "warning", Frecuente: "default", Nuevo: "success", Mayoreo: "purple",
};

export default function ClientesPage({ clients }: { clients: Client[] }) {
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<Client | null>(null);

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description="1,500 clientes registrados · CRM integrado">
        <Button size="sm"><Plus className="h-4 w-4" /> Nuevo cliente</Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Clientes totales" value="1,500" icon={Users} tone="primary" delta={4.7} />
        <MetricCard label="Clientes VIP" value="142" icon={Star} tone="warning" />
        <MetricCard label="Recurrentes" value="68%" icon={Repeat} tone="success" delta={2.1} />
        <MetricCard label="Ticket promedio" value="$1,840" icon={Users} tone="purple" delta={3.4} />
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar cliente por nombre o teléfono…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <button key={c.id} onClick={() => setSelected(c)} className="text-left">
            <Card className="p-4 transition-all hover:border-primary/40">
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>{initials(c.name)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.phone}</p>
                </div>
                <Badge variant={tagVariant[c.tag]}>{c.tag}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Total gastado</p>
                  <p className="font-semibold">{formatCurrency(c.totalSpent)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Visitas</p>
                  <p className="font-semibold">{c.visits}</p>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14"><AvatarFallback className="text-lg">{initials(selected.name)}</AvatarFallback></Avatar>
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <Badge variant={tagVariant[selected.tag]} className="mt-1">{selected.tag}</Badge>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <Row icon={Phone} label={selected.phone} />
                <Row icon={Mail} label={selected.email} />
                <Row icon={Smartphone} label={`${selected.devices} equipos registrados`} />
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-secondary/40 p-4 text-center">
                <Stat label="Gastado" value={formatCurrency(selected.totalSpent)} />
                <Stat label="Visitas" value={`${selected.visits}`} />
                <Stat label="Cliente desde" value={formatDate(selected.since)} />
              </div>
              {selected.notes && (
                <p className="rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">📝 {selected.notes}</p>
              )}
              <div className="flex gap-2">
                <Button variant="success" className="flex-1"><Phone className="h-4 w-4" /> Contactar</Button>
                <Button variant="secondary" className="flex-1">Ver historial</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
