"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { allNavItems } from "@/components/nav-config";
import type { Order, Client } from "@/lib/mock-data";
import { Search, CornerDownLeft } from "lucide-react";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);

  React.useEffect(() => {
    if (!open || orders.length) return;
    fetch("/api/data?k=orders,clients")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? []);
        setClients(d.clients ?? []);
      })
      .catch(() => {});
  }, [open, orders.length]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Buscador global</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Buscar páginas, órdenes, clientes…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              Sin resultados.
            </Command.Empty>

            <Command.Group heading="Navegación">
              {allNavItems.map((item) => (
                <Command.Item
                  key={item.href}
                  value={`nav ${item.label}`}
                  onSelect={() => go(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                  <CornerDownLeft className="ml-auto h-3 w-3 text-muted-foreground opacity-0 aria-selected:opacity-100" />
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Órdenes recientes">
              {orders.slice(0, 5).map((o) => (
                <Command.Item
                  key={o.id}
                  value={`orden ${o.id} ${o.client} ${o.device}`}
                  onSelect={() => go(`/ordenes/${o.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
                >
                  <span className="font-mono text-xs text-primary">#{o.id}</span>
                  <span>{o.client}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {o.device}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Clientes">
              {clients.slice(0, 4).map((c) => (
                <Command.Item
                  key={c.id}
                  value={`cliente ${c.name} ${c.phone}`}
                  onSelect={() => go("/clientes")}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
                >
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {c.phone}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
