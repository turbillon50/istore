"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  Command as CommandIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CommandPalette } from "./command-palette";
import { MobileNav } from "./mobile-nav";
import { allNavItems } from "@/components/nav-config";

export function Topbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const current =
    allNavItems.find(
      (i) => pathname === i.href || pathname.startsWith(i.href + "/")
    )?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

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

      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      )}

      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/notificaciones">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback>LT</AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight md:block">
              <p className="text-sm font-medium">Luis de la Torre</p>
              <p className="text-[11px] text-muted-foreground">Administrador</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/configuracion">Configuración</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/usuarios">Usuarios y permisos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Sucursal: <Badge variant="secondary" className="ml-auto">Centro</Badge>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-destructive">
            <Link href="/">Cerrar sesión</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
