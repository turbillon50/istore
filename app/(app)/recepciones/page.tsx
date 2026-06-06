"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  User, Smartphone, Camera, PenTool, Check, Upload, ChevronRight, Loader2,
} from "lucide-react";

const steps = ["Cliente", "Equipo", "Estado físico", "Confirmar"];

type Form = {
  client: string; clientPhone: string; clientEmail: string;
  brand: string; device: string; imei: string; serial: string; color: string;
  issue: string; cost: string;
};
const empty: Form = {
  client: "", clientPhone: "", clientEmail: "",
  brand: "", device: "", imei: "", serial: "", color: "",
  issue: "", cost: "",
};

function LabeledInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input {...props} />
    </div>
  );
}

export default function RecepcionesPage() {
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<Form>(empty);
  const [saving, setSaving] = React.useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    if (!form.client.trim()) { toast({ title: "Falta el nombre del cliente", tone: "warning" }); setStep(0); return; }
    if (!form.device.trim() && !form.brand.trim()) { toast({ title: "Falta el equipo", tone: "warning" }); setStep(1); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: form.client,
          clientPhone: form.clientPhone,
          clientEmail: form.clientEmail,
          device: [form.brand, form.device].filter(Boolean).join(" ").trim() || form.device,
          brand: form.brand,
          imei: form.imei,
          issue: form.issue,
          cost: form.cost ? Number(form.cost) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ title: "No se pudo generar la orden", description: data?.error, tone: "warning" }); return; }
      toast({
        title: `Orden ${data.order.id} generada`,
        description: data.emailed
          ? `Se envió confirmación por correo a ${form.clientEmail}.`
          : "Orden registrada. (Sin correo: falta email del cliente o Resend.)",
        tone: "success",
      });
      setForm(empty);
      setStep(0);
    } catch {
      toast({ title: "Error de red al generar la orden", tone: "warning" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Recepción de equipo" description="Registra un equipo nuevo en el taller y genera su orden de servicio." />

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
              )}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-black/20 text-xs">
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 0 && <><User className="h-5 w-5 text-primary" /> Datos del cliente</>}
              {step === 1 && <><Smartphone className="h-5 w-5 text-primary" /> Datos del equipo</>}
              {step === 2 && <><Camera className="h-5 w-5 text-primary" /> Estado físico y evidencia</>}
              {step === 3 && <><PenTool className="h-5 w-5 text-primary" /> Firma y confirmación</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInput label="Nombre completo" placeholder="Nombre del cliente" autoComplete="off" value={form.client} onChange={set("client")} />
                <LabeledInput label="Teléfono" placeholder="55 0000 0000" autoComplete="off" value={form.clientPhone} onChange={set("clientPhone")} />
                <LabeledInput label="Email" type="email" placeholder="cliente@correo.com" autoComplete="off" value={form.clientEmail} onChange={set("clientEmail")} />
                <LabeledInput label="Costo estimado (MXN)" type="number" min={0} placeholder="0" value={form.cost} onChange={set("cost")} />
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInput label="Marca" placeholder="Apple, Samsung…" autoComplete="off" value={form.brand} onChange={set("brand")} />
                <LabeledInput label="Modelo" placeholder="iPhone 13 Pro" autoComplete="off" value={form.device} onChange={set("device")} />
                <LabeledInput label="IMEI" placeholder="35 dígitos" autoComplete="off" value={form.imei} onChange={set("imei")} />
                <LabeledInput label="Número de serie" placeholder="Opcional" autoComplete="off" value={form.serial} onChange={set("serial")} />
                <LabeledInput label="Color" placeholder="Opcional" autoComplete="off" value={form.color} onChange={set("color")} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Falla reportada por el cliente</label>
                  <textarea
                    rows={3}
                    placeholder="Describe la falla reportada…"
                    value={form.issue}
                    onChange={set("issue")}
                    className="w-full rounded-lg border border-border bg-secondary/50 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Fotografías del equipo</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-secondary to-background" />
                    ))}
                    <button type="button" className="grid aspect-square place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                      <Upload className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Firma del cliente</label>
                  <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border bg-secondary/30">
                    <p className="text-sm italic text-muted-foreground">✍️ {form.client ? `Firma de ${form.client}` : "Captura la firma del cliente"}</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  El cliente acepta los términos del servicio y la política de garantía.
                </label>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="secondary" disabled={step === 0 || saving} onClick={() => setStep((s) => s - 1)}>Anterior</Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)}>Continuar</Button>
              ) : (
                <Button variant="success" onClick={submit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Generar orden
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Summary label="Cliente" value={form.client || "—"} />
            <Summary label="Teléfono" value={form.clientPhone || "—"} />
            <Summary label="Equipo" value={[form.brand, form.device].filter(Boolean).join(" ") || "—"} />
            <Summary label="IMEI" value={form.imei || "—"} />
            <div className="my-1 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado</span>
              <Badge variant="default">Recibido</Badge>
            </div>
            <p className="rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
              Al generar la orden se guarda en la base y se envía confirmación por correo si el cliente tiene email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
