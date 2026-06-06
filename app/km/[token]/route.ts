import { NextResponse } from "next/server";
import { tokenRole } from "@/lib/access";

export const dynamic = "force-dynamic";

// Manifest propio de la liga instalable. start_url = /<TOKEN> para que al
// abrir la PWA se re-instale la cookie y se entre directo al panel.
// Solo responde si el token es válido (si no, 404 — no filtra nada).
export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const role = tokenRole(params.token);
  if (!role) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const name = role === "admin" ? "iStore Admin" : "iStore Staff";
  const manifest = {
    name,
    short_name: name,
    description: "Acceso instalable al panel de administración de iStore.",
    start_url: `/${params.token}`,
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    lang: "es-MX",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-store",
    },
  });
}
