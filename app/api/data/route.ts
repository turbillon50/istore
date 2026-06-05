import { NextRequest, NextResponse } from "next/server";
import * as data from "@/lib/data";

export const dynamic = "force-dynamic";

const map: Record<string, () => Promise<unknown>> = {
  kpis: data.getKpis,
  orders: data.getOrders,
  clients: data.getClients,
  products: data.getProducts,
  notifications: data.getNotifications,
  technicians: data.getTechnicians,
  branches: data.getBranches,
  roles: data.getRoles,
  posCatalog: data.getPosCatalog,
  salesByDay: data.getSalesByDay,
  salesByMonth: data.getSalesByMonth,
  incomeByCategory: data.getIncomeByCategory,
  topParts: data.getTopParts,
};

// TODO(Clerk): cuando haya auth, exponer estas keys solo a usuarios autenticados.
const PROTECTED = new Set(["users", "cashMovements"]);

export async function GET(req: NextRequest) {
  try {
    const requested = (req.nextUrl.searchParams.get("k") ?? "").split(",").filter(Boolean);
    if (requested.some((k) => PROTECTED.has(k)))
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    const keys = requested.filter((k) => map[k]);
    if (!keys.length) return NextResponse.json({ error: "k requerido" }, { status: 400 });
    const values = await Promise.all(keys.map((k) => map[k]()));
    return NextResponse.json(Object.fromEntries(keys.map((k, i) => [k, values[i]])));
  } catch (e) {
    console.error("[api/data]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
