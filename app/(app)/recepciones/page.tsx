"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User, Smartphone, Camera, PenTool, Check, Upload, ChevronRight,
} from "lucide-react";

const steps = ["Cliente", "Equipo", "Estado físico", "Confirmar"];

function LabeledInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input {...props} />
    </div>
  );
}

export default function RecepcionesPage() {
  const [step, setStep] = React.useState(0);

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
                <LabeledInput label="Nombre completo" defaultValue="Juan Pérez" />
                <LabeledInput label="Teléfono" defaultValue="55 1234 5678" />
                <LabeledInput label="Email" defaultValue="juan.perez@mail.com" />
                <LabeledInput label="RFC (opcional)" placeholder="XAXX010101000" />
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInput label="Marca" defaultValue="Apple" />
                <LabeledInput label="Modelo" defaultValue="iPhone 13 Pro Max" />
                <LabeledInput label="IMEI" defaultValue="356789118765432" />
                <LabeledInput label="Número de serie" defaultValue="F2LDPQ0XQ7D1L" />
                <LabeledInput label="Color" defaultValue="Sierra Blue" />
                <LabeledInput label="Accesorios entregados" defaultValue="Caja, cable" />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Falla reportada por el cliente</label>
                  <textarea
                    rows={3}
                    defaultValue="La pantalla no responde en la parte superior y el Face ID no funciona."
                    className="w-full rounded-lg border border-border bg-secondary/50 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Fotografías del equipo</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-secondary to-background" />
                    ))}
                    <button className="grid aspect-square place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
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
                    <p className="text-sm italic text-muted-foreground">✍️ Firma capturada — Juan Pérez</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  El cliente acepta los términos del servicio y la política de garantía.
                </label>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Anterior</Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)}>Continuar</Button>
              ) : (
                <Button variant="success"><Check className="h-4 w-4" /> Generar orden #OS-00059</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Summary label="Cliente" value="Juan Pérez" />
            <Summary label="Teléfono" value="55 1234 5678" />
            <Summary label="Equipo" value="iPhone 13 Pro Max" />
            <Summary label="IMEI" value="356789118765432" />
            <Summary label="Fecha de ingreso" value="4 jun 2026, 11:30" />
            <div className="my-1 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado</span>
              <Badge variant="default">Recibido</Badge>
            </div>
            <p className="rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
              Al generar la orden se enviará un mensaje automático de “Equipo Recibido” por WhatsApp.
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
