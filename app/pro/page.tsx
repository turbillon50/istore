import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Store,
} from "lucide-react";
import { clerkEnabled } from "@/lib/auth";

// Pitch SaaS multi-tienda para TALLERES. Es producto a futuro, NO el negocio de
// hoy (la tienda al público vive en "/"). Esta ruta NO se enlaza de forma
// prominente desde la home; solo un pie discreto.
export const metadata = {
  title: "iStore Pro — Sistema para talleres de reparación",
  description:
    "El sistema operativo para tu taller de reparación: órdenes, diagnósticos, inventario, POS y analytics.",
};

const features = [
  "Recepción de equipos con firma y fotos",
  "Órdenes con timeline tipo AppleCare",
  "Diagnóstico técnico de 17 puntos",
  "Inventario con stock mínimo y alertas",
  "POS, caja y métodos de pago",
  "Analytics e iStore AI integrado",
];

export default function ProPage() {
  return (
    <div className="noise relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 animate-aurora rounded-full bg-primary/20 blur-[140px]" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="iStore — inicio">
          <Logo size={34} tagline="para Talleres" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="secondary" size="sm">
            <Link href="/">
              <Store className="h-4 w-4" /> Ir a la tienda
            </Link>
          </Button>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <Badge variant="default" className="mb-5 w-fit gap-1.5 py-1">
            <Sparkles className="h-3.5 w-3.5" /> Para dueños de taller
          </Badge>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Controla cada reparación desde{" "}
            <span className="text-shine">una sola plataforma.</span>
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
              <Link href={clerkEnabled ? "/registro?redirect_url=/dashboard" : "/dashboard"}>
                {clerkEnabled ? "Solicitar acceso" : "Entrar a la demo"}{" "}
                <ArrowRight className="h-4 w-4" />
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

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="gradient-border relative w-full max-w-md rounded-2xl">
            <div className="glass rounded-2xl p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Panel operativo</p>
                  <p className="text-xs text-muted-foreground">Órdenes · Inventario · POS</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Digitaliza tu taller en minutos. Solicita acceso y un asesor te
                acompaña en la puesta en marcha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
