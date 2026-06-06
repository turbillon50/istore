"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Store,
  MapPin,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket,
} from "lucide-react";

const DEVICE_TYPES = [
  { id: "celulares", label: "Celulares", icon: Smartphone },
  { id: "computadoras", label: "Computadoras", icon: Laptop },
  { id: "tablets", label: "Tablets", icon: Tablet },
  { id: "wearables", label: "Wearables", icon: Watch },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    taller: "",
    sucursal: "Centro",
    devices: ["celulares"] as string[],
  });

  const toggleDevice = (id: string) =>
    setForm((f) => ({
      ...f,
      devices: f.devices.includes(id)
        ? f.devices.filter((d) => d !== id)
        : [...f.devices, id],
    }));

  const finish = () => {
    setSaving(true);
    try {
      localStorage.setItem(
        "istore-onboarding",
        JSON.stringify({ ...form, completedAt: new Date().toISOString() })
      );
    } catch {}
    router.push("/dashboard");
  };

  const steps = [
    {
      title: "Tu taller",
      desc: "¿Cómo se llama tu negocio?",
      valid: form.taller.trim().length >= 2,
      body: (
        <div className="space-y-4">
          <div className="relative">
            <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Ej. iStore Centro"
              value={form.taller}
              onChange={(e) => setForm((f) => ({ ...f, taller: e.target.value }))}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Sucursal principal"
              value={form.sucursal}
              onChange={(e) => setForm((f) => ({ ...f, sucursal: e.target.value }))}
              className="pl-9"
            />
          </div>
        </div>
      ),
    },
    {
      title: "¿Qué reparas?",
      desc: "Selecciona los equipos que recibes.",
      valid: form.devices.length > 0,
      body: (
        <div className="grid grid-cols-2 gap-3">
          {DEVICE_TYPES.map(({ id, label, icon: Icon }) => {
            const active = form.devices.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleDevice(id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-6 w-6" />
                {label}
                {active && <CheckCircle2 className="h-4 w-4 text-success" />}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "Todo listo",
      desc: "Tu espacio de trabajo está configurado.",
      valid: true,
      body: (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <Rocket className="h-8 w-8 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{form.taller || "Tu taller"}</span>{" "}
            ya puede recibir equipos, crear órdenes y vender desde el POS.
          </p>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const last = step === steps.length - 1;

  return (
    <div className="noise relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 animate-aurora rounded-full bg-primary/20 blur-[140px]" />

      <div className="relative z-10 mb-8">
        <Logo size={34} />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border bg-card/70 p-7 shadow-2xl backdrop-blur-2xl">
        {/* Progreso */}
        <div className="mb-6 flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <h1 className="text-xl font-semibold tracking-tight">{current.title}</h1>
            <p className="mb-5 mt-1 text-sm text-muted-foreground">{current.desc}</p>
            {current.body}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </Button>
          {last ? (
            <Button onClick={finish} disabled={saving} size="lg">
              Ir al dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!current.valid}
              size="lg"
            >
              Continuar <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      <p className="relative z-10 mt-6 text-xs text-muted-foreground">
        Paso {step + 1} de {steps.length}
      </p>
    </div>
  );
}
