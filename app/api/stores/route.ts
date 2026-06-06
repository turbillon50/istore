import { NextRequest, NextResponse } from "next/server";
import { createStore, getStores } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function GET() {
  try {
    return NextResponse.json({ stores: await getStores() });
  } catch (e) {
    console.error("[api/stores GET]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const name = str(body?.name);
  if (!name) return NextResponse.json({ error: "Nombre de la tienda requerido" }, { status: 400 });
  try {
    const result = await createStore({
      name,
      email: str(body?.email) || undefined,
      phone: str(body?.phone) || undefined,
      address: str(body?.address) || undefined,
      plan: str(body?.plan) || undefined,
      // Cuenta de pago por tienda (MP/Stripe Connect llegan después).
      paymentProvider: str(body?.paymentProvider) || undefined,
      paymentAccount: str(body?.paymentAccount) || undefined,
      ownerEmail: str(body?.ownerEmail) || undefined,
    });
    if ("error" in result) return NextResponse.json(result, { status: 400 });
    return NextResponse.json({ ok: true, store: result });
  } catch (e) {
    console.error("[api/stores POST]", e);
    return NextResponse.json({ error: "No se pudo crear la tienda" }, { status: 500 });
  }
}
