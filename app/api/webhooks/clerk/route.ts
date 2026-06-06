import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";
import { sendEmail, welcomeEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Verifica la firma svix (estándar de Clerk) SIN el SDK svix:
// signedContent = `${id}.${timestamp}.${body}` firmado con HMAC-SHA256
// usando el secreto base64 (quitando el prefijo "whsec_").
function verify(secret: string, headers: Headers, body: string): boolean {
  const id = headers.get("svix-id");
  const ts = headers.get("svix-timestamp");
  const sigHeader = headers.get("svix-signature");
  if (!id || !ts || !sigHeader) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", key)
    .update(`${id}.${ts}.${body}`)
    .digest("base64");

  // El header trae una o varias firmas "v1,<sig>" separadas por espacio.
  for (const part of sigHeader.split(" ")) {
    const sig = part.split(",")[1];
    if (!sig) continue;
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return false;
}

function primaryEmail(data: any): string | null {
  const list = data?.email_addresses;
  if (!Array.isArray(list) || !list.length) return null;
  const primaryId = data.primary_email_address_id;
  const found = list.find((e: any) => e.id === primaryId) ?? list[0];
  return found?.email_address ?? null;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook no configurado" }, { status: 503 });
  }

  const body = await req.text();
  if (!verify(secret, req.headers, body)) {
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  let evt: { type: string; data: any };
  try {
    evt = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    await ensureSchema();
    const data = evt.data ?? {};

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const email = primaryEmail(data);
      if (!email) return NextResponse.json({ ok: true, skipped: "sin email" });
      const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || email;
      // Primer usuario = dueño (admin); el resto entra como staff por defecto.
      const [{ n }] = (await sql`SELECT count(*)::int AS n FROM users`) as { n: number }[];
      const role = evt.type === "user.created" && n === 0 ? "Administrador" : "Vendedor";
      await sql`INSERT INTO users (email, name, role, branch, status)
        VALUES (${email}, ${name}, ${role}, 'Centro', 'Activo')
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`;

      if (evt.type === "user.created") {
        const w = welcomeEmail(data.first_name || name);
        await sendEmail({ to: email, subject: w.subject, html: w.html });
      }
    } else if (evt.type === "user.deleted") {
      const email = primaryEmail(data);
      if (email) await sql`UPDATE users SET status = 'Inactivo' WHERE email = ${email}`;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhooks/clerk]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
