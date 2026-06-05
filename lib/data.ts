// =====================================================================
// iStore Pro — Capa de datos real (Neon). Server-only.
// Devuelve las mismas formas que consumían las vistas del demo.
// =====================================================================
import { sql } from "./db";
import { ensureSchema } from "./schema";
import type { Client, Order, Product, NotificationItem } from "./types";

const num = (v: unknown) => Number(v ?? 0);

export async function getClients(): Promise<Client[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM clients ORDER BY total_spent DESC`;
  return (rows as any[]).map((r) => ({
    id: r.id, name: r.name, phone: r.phone, email: r.email,
    totalSpent: num(r.total_spent), visits: r.visits, devices: r.devices,
    tag: r.tag, since: new Date(r.since).toISOString(), notes: r.notes ?? undefined,
  }));
}

function mapOrder(r: any): Order {
  return {
    id: r.id, client: r.client, clientPhone: r.client_phone, device: r.device,
    brand: r.brand, imei: r.imei, issue: r.issue, technician: r.technician,
    cost: num(r.cost), status: r.status, priority: r.priority, branch: r.branch,
    createdAt: new Date(r.created_at).toISOString(),
    promiseAt: new Date(r.promise_at).toISOString(), category: r.category,
  };
}

export async function getOrders(): Promise<Order[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return (rows as any[]).map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ensureSchema();
  const rows = (await sql`SELECT * FROM orders WHERE id = ${id}`) as any[];
  return rows.length ? mapOrder(rows[0]) : null;
}

export async function getProducts(): Promise<Product[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM products ORDER BY id`;
  return (rows as any[]).map((r) => ({
    id: r.id, name: r.name, category: r.category, sku: r.sku, stock: r.stock,
    minStock: r.min_stock, cost: num(r.cost), price: num(r.price),
    supplier: r.supplier, branch: r.branch,
  }));
}

export async function getNotifications(): Promise<NotificationItem[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM notifications ORDER BY time DESC`;
  return (rows as any[]).map((r) => ({
    id: r.id, title: r.title, body: r.body, channel: r.channel,
    time: new Date(r.time).toISOString(), read: r.read, type: r.type,
  }));
}

export async function getTechnicians() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM technicians ORDER BY repairs DESC`;
  return (rows as any[]).map((r) => ({
    name: r.name, repairs: r.repairs, rating: num(r.rating),
    efficiency: r.efficiency, branch: r.branch,
  }));
}

export async function getBranches() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM branches ORDER BY sales DESC`;
  return (rows as any[]).map((r) => ({
    name: r.name, sales: num(r.sales), orders: r.orders,
    technicians: r.technicians, growth: num(r.growth),
  }));
}

export async function getCashMovements() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM cash_movements ORDER BY time DESC`;
  return (rows as any[]).map((r) => ({
    id: r.id, concept: r.concept, type: r.type, method: r.method,
    amount: num(r.amount), time: new Date(r.time).toISOString(),
  }));
}

export async function getUsers() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM users ORDER BY name`;
  return (rows as any[]).map((r) => ({
    name: r.name, email: r.email, role: r.role, branch: r.branch, status: r.status,
  }));
}

export async function getRoles() {
  await ensureSchema();
  return (await sql`SELECT * FROM roles ORDER BY users DESC`) as {
    name: string; users: number; permissions: string;
  }[];
}

export async function getPosCatalog() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM pos_catalog ORDER BY id`;
  return (rows as any[]).map((r) => ({
    id: r.id, name: r.name, price: num(r.price), category: r.category,
  }));
}

export async function getSalesByDay() {
  await ensureSchema();
  const rows = await sql`SELECT label, ventas, utilidad FROM sales_daily ORDER BY ord`;
  return (rows as any[]).map((r) => ({ label: r.label, ventas: num(r.ventas), utilidad: num(r.utilidad) }));
}

export async function getSalesByMonth() {
  await ensureSchema();
  const rows = await sql`SELECT label, ventas, equipos FROM sales_monthly ORDER BY ord`;
  return (rows as any[]).map((r) => ({ label: r.label, ventas: num(r.ventas), equipos: r.equipos }));
}

