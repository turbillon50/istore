"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Inlined en build: define qué variante se renderiza.
const enabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function UserMenu() {
  if (enabled) return <ClerkUserMenu />;
  return <DemoUserMenu />;
}

function ClerkUserMenu() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-2 pl-1">
      <UserButton
        appearance={{ elements: { avatarBox: "h-8 w-8" } }}
        userProfileMode="modal"
      />
      <div className="hidden text-left leading-tight md:block">
        <p className="text-sm font-medium">
          {user?.firstName ?? user?.username ?? "Mi cuenta"}
        </p>
        <p className="text-[11px] text-muted-foreground">Administrador</p>
      </div>
    </div>
  );
}

function DemoUserMenu() {
  return (
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
  );
}
