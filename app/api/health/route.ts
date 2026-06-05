import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb) return NextResponse.json({ ok: false, db: "sin DATABASE_URL" }, { status: 500 });
  try {
    await ensureSchema();
    const [r] = (await sql`SELECT
      (SELECT count(*) FROM orders)::int AS orders,
      (SELECT count(*) FROM clients)::int AS clients,
      (SELECT count(*) FROM products)::int AS products`) as any[];
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
