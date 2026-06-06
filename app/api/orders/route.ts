import { NextRequest, NextResponse } from "next/server";
import { createOrder, updateOrderStatus } from "@/lib/data";
import { sendEmail, orderEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = [
  "Recibido", "Diagnóstico", "Autorización Pendiente", "En Reparación",
  "Terminado", "Entregado", "Cancelado",
];

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const client = str(body?.client);
  const device = str(body?.device);
  if (!client) return NextResponse.json({ error: "Nombre del cliente requerido" }, { status: 400 });
  if (!device) return NextResponse.json({ error: "Equipo requerido" }, { status: 400 });

  const cost = Number(body?.cost);
  try {
    const order = await createOrder({
      client,
      clientPhone: str(body?.clientPhone) || undefined,
      device,
      brand: str(body?.brand) || undefined,
      imei: str(body?.imei) || undefined,
      issue: str(body?.issue) || undefined,
      cost: Number.isFinite(cost) ? cost : 0,
      branch: str(body?.branch) || undefined,
    });

    // Correo de confirmación de orden (si el cliente dio email válido).
    const email = str(body?.clientEmail);
    let emailed = false;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const e = orderEmail({
        id: order.id, client: order.client, device: order.device,
        issue: order.issue, cost: order.cost, status: order.status,
      });
      const r = await sendEmail({ to: email, subject: e.subject, html: e.html });
      emailed = r.ok;
    }

    return NextResponse.json({ ok: true, order, emailed });
  } catch (e) {
    console.error("[api/orders POST]", e);
    return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const id = str(body?.id);
  const status = str(body?.status);
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  if (!STATUSES.includes(status))
    return NextResponse.json({ error: "estado inválido" }, { status: 400 });
  try {
    const order = await updateOrderStatus(id, status);
    if (!order) return NextResponse.json({ error: "orden no encontrada" }, { status: 404 });
    return NextResponse.json({ ok: true, order });
  } catch (e) {
    console.error("[api/orders PATCH]", e);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}
