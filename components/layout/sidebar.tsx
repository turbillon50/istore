"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/components/nav-config";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LifeBuoy } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/40 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === "AI" ? "purple" : "default"}
                        className="h-5 px-1.5 text-[10px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/15 to-purple-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <LifeBuoy className="h-4 w-4 text-primary" />
            Plan Business
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Demo comercial — todas las funciones desbloqueadas.
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[78%] rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            3 sucursales · 28 usuarios
          </p>
        </div>
      </div>
    </aside>
  );
}
