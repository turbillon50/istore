import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { LoginCard } from "./login-card";

const features = [
  "Recepción de equipos con firma y fotos",
  "Órdenes con timeline tipo AppleCare",
  "Diagnóstico técnico de 17 puntos",
  "Inventario con stock mínimo y alertas",
  "POS, caja y métodos de pago",
  "Analytics e iStore AI integrado",
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Fondo */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:gap-8">
        {/* Hero */}
        <div className="flex flex-col justify-center">
          <Logo size={40} className="mb-8" />

          <Badge variant="default" className="mb-5 w-fit gap-1.5 py-1">
            <Sparkles className="h-3.5 w-3.5" /> Nueva generación · v1.0 Demo
          </Badge>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Controla cada reparación desde{" "}
            <span className="text-gradient">una sola plataforma.</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-muted-foreground">
            iStore Pro es el sistema operativo de tu taller: órdenes,
            diagnósticos, inventario, ventas y clientes — con diseño de nivel
            Apple y la potencia de un ERP.
          </p>

          <div className="mt-7 grid max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span className="text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Entrar a la demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> Multisucursal
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-primary" /> PWA instalable
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-warning" /> Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="flex items-center justify-center lg:justify-end">
          <LoginCard />
        </div>
      </div>
    </div>
  );
}
