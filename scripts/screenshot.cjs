const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium").default;

const BASE = process.env.BASE || "http://localhost:3120";

const shots = [
  { path: "/", name: "01-landing", w: 1440, h: 900 },
  { path: "/dashboard", name: "02-dashboard", w: 1440, h: 1100 },
  { path: "/ordenes", name: "03-ordenes", w: 1440, h: 1000 },
  { path: "/ordenes/OS-41000", name: "04-orden-detalle", w: 1440, h: 1150 },
  { path: "/diagnosticos", name: "05-diagnosticos", w: 1440, h: 1050 },
  { path: "/inventario", name: "06-inventario", w: 1440, h: 1000 },
  { path: "/clientes", name: "07-clientes", w: 1440, h: 1000 },
  { path: "/ventas", name: "08-pos", w: 1440, h: 1000 },
  { path: "/caja", name: "09-caja", w: 1440, h: 950 },
  { path: "/analytics", name: "10-analytics", w: 1440, h: 1200 },
  { path: "/asistente", name: "11-istore-ai", w: 1440, h: 1000 },
  { path: "/sucursales", name: "12-sucursales", w: 1440, h: 1000 },
  // mobile
  { path: "/dashboard", name: "13-mobile-dashboard", w: 390, h: 844, mobile: true },
  { path: "/ventas", name: "14-mobile-pos", w: 390, h: 844, mobile: true },
];

(async () => {
  const execPath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
    executablePath: execPath,
    headless: "shell",
  });

  const fs = require("fs");
  fs.mkdirSync("shots", { recursive: true });

  for (const s of shots) {
    const page = await browser.newPage();
    await page.setViewport({
      width: s.w,
      height: s.h,
      deviceScaleFactor: 2,
      isMobile: !!s.mobile,
      hasTouch: !!s.mobile,
    });
    try {
      await page.goto(BASE + s.path, { waitUntil: "networkidle0", timeout: 30000 });
    } catch (e) {
      await page.goto(BASE + s.path, { waitUntil: "domcontentloaded", timeout: 30000 });
    }
    await new Promise((r) => setTimeout(r, 1400)); // dejar animar charts
    await page.screenshot({ path: `shots/${s.name}.png` });
    console.log("✓", s.name);
    await page.close();
  }

  await browser.close();
  console.log("DONE");
})().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
