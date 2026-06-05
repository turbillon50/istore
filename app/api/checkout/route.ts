import { NextRequest, NextResponse } from "next/server";
import { createSale } from "@/lib/data";

export const dynamic = "force-dynamic";

const PAY_METHODS = ["Efectivo", "Stripe", "Transferencia", "Mercado Pago", "Terminal", "Tarjeta"];

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const { items, method, branch } = body ?? {};
    if (!Array.isArray(items) || !items.length)
      return NextResponse.json({ error: "items requeridos" }, { status: 400 });
    // Validación estricta: id string y qty entero 1-999. El precio NUNCA
    // se toma del cliente — se resuelve en DB dentro de createSale.
    for (const it of items) {
      if (!it || typeof it.id !== "string" || !it.id.trim())
        return NextResponse.json({ error: "item con id inválido" }, { status: 400 });
      if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 999)
        return NextResponse.json({ error: `qty inválida para ${it.id} (entero 1-999)` }, { status: 400 });
    }
    const payMethod = typeof method === "string" && PAY_METHODS.includes(method) ? method : "Efectivo";
    const result = await createSale(
      items.map((it: any) => ({ id: String(it.id), qty: it.qty })),
      payMethod,
      typeof branch === "string" ? branch : undefined
    );
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, sale: result });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "Error interno al procesar la venta" }, { status: 500 });
  }
}
