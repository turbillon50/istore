// =====================================================================
// iStore Pro — Schema idempotente + seed (solo si las tablas están vacías)
// Si las tablas de Neon ya existen con datos (auditoría), esto es no-op.
// =====================================================================
import { sql } from "./db";

let ready: Promise<void> | null = null;

async function migrate() {
  await sql`CREATE TABLE IF NOT EXISTS clients (
    id text PRIMARY KEY, name text NOT NULL, phone text, email text,
    total_spent numeric DEFAULT 0, visits int DEFAULT 0, devices int DEFAULT 0,
    tag text, since timestamptz, notes text)`;
  await sql`CREATE TABLE IF NOT EXISTS orders (
    id text PRIMARY KEY, client text, client_phone text, device text, brand text,
    imei text, issue text, technician text, cost numeric DEFAULT 0, status text,
    priority text, branch text, created_at timestamptz DEFAULT now(),
    promise_at timestamptz, category text)`;
  await sql`CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY, name text, category text, sku text, stock int DEFAULT 0,
    min_stock int DEFAULT 8, cost numeric, price numeric, supplier text, branch text)`;
  await sql`CREATE TABLE IF NOT EXISTS technicians (
    name text PRIMARY KEY, repairs int, rating numeric, efficiency int, branch text)`;
  await sql`CREATE TABLE IF NOT EXISTS branches (
    name text PRIMARY KEY, sales numeric, orders int, technicians int, growth numeric)`;
  await sql`CREATE TABLE IF NOT EXISTS notifications (
    id text PRIMARY KEY, title text, body text, channel text,
    time timestamptz DEFAULT now(), read boolean DEFAULT false, type text)`;
  await sql`CREATE TABLE IF NOT EXISTS cash_movements (
    id text PRIMARY KEY, concept text, type text, method text,
    amount numeric, time timestamptz DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS users (
    email text PRIMARY KEY, name text, role text, branch text, status text)`;
  await sql`CREATE TABLE IF NOT EXISTS roles (
    name text PRIMARY KEY, users int, permissions text)`;
  await sql`CREATE TABLE IF NOT EXISTS pos_catalog (
    id text PRIMARY KEY, name text, price numeric, category text)`;
  await sql`CREATE TABLE IF NOT EXISTS sales (
    id bigserial PRIMARY KEY, items jsonb NOT NULL, total numeric NOT NULL,
    method text, branch text, created_at timestamptz DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS sales_daily (
    ord int PRIMARY KEY, label text, ventas numeric, utilidad numeric)`;
  await sql`CREATE TABLE IF NOT EXISTS sales_monthly (
    ord int PRIMARY KEY, label text, ventas numeric, equipos int)`;
  await sql`CREATE TABLE IF NOT EXISTS income_categories (
    name text PRIMARY KEY, value numeric, color text)`;
  await sql`CREATE TABLE IF NOT EXISTS top_parts (
    name text PRIMARY KEY, sold int, revenue numeric)`;

  // Saneo idempotente: valores numeric 'NaN' (heredados de datos previos)
  // envenenan sum() y rompen los KPIs. Los normalizamos a NULL.
  await sql`UPDATE cash_movements SET amount = NULL WHERE amount = 'NaN'::numeric`;
  await sql`UPDATE sales SET total = 0 WHERE total = 'NaN'::numeric`;
}