export async function getIncomeByCategory() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM income_categories ORDER BY value DESC`;
  return (rows as any[]).map((r) => ({ name: r.name, value: num(r.value), color: r.color }));
}

export async function getTopParts() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM top_parts ORDER BY revenue DESC`;
  return (rows as any[]).map((r) => ({ name: r.name, sold: r.sold, revenue: num(r.revenue) }));
}

export async function getKpis() {
  await ensureSchema();
  const [o] = (await sql`SELECT
      count(*) FILTER (WHERE status NOT IN ('Entregado','Cancelado'))::int AS devices_in_shop,
      count(*) FILTER (WHERE status = 'En Reparación')::int AS active_repairs,
      count(*) FILTER (WHERE status NOT IN ('Terminado','Entregado','Cancelado'))::int AS open_tickets,
      count(*) FILTER (WHERE status = 'Entregado')::int AS delivered,
      count(*)::int AS total_orders
    FROM orders`) as any[];
  const [c] = (await sql`SELECT count(*)::int AS clients FROM clients`) as any[];
  const [p] = (await sql`SELECT coalesce(sum(stock),0)::int AS parts FROM products`) as any[];
  const [m] = (await sql`SELECT
      coalesce(sum(amount) FILTER (WHERE type='Ingreso'),0) AS sales_today,
      coalesce(sum(amount) FILTER (WHERE type='Ingreso'),0) - coalesce(sum(amount) FILTER (WHERE type='Egreso'),0) AS profit_today
    FROM cash_movements
    WHERE (time AT TIME ZONE 'America/Mexico_City')::date = (now() AT TIME ZONE 'America/Mexico_City')::date
      AND amount IS NOT NULL`) as any[];
  const [y] = (await sql`SELECT coalesce(sum(ventas),0) AS annual FROM sales_monthly`) as any[];
  return {
    devicesInShop: o.devices_in_shop, activeRepairs: o.active_repairs,
    salesToday: num(m.sales_today), profitToday: num(m.profit_today),
    partsAvailable: p.parts, clients: c.clients, openTickets: o.open_tickets,
    delivered: o.delivered, annualSales: num(y.annual), totalOrders: o.total_orders,
  };
}

// ------- Mutaciones (POS / caja / órdenes) -------
// El precio SIEMPRE se resuelve en DB (pos_catalog, fallback products).
// Devuelve { error } si algún id no existe; el total se calcula en servidor.
export async function createSale(
  items: { id: string; qty: number }[],
  method: string,
  branch?: string
): Promise<{ id: number; total: number; createdAt: string } | { error: string }> {
  await ensureSchema();
  const ids = items.map((i) => i.id);
  const catalogRows = (await sql`SELECT id, name, price FROM pos_catalog WHERE id = ANY(${ids})`) as any[];
  const productRows = (await sql`SELECT id, name, price FROM products WHERE id = ANY(${ids})`) as any[];
  const priceMap = new Map<string, { name: string; price: number }>();
  for (const r of [...productRows, ...catalogRows]) priceMap.set(r.id, { name: r.name, price: num(r.price) });

  const resolved: { id: string; name: string; price: number; qty: number }[] = [];
  for (const it of items) {
    const found = priceMap.get(it.id);
    if (!found) return { error: `Producto no existe: ${it.id}` };
    if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 999) return { error: `Cantidad inválida para ${it.id}` };
    resolved.push({ id: it.id, name: found.name, price: found.price, qty: it.qty });
  }
  const total = resolved.reduce((s, it) => s + it.price * it.qty, 0);
  if (!Number.isFinite(total)) return { error: "Total inválido" };

  const [row] = (await sql`INSERT INTO sales (items, total, method, branch)
    VALUES (${JSON.stringify(resolved)}::jsonb, ${total}, ${method}, ${branch ?? "Centro"})
    RETURNING id, total, created_at`) as any[];
  await sql`INSERT INTO cash_movements (id, concept, type, method, amount)
    VALUES (${"c-" + row.id}, ${"Venta POS #" + row.id}, 'Ingreso', ${method}, ${total})`;
  return { id: row.id, total: num(row.total), createdAt: row.created_at };
}
