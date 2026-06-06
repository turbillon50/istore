"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import {
  ShieldCheck,
  Share,
  PlusSquare,
  MoreVertical,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { AccessRole } from "@/lib/access";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function AccessInstall({ role }: { role: AccessRole }) {
  const router = useRouter();
  const [redirecting, setRedirecting] = React.useState(true);

  React.useEffect(() => {
    // Abierta como app instalada -> directo al panel. La cookie de acceso ya
    // viene puesta por el middleware, así que /admin entra sin login.
    if (isStandalone()) {
      router.replace("/admin");
      return;
    }
    setRedirecting(false);
  }, [router]);

  if (redirecting) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const roleLabel = role === "admin" ? "Administrador total" : "Staff";

  return (
    <div className="noise relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 animate-aurora rounded-full bg-primary/20 blur-[140px]" />

      <Card className="relative z-10 w-full max-w-md border-border bg-card/70 p-7 shadow-2xl backdrop-blur-2xl">
        <div className="mb-5 flex items-center gap-3">
          <Logo size={36} showText={false} />
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Acceso al panel</h1>
            <Badge variant="secondary" className="mt-1 gap-1">
              <ShieldCheck className="h-3 w-3" /> {roleLabel}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Tu acceso quedó guardado en este dispositivo por 1 año. Instala el
          panel como app para entrar con un toque, sin volver a pegar la liga.
        </p>

        <div className="mt-5 space-y-4 text-sm">
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <p className="mb-2 font-medium">📱 iPhone / iPad (Safari)</p>
            <ol className="space-y-1.5 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Share className="h-4 w-4 shrink-0 text-primary" /> Toca{" "}
                <span className="font-medium text-foreground">Compartir</span>
              </li>
              <li className="flex items-center gap-2">
                <PlusSquare className="h-4 w-4 shrink-0 text-primary" /> Elige{" "}
                <span className="font-medium text-foreground">
                  Agregar a inicio
                </span>
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <p className="mb-2 font-medium">🤖 Android (Chrome)</p>
            <ol className="space-y-1.5 text-muted-foreground">
              <li className="flex items-center gap-2">
                <MoreVertical className="h-4 w-4 shrink-0 text-primary" /> Abre el
                menú (⋮)
              </li>
              <li className="flex items-center gap-2">
                <PlusSquare className="h-4 w-4 shrink-0 text-primary" /> Elige{" "}
                <span className="font-medium text-foreground">Instalar app</span>
              </li>
            </ol>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => router.push("/admin")}
        >
          Entrar al panel ahora <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Mantén esta liga privada: quien la tenga entra como {roleLabel}.
        </p>
      </Card>
    </div>
  );
}
