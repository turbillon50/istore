"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  Command as CommandIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { allNavItems } from "@/components/nav-config";

export function Topbar() {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = React.useState(false);

  const current =
    allNavItems.find(
      (i) => pathname === i.href || pathname.startsWith(i.href + "/")
    )?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:px-6">
      {/* Marca compacta en móvil (la navegación vive en la bottom nav + drawer "Más") */}
      <Link href="/dashboard" className="lg:hidden" aria-label="iStore Pro">
        <Logo showText={false} size={32} />
      </Link>

      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <span>iStore Pro</span>
        <span className="text-border">/</span>
        <span className="font-medium text-foreground">{current}</span>
      </div>

      <button
        onClick={() => setCmdOpen(true)}
        className="ml-auto flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary md:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] sm:flex">
          <CommandIcon className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <Button variant="default" size="sm" className="hidden sm:flex" asChild>
        <Link href="/recepciones">
          <Plus className="h-4 w-4" /> Nueva recepción
        </Link>
      </Button>

      <ThemeToggle />

      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/notificaciones">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Link>
      </Button>

      <UserMenu />

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  );
}
