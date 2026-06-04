// Rasteriza los assets de marca (SVG → PNG) con sharp.
// Uso: node brand/generate-assets.mjs
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pub = join(root, "public");
mkdirSync(pub, { recursive: true });

const iconSvg = readFileSync(join(__dirname, "icon-master.svg"));
const ogSvg = readFileSync(join(__dirname, "og-master.svg"));

// Squircle PNGs (transparent corners)
const sizes = [192, 256, 384, 512, 1024];
for (const s of sizes) {
  await sharp(iconSvg, { density: 384 })
    .resize(s, s)
    .png()
    .toFile(join(pub, `icon-${s}.png`));
}

// Apple touch icon (180, opaque bg for iOS)
await sharp(iconSvg, { density: 384 })
  .resize(180, 180)
  .flatten({ background: "#0A0A0A" })
  .png()
  .toFile(join(pub, "apple-touch-icon.png"));

// Maskable: icon centered on full-bleed background with safe padding
const chip = await sharp(iconSvg, { density: 384 }).resize(360, 360).png().toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#0A0A0A" },
})
  .composite([{ input: chip, gravity: "center" }])
  .png()
  .toFile(join(pub, "icon-maskable-512.png"));

// Favicon-sized
await sharp(iconSvg, { density: 256 }).resize(48, 48).png().toFile(join(pub, "favicon-48.png"));

// OG image
await sharp(ogSvg, { density: 144 }).resize(1200, 630).png().toFile(join(pub, "og.png"));

console.log("✓ Brand assets generados en /public");
