"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

export function LoginCard({ clerkEnabled = false }: { clerkEnabled?: boolean }) {
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"login" | "signup">("login");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clerkEnabled) {
      // Auth real: el formulario vive en Clerk (/login | /registro).
      router.push(mode === "login" ? "/login" : "/registro");
      return;
    }
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 900);
  };

  return (
    <Card className="w-full max-w-sm border-border bg-card/70 p-7 shadow-2xl backdrop-blur-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Ingresa para administrar tu taller."
            : "Empieza tu prueba gratuita de 14 días."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            className="pl-9"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={show ? "text" : "password"}
            placeholder="Contraseña"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="px-9"
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {mode === "login" && (
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" defaultChecked className="accent-primary" />
              Recordarme
            </label>
            <button type="button" className="text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        o continúa con
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push(clerkEnabled ? "/login" : "/dashboard")}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
          />
        </svg>
        Continuar con Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="font-medium text-primary hover:underline"
        >
          {mode === "login" ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </Card>
  );
}
