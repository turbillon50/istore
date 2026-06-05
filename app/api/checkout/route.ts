import { NextRequest, NextResponse } from "next/server";
import { createSale } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { items, method, branch } = await req.json();
    if (!Array.isArray(items) || !items.length)
      return NextResponse.json({ error: "items requeridos" }, { status: 400 });
    const sale = await createSale(items, method ?? "Efectivo", branch);
    return NextResponse.json({ ok: true, sale });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
