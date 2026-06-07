"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { User, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

// Inlined en build: decide si Clerk está disponible (evita usar hooks/UI de
// Clerk cuando no hay ClerkProvider).
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// Acceso de cuenta DISCRETO (icono), nunca un formulario plantado en la home.
function AccountButton() {
  if (!clerkEnabled) {
    return (
      <Button asChild variant="ghost" size="icon" aria-label="Mi cuenta">
        <Link href="/onboarding">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }
  return (
    <>
      <SignedIn>
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} userProfileMode="modal" />
      </SignedIn>
      <SignedOut>
        <Button asChild variant="ghost" size="icon" aria-label="Iniciar sesión">
          <Link href="/login">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </SignedOut>
    </>
  );
}

export function StoreHeader({ hasAdminKey = false }: { hasAdminKey?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link href="/" aria-label="iStore — inicio">
          <Logo size={34} tagline="Celulares & Reparación" />
        </Link>
        <div className="flex items-center gap-1">
          {hasAdminKey && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Panel"
              className="opacity-70 hover:opacity-100"
            >
              <Link href="/admin">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <ThemeToggle />
          <AccountButton />
        </div>
      </div>
    </header>
  );
}
