// =====================================================================
// iStore Pro — Correos transaccionales vía Resend (REST, sin SDK).
// Requiere RESEND_API_KEY y EMAIL_FROM (remitente con dominio verificado).
// Si faltan, no truena: registra y devuelve { skipped: true } para no
// romper el flujo (webhook / checkout) en entornos sin email configurado.
// =====================================================================

const API = "https://api.resend.com/emails";

export const emailEnabled = Boolean(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "iStore <no-reply@i-store.shop>";

type SendResult =
  | { ok: true; id: string }
  | { ok: false; skipped: true }
  | { ok: false; error: string };

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<SendResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY ausente — correo omitido:", opts.subject);
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      console.error("[email] Resend error", res.status, data);
      return { ok: false, error: data.message || `HTTP ${res.status}` };
    }
    return { ok: true, id: data.id ?? "" };
  } catch (e) {
    console.error("[email] fallo de red", e);
    return { ok: false, error: "network" };
  }
}

// ---------- Plantillas ----------
const shell = (title: string, body: string) => `<!doctype html><html lang="es"><body style="margin:0;background:#0a0a0a;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e5e5e5">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:24px">iStore<span style="color:#2563eb">Pro</span></div>
    <div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">
      <h1 style="font-size:18px;color:#fff;margin:0 0 12px">${title}</h1>
      ${body}
    </div>
    <p style="font-size:12px;color:#777;margin-top:20px;text-align:center">iStore Pro · Sistema para talleres de reparación</p>
  </div>
</body></html>`;

export function welcomeEmail(name?: string) {
  const hi = name ? `Hola ${name},` : "¡Bienvenido!";
  return {
    subject: "Bienvenido a iStore Pro 🎉",
    html: shell(
      "Tu cuenta está lista",
      `<p style="line-height:1.6;color:#cfcfcf">${hi} ya puedes administrar tu taller desde iStore Pro: órdenes, diagnósticos, inventario, punto de venta y analytics en un solo lugar.</p>
       <p style="margin-top:20px"><a href="https://i-store.shop/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">Entrar al panel</a></p>`
    ),
  };
}

export function orderEmail(o: {
  id: string;
  client?: string;
  device?: string;
  issue?: string;
  cost?: number;
  status?: string;
}) {
  const money = typeof o.cost === "number"
    ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(o.cost)
    : "—";
  const hi = o.client ? `Hola ${o.client},` : "Hola,";
  return {
    subject: `Tu orden ${o.id} en iStore Pro`,
    html: shell(
      `Orden ${o.id}`,
      `<p style="line-height:1.6;color:#cfcfcf">${hi} registramos tu equipo. Aquí los detalles:</p>
       <table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:14px">
         <tr><td style="padding:6px 0;color:#888">Equipo</td><td style="padding:6px 0;color:#fff;text-align:right">${o.device ?? "—"}</td></tr>
         <tr><td style="padding:6px 0;color:#888">Falla</td><td style="padding:6px 0;color:#fff;text-align:right">${o.issue ?? "—"}</td></tr>
         <tr><td style="padding:6px 0;color:#888">Estado</td><td style="padding:6px 0;color:#fff;text-align:right">${o.status ?? "Recibido"}</td></tr>
         <tr><td style="padding:6px 0;color:#888">Costo estimado</td><td style="padding:6px 0;color:#fff;text-align:right;font-weight:700">${money}</td></tr>
       </table>`
    ),
  };
}
