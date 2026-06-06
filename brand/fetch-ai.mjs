// Descarga el ícono generado por Higgsfield (IA) y lo procesa a los tamaños PWA.
// Se ejecuta en el build de Vercel (que SÍ tiene salida a Higgsfield/CloudFront).
// Es tolerante a fallos: si la descarga falla, conserva los assets vectoriales ya presentes.
// sharp se carga dinámico: si el binario nativo falla, el build NO se rompe
// (se conservan los íconos ya presentes en /public).
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch (e) {
  console.warn("[brand] sharp no disponible, conservo assets existentes:", e?.message);
  process.exit(0);
}
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, "..", "public");
mkdirSync(pub, { recursive: true });

// Fuente: resultado de Higgsfield (nano_banana). Cambia esta URL para usar otra variante.
const AI_ICON_URL =
  process.env.AI_ICON_URL ||
  "https://d8j0ntlcm91z4.cloudfront.net/user_3DDb66hXpSaWG4DmoX3Ae5V2dqt/hf_20260604_014424_ef6b2b56-0f6b-40f7-9e46-5c5900c9135e.png";

async function main() {
  let buf;
  try {
    const res = await fetch(AI_ICON_URL, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) throw new Error("respuesta demasiado pequeña");
  } catch (e) {
    console.warn(`⚠️  No se pudo descargar el ícono IA (${e.message}). Se conservan los assets vectoriales.`);
    return;
  }

  const base = sharp(buf).resize(1024, 1024, { fit: "cover" });

  for (const s of [192, 256, 384, 512]) {
    await base.clone().resize(s, s).png().toFile(join(pub, `icon-${s}.png`));
  }
  await base.clone().resize(1024, 1024).png().toFile(join(pub, "icon-1024.png"));
  await base.clone().resize(180, 180).flatten({ background: "#0A0A0A" }).png().toFile(join(pub, "apple-touch-icon.png"));

  // Maskable con padding seguro sobre fondo de marca
  const inner = await base.clone().resize(380, 380).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0A0A0A" } })
    .composite([{ input: inner, gravity: "center" }])
    .png()
    .toFile(join(pub, "icon-maskable-512.png"));

  console.log("✓ Ícono IA de Higgsfield integrado en los assets PWA.");
}

main();
