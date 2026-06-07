"use client";

import * as React from "react";
import {
  Smartphone,
  Headphones,
  Watch,
  Tablet,
  ShieldCheck,
  Zap,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/catalog";

// Placeholder elegante por categoría (gradiente + icono). Se usa SOLO si la
// imagen real falla: nunca mostramos una imagen rota.
const STYLES: Record<
  ProductCategory,
  { from: string; to: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  Smartphones: { from: "from-blue-500/30", to: "to-indigo-700/30", Icon: Smartphone },
  Audífonos: { from: "from-fuchsia-500/30", to: "to-purple-700/30", Icon: Headphones },
  Smartwatch: { from: "from-emerald-500/30", to: "to-teal-700/30", Icon: Watch },
  Tablets: { from: "from-sky-500/30", to: "to-cyan-700/30", Icon: Tablet },
  Fundas: { from: "from-rose-500/30", to: "to-pink-700/30", Icon: ShieldCheck },
  Cargadores: { from: "from-amber-500/30", to: "to-orange-700/30", Icon: Zap },
};

export function ProductMedia({
  src,
  alt,
  category,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  category: ProductCategory;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const style = STYLES[category] ?? {
    from: "from-secondary",
    to: "to-muted",
    Icon: Package,
  };

  if (failed) {
    const { Icon } = style;
    return (
      <div
        className={cn(
          "grid place-items-center bg-gradient-to-br",
          style.from,
          style.to,
          className
        )}
      >
        <Icon className="h-1/4 w-1/4 text-foreground/40" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-secondary/40", className)}>
      {!loaded && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-gradient-to-br",
            style.from,
            style.to
          )}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-all duration-700",
          loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
        )}
      />
    </div>
  );
}