async function seedIfEmpty() {
  // Seed de demo SOLO bajo flag explícita. En producción nunca se re-siembra
  // mock data aunque las tablas estén vacías.
  if (process.env.SEED_DEMO !== "true") return;
  const { clients, orders, products, technicians, branches, notifications,
    cashMovements, users, roles, posCatalog, salesByDay, salesByMonth,
    incomeByCategory, topParts } = await import("./mock-data");
  const [{ n }] = (await sql`SELECT count(*)::int AS n FROM clients`) as { n: number }[];
  if (n > 0) return;
  for (const c of clients)
    await sql`INSERT INTO clients VALUES (${c.id},${c.name},${c.phone},${c.email},${c.totalSpent},${c.visits},${c.devices},${c.tag},${c.since},${c.notes ?? null}) ON CONFLICT DO NOTHING`;
  for (const o of orders)
    await sql`INSERT INTO orders VALUES (${o.id},${o.client},${o.clientPhone},${o.device},${o.brand},${o.imei},${o.issue},${o.technician},${o.cost},${o.status},${o.priority},${o.branch},${o.createdAt},${o.promiseAt},${o.category}) ON CONFLICT DO NOTHING`;
  for (const p of products)
    await sql`INSERT INTO products VALUES (${p.id},${p.name},${p.category},${p.sku},${p.stock},${p.minStock},${p.cost},${p.price},${p.supplier},${p.branch}) ON CONFLICT DO NOTHING`;
  for (const t of technicians)
    await sql`INSERT INTO technicians VALUES (${t.name},${t.repairs},${t.rating},${t.efficiency},${t.branch}) ON CONFLICT DO NOTHING`;
  for (const b of branches)
    await sql`INSERT INTO branches VALUES (${b.name},${b.sales},${b.orders},${b.technicians},${b.growth}) ON CONFLICT DO NOTHING`;
  for (const x of notifications)
    await sql`INSERT INTO notifications VALUES (${x.id},${x.title},${x.body},${x.channel},${x.time},${x.read},${x.type}) ON CONFLICT DO NOTHING`;
  for (const m of cashMovements)
    await sql`INSERT INTO cash_movements VALUES (${m.id},${m.concept},${m.type},${m.method},${m.amount},${m.time}) ON CONFLICT DO NOTHING`;
  for (const u of users)
    await sql`INSERT INTO users VALUES (${u.email},${u.name},${u.role},${u.branch},${u.status}) ON CONFLICT DO NOTHING`;
  for (const r of roles)
    await sql`INSERT INTO roles VALUES (${r.name},${r.users},${r.permissions}) ON CONFLICT DO NOTHING`;
  for (const p of posCatalog)
    await sql`INSERT INTO pos_catalog VALUES (${p.id},${p.name},${p.price},${p.category}) ON CONFLICT DO NOTHING`;
  let i = 0;
  for (const d of salesByDay)
    await sql`INSERT INTO sales_daily VALUES (${i++},${d.label},${d.ventas},${d.utilidad}) ON CONFLICT DO NOTHING`;
  i = 0;
  for (const m of salesByMonth)
    await sql`INSERT INTO sales_monthly VALUES (${i++},${m.label},${m.ventas},${m.equipos}) ON CONFLICT DO NOTHING`;
  for (const c of incomeByCategory)
    await sql`INSERT INTO income_categories VALUES (${c.name},${c.value},${c.color}) ON CONFLICT DO NOTHING`;
  for (const t of topParts)
    await sql`INSERT INTO top_parts VALUES (${t.name},${t.sold},${t.revenue}) ON CONFLICT DO NOTHING`;
}

// Siembra idempotente de actividad de HOY (zona America/Mexico_City) para que
// los KPIs "Ventas del día" / "Utilidad del día" muestren cifras reales > 0 en
// la demo comercial. Inserta UNA venta plausible en las tablas reales
// (sales + cash_movements) SOLO si no existe ningún Ingreso registrado hoy.
async function seedToday() {
  // El criterio DEBE coincidir con el del KPI (amount no nulo > 0); si solo
  // existe un Ingreso con amount NULL hoy, el KPI mostraría 0 y aun así
  // debemos sembrar una venta real para la demo.
  const [row] = (await sql`SELECT coalesce(sum(amount),0)::float8 AS ingresos
    FROM cash_movements
    WHERE type='Ingreso' AND amount IS NOT NULL AND amount != 'NaN'::numeric
      AND (time AT TIME ZONE 'America/Mexico_City')::date = (now() AT TIME ZONE 'America/Mexico_City')::date`) as any[];
  if (row && Number(row.ingresos) > 0) return; // ya hay ventas reales hoy: no tocar nada

  // Venta demo plausible: cambio de pantalla iPhone + mica.
  const items = [
    { id: "screen-ip13", name: "Pantalla iPhone 13", price: 2200, qty: 1 },
    { id: "mica-premium", name: "Mica de cristal templado", price: 300, qty: 1 },
  ];
  const total = items.reduce((sToday, it) => sToday + it.price * it.qty, 0);

  const [sale] = (await sql`INSERT INTO sales (items, total, method, branch)
    VALUES (${JSON.stringify(items)}::jsonb, ${total}, 'Efectivo', 'Centro')
    RETURNING id`) as any[];
  await sql`INSERT INTO cash_movements (id, concept, type, method, amount)
    VALUES (${"c-demo-" + sale.id}, ${"Venta POS #" + sale.id}, 'Ingreso', 'Efectivo', ${total})
    ON CONFLICT DO NOTHING`;
}

export function ensureSchema() {
  if (!ready) ready = migrate().then(seedIfEmpty).then(seedToday);
  return ready;
}
