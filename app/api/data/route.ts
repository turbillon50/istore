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
  cashMovements: data.getCashMovements,
  users: data.getUsers,
  roles: data.getRoles,
  posCatalog: data.getPosCatalog,
  salesByDay: data.getSalesByDay,
  salesByMonth: data.getSalesByMonth,
  incomeByCategory: data.getIncomeByCategory,
  topParts: data.getTopParts,
};

export async function GET(req: NextRequest) {
  try {
    const keys = (req.nextUrl.searchParams.get("k") ?? "").split(",").filter((k) => map[k]);
    if (!keys.length) return NextResponse.json({ error: "k requerido" }, { status: 400 });
    const values = await Promise.all(keys.map((k) => map[k]()));
    return NextResponse.json(Object.fromEntries(keys.map((k, i) => [k, values[i]])));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
