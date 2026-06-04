"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { diagnosticChecklist, type CheckState } from "@/lib/mock-data";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  Check, X, AlertTriangle, FileText, MessageCircle, Mail, Download,
} from "lucide-react";

const stateConfig: Record<CheckState, { icon: any; cls: string; ring: string }> = {
  Aprobado: { icon: Check, cls: "text-success", ring: "border-success/40 bg-success/10" },
  Falla: { icon: X, cls: "text-destructive", ring: "border-destructive/40 bg-destructive/10" },
  Revisar: { icon: AlertTriangle, cls: "text-warning", ring: "border-warning/40 bg-warning/10" },
};

export default function DiagnosticosPage() {
  const [items, setItems] = React.useState(diagnosticChecklist);

  const cycle = (i: number) => {
    const order: CheckState[] = ["Aprobado", "Revisar", "Falla"];
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, state: order[(order.indexOf(it.state) + 1) % 3] } : it
      )
    );
  };

  const approved = items.filter((i) => i.state === "Aprobado").length;
  const fails = items.filter((i) => i.state === "Falla").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnóstico técnico" description="Orden #OS-00041 · iPhone 13 Pro Max · Checklist de 17 puntos">
        <ReportDialog items={items} />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-muted-foreground">Aprobados</p><p className="mt-1 text-2xl font-semibold text-success">{approved}</p></Card>
        <Card className="p-5"><p className="text-sm text-muted-foreground">A revisar</p><p className="mt-1 text-2xl font-semibold text-warning">{items.filter(i=>i.state==="Revisar").length}</p></Card>
        <Card className="p-5"><p className="text-sm text-muted-foreground">Fallas</p><p className="mt-1 text-2xl font-semibold text-destructive">{fails}</p></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Checklist de pruebas</CardTitle>
          <p className="text-sm text-muted-foreground">Toca cada prueba para cambiar su estado.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => {
              const cfg = stateConfig[c.state];
              const Icon = cfg.icon;
              return (
                <button
                  key={c.label}
                  onClick={() => cycle(i)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border bg-secondary/30 px-4 py-3 text-left transition-all hover:border-primary/40",
                  )}
                >
                  <span className="text-sm font-medium">{c.label}</span>
                  <span className={cn("flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs", cfg.ring)}>
                    <Icon className={cn("h-3.5 w-3.5", cfg.cls)} />
                    <span className={cfg.cls}>{c.state}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Observaciones del técnico</label>
            <textarea
              rows={3}
              defaultValue="Se recomienda cambio de módulo Face ID. Batería en 82% de salud, sugerir reemplazo preventivo."
              className="w-full rounded-lg border border-border bg-secondary/50 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportDialog({ items }: { items: typeof diagnosticChecklist }) {
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><FileText className="h-4 w-4" /> Generar reporte</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Reporte de diagnóstico</DialogTitle></DialogHeader>
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <Logo size={28} />
            <Badge variant="outline">#OS-00041</Badge>
          </div>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Reporte de diagnóstico
          </p>
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Cliente:</span> Juan Pérez</div>
            <div><span className="text-muted-foreground">Equipo:</span> iPhone 13 Pro Max</div>
            <div><span className="text-muted-foreground">IMEI:</span> 356789118765432</div>
            <div><span className="text-muted-foreground">Fecha:</span> 04 jun 2026</div>
          </div>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {items.map((c) => (
              <div key={c.label} className="flex items-center justify-between border-b border-border/40 py-1 text-xs">
                <span>{c.label}</span>
                <span className={
                  c.state === "Aprobado" ? "text-success" : c.state === "Falla" ? "text-destructive" : "text-warning"
                }>{c.state}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="success" size="sm" onClick={() => toast({ title: "Reporte enviado por WhatsApp", description: "Juan Pérez · #OS-00041", tone: "success" })}><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
          <Button variant="secondary" size="sm" onClick={() => toast({ title: "Reporte enviado por correo", description: "juan.perez@mail.com", tone: "info" })}><Mail className="h-4 w-4" /> Correo</Button>
          <Button size="sm" onClick={() => toast({ title: "PDF generado", description: "Reporte-OS-00041.pdf listo para descargar.", tone: "success" })}><Download className="h-4 w-4" /> PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
