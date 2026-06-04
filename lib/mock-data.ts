// =====================================================================
// iStore Pro — Capa de datos simulados ("brain" del demo)
// Todo es mock determinista. No hay backend ni APIs reales.
// =====================================================================

export type OrderStatus =
  | "Recibido"
  | "Diagnóstico"
  | "Autorización Pendiente"
  | "En Reparación"
  | "Terminado"
  | "Entregado"
  | "Cancelado";

export type Priority = "Baja" | "Media" | "Alta" | "Urgente";

export type Branch = "Centro" | "Norte" | "Sur";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  totalSpent: number;
  visits: number;
  devices: number;
  tag: "VIP" | "Frecuente" | "Nuevo" | "Mayoreo";
  since: string;
  notes?: string;
}

export interface Order {
  id: string;
  client: string;
  clientPhone: string;
  device: string;
  brand: string;
  imei: string;
  issue: string;
  technician: string;
  cost: number;
  status: OrderStatus;
  priority: Priority;
  branch: Branch;
  createdAt: string;
  promiseAt: string;
  category: "Reparación" | "Refacción" | "Accesorio" | "Diagnóstico";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  cost: number;
  price: number;
  supplier: string;
  branch: Branch;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  channel: "WhatsApp" | "Correo" | "SMS" | "Push";
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "payment";
}

// --------------------------- Helpers ---------------------------
function daysFromNow(d: number) {
  const date = new Date("2026-06-04T11:30:00");
  date.setDate(date.getDate() + d);
  return date.toISOString();
}

// --------------------------- KPIs ------------------------------
export const kpis = {
  devicesInShop: 150,
  activeRepairs: 87,
  salesToday: 48250,
  profitToday: 18640,
  partsAvailable: 3280,
  clients: 1500,
  openTickets: 41,
  delivered: 312,
  annualSales: 2500000,
  totalOrders: 3200,
};

// --------------------------- Técnicos --------------------------
export const technicians = [
  { name: "Miguel Ángel", repairs: 142, rating: 4.9, efficiency: 96, branch: "Centro" as Branch },
  { name: "Laura Méndez", repairs: 128, rating: 4.8, efficiency: 93, branch: "Norte" as Branch },
  { name: "Carlos Ruiz", repairs: 119, rating: 4.7, efficiency: 91, branch: "Sur" as Branch },
  { name: "Ana Torres", repairs: 104, rating: 4.8, efficiency: 89, branch: "Centro" as Branch },
  { name: "Diego Sánchez", repairs: 97, rating: 4.6, efficiency: 85, branch: "Norte" as Branch },
];

// --------------------------- Sucursales ------------------------
export const branches = [
  { name: "Centro", sales: 1120000, orders: 1340, technicians: 6, growth: 12.4 },
  { name: "Norte", sales: 845000, orders: 1010, technicians: 5, growth: 8.1 },
  { name: "Sur", sales: 535000, orders: 850, technicians: 4, growth: 15.6 },
];

// --------------------------- Series gráficas -------------------
export const salesByDay = [
  { label: "Lun", ventas: 38200, utilidad: 14100 },
  { label: "Mar", ventas: 41500, utilidad: 15800 },
  { label: "Mié", ventas: 36900, utilidad: 13200 },
  { label: "Jue", ventas: 52300, utilidad: 21400 },
  { label: "Vie", ventas: 61200, utilidad: 25600 },
  { label: "Sáb", ventas: 72400, utilidad: 31200 },
  { label: "Dom", ventas: 33100, utilidad: 12800 },
];

export const salesByMonth = [
  { label: "Ene", ventas: 178000, equipos: 240 },
  { label: "Feb", ventas: 192000, equipos: 268 },
  { label: "Mar", ventas: 205000, equipos: 290 },
  { label: "Abr", ventas: 221000, equipos: 312 },
  { label: "May", ventas: 248000, equipos: 351 },
  { label: "Jun", ventas: 263000, equipos: 372 },
  { label: "Jul", ventas: 240000, equipos: 333 },
  { label: "Ago", ventas: 255000, equipos: 360 },
  { label: "Sep", ventas: 271000, equipos: 388 },
  { label: "Oct", ventas: 289000, equipos: 401 },
  { label: "Nov", ventas: 312000, equipos: 430 },
  { label: "Dic", ventas: 358000, equipos: 489 },
];

export const incomeByCategory = [
  { name: "Reparaciones", value: 62, color: "#2563EB" },
  { name: "Refacciones", value: 21, color: "#22C55E" },
  { name: "Accesorios", value: 11, color: "#F59E0B" },
  { name: "Servicios", value: 6, color: "#A855F7" },
];

export const topParts = [
  { name: "Pantalla iPhone 13 Pro", sold: 142, revenue: 333700 },
  { name: "Batería iPhone 11", sold: 128, revenue: 57600 },
  { name: "Flex de carga Samsung S22", sold: 96, revenue: 30720 },
  { name: "Cámara trasera iPhone 12", sold: 74, revenue: 85100 },
  { name: "Cristal templado (genérico)", sold: 410, revenue: 24600 },
];

// --------------------------- Clientes --------------------------
const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Sofía", "Pedro", "Laura", "Diego", "Valeria", "Jorge", "Camila", "Roberto", "Daniela", "Andrés", "Paola", "Fernando", "Lucía", "Ricardo", "Gabriela"];
const lastNames = ["Pérez", "González", "Ramírez", "López", "Hernández", "Torres", "Flores", "Vázquez", "Méndez", "Castro", "Rivera", "Ortiz", "Romero", "Sánchez", "Cruz"];
const tags: Client["tag"][] = ["VIP", "Frecuente", "Nuevo", "Mayoreo"];

function makeClients(n: number): Client[] {
  const out: Client[] = [];
  for (let i = 0; i < n; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    out.push({
      id: `CL-${String(1000 + i)}`,
      name: `${fn} ${ln}`,
      phone: `55 ${String(1000 + (i * 37) % 9000)} ${String(1000 + (i * 53) % 9000)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@mail.com`,
      totalSpent: 800 + ((i * 1273) % 24000),
      visits: 1 + ((i * 7) % 28),
      devices: 1 + (i % 5),
      tag: tags[i % tags.length],
      since: daysFromNow(-(30 + (i % 700))),
      notes: i % 4 === 0 ? "Cliente preferente, atención prioritaria." : undefined,
    });
  }
  return out;
}

export const clients = makeClients(64); // muestra navegable de 1,500 simulados

// --------------------------- Órdenes ---------------------------
const devices = [
  ["iPhone 13 Pro Max", "Apple"],
  ["iPhone 11", "Apple"],
  ["Samsung Galaxy S22", "Samsung"],
  ["Xiaomi Redmi Note 11", "Xiaomi"],
  ["iPad Air 5", "Apple"],
  ["MacBook Air M2", "Apple"],
  ["Motorola Edge 30", "Motorola"],
  ["Huawei P40", "Huawei"],
  ["iPhone 12", "Apple"],
  ["Samsung A53", "Samsung"],
];
const issues = [
  "Pantalla no responde en la parte superior",
  "No enciende",
  "Batería se descarga rápido",
  "No carga / puerto dañado",
  "Cámara trasera con manchas",
  "Face ID no funciona",
  "Sin señal / IMEI dañado",
  "Pantalla rota",
  "Bocina sin audio",
  "Mojado, requiere limpieza",
];
const statuses: OrderStatus[] = [
  "Recibido", "Diagnóstico", "Autorización Pendiente", "En Reparación", "Terminado", "Entregado", "Cancelado",
];
const priorities: Priority[] = ["Baja", "Media", "Alta", "Urgente"];
const branchList: Branch[] = ["Centro", "Norte", "Sur"];

function makeOrders(n: number): Order[] {
  const out: Order[] = [];
  for (let i = 0; i < n; i++) {
    const [device, brand] = devices[i % devices.length];
    const client = clients[(i * 5) % clients.length];
    out.push({
      id: `OS-${String(41000 - i).padStart(5, "0")}`,
      client: client.name,
      clientPhone: client.phone,
      device,
      brand,
      imei: `35${String(6789118765432 - i * 7)}`,
      issue: issues[i % issues.length],
      technician: technicians[i % technicians.length].name,
      cost: 350 + ((i * 317) % 6500),
      status: statuses[i % statuses.length],
      priority: priorities[(i * 2) % priorities.length],
      branch: branchList[i % branchList.length],
      createdAt: daysFromNow(-(i % 30)),
      promiseAt: daysFromNow(3 - (i % 5)),
      category: (["Reparación", "Refacción", "Accesorio", "Diagnóstico"] as const)[i % 4],
    });
  }
  return out;
}

export const orders = makeOrders(60);

export function getOrder(id: string) {
  return orders.find((o) => o.id === id) ?? orders[0];
}

// --------------------------- Diagnóstico -----------------------
export type CheckState = "Aprobado" | "Falla" | "Revisar";
export const diagnosticChecklist: { label: string; state: CheckState }[] = [
  { label: "Pantalla", state: "Aprobado" },
  { label: "Touch", state: "Aprobado" },
  { label: "Face ID", state: "Falla" },
  { label: "Touch ID", state: "Aprobado" },
  { label: "Micrófono", state: "Aprobado" },
  { label: "Bocina", state: "Aprobado" },
  { label: "Bluetooth", state: "Aprobado" },
  { label: "WiFi", state: "Aprobado" },
  { label: "Red Celular", state: "Aprobado" },
  { label: "Flash", state: "Aprobado" },
  { label: "Cámara Frontal", state: "Aprobado" },
  { label: "Cámara Trasera", state: "Aprobado" },
  { label: "Carga", state: "Aprobado" },
  { label: "Batería", state: "Revisar" },
  { label: "Sensores", state: "Aprobado" },
  { label: "Botones", state: "Aprobado" },
  { label: "Vibrador", state: "Aprobado" },
];

// --------------------------- Inventario ------------------------
const inventoryCategories = ["Pantallas", "Baterías", "Flex", "Cámaras", "Tapas", "Herramientas", "Accesorios"];
const suppliers = ["MobileParts MX", "TechSupply", "iPartes", "GlobalCell", "RefaccionesPro"];

function makeProducts(n: number): Product[] {
  const out: Product[] = [];
  const names = [
    "Pantalla iPhone 13 Pro Max OLED", "Batería iPhone 11", "Flex de Carga iPhone X",
    "Cámara Trasera iPhone 12", "Tapa Trasera Samsung S22", "Kit Herramientas 32 pzs",
    "Cristal Templado 9H", "Pantalla Samsung A53", "Batería Xiaomi Redmi Note 11",
    "Bocina iPhone 13", "Flex Botón Home", "Cámara Frontal iPhone 11",
    "Funda Silicón iPhone 14", "Cargador USB-C 20W", "Pin de Carga Tipo C",
  ];
  for (let i = 0; i < n; i++) {
    const cost = 80 + ((i * 211) % 2200);
    const price = Math.round(cost * (1.45 + (i % 5) * 0.08));
    const stock = (i * 13) % 60;
    out.push({
      id: `PRD-${String(2000 + i)}`,
      name: names[i % names.length],
      category: inventoryCategories[i % inventoryCategories.length],
      sku: `SKU-${String(90000 + i * 7)}`,
      stock,
      minStock: 8,
      cost,
      price,
      supplier: suppliers[i % suppliers.length],
      branch: branchList[i % branchList.length],
    });
  }
  return out;
}

export const products = makeProducts(40);

// --------------------------- Notificaciones --------------------
export const notifications: NotificationItem[] = [
  { id: "n1", title: "Equipo listo para entrega", body: "Orden #OS-00058 — iPhone 13 Pro", channel: "WhatsApp", time: daysFromNow(0), read: false, type: "success" },
  { id: "n2", title: "Recordatorio de pago", body: "Orden #OS-00036 — saldo pendiente $1,200", channel: "SMS", time: daysFromNow(0), read: false, type: "payment" },
  { id: "n3", title: "Diagnóstico disponible", body: "Orden #OS-00041 — esperando autorización", channel: "Correo", time: daysFromNow(0), read: false, type: "info" },
  { id: "n4", title: "Stock bajo", body: "Batería iPhone 11 — quedan 4 piezas", channel: "Push", time: daysFromNow(0), read: true, type: "warning" },
  { id: "n5", title: "Equipo en reparación", body: "Orden #OS-00040 — asignado a Laura Méndez", channel: "Push", time: daysFromNow(0), read: true, type: "info" },
  { id: "n6", title: "Nuevo cliente registrado", body: "Pedro Martínez — sucursal Centro", channel: "Push", time: daysFromNow(0), read: true, type: "success" },
];

// --------------------------- Mensajes automáticos --------------
export const autoMessages = [
  { trigger: "Equipo Recibido", template: "Hola {cliente}, recibimos tu {equipo}. Tu folio es {folio}. Te avisaremos del diagnóstico." },
  { trigger: "Diagnóstico Listo", template: "{cliente}, el diagnóstico de tu {equipo} está listo. Costo estimado: {costo}." },
  { trigger: "Esperando Autorización", template: "Necesitamos tu autorización para reparar tu {equipo}. Responde SÍ para continuar." },
  { trigger: "Reparación Terminada", template: "¡Buenas noticias! La reparación de tu {equipo} ha finalizado." },
  { trigger: "Listo para Entrega", template: "Tu {equipo} está listo para recoger. Horario: L-S 9:00–19:00." },
];

// --------------------------- POS / Ventas ----------------------
export const posCatalog = [
  { id: "p1", name: "Pantalla iPhone 13 Pro", price: 2350, category: "Refacción" },
  { id: "p2", name: "Cambio de batería", price: 650, category: "Servicio" },
  { id: "p3", name: "Funda Silicón iPhone 14", price: 280, category: "Accesorio" },
  { id: "p4", name: "Cristal Templado 9H", price: 120, category: "Accesorio" },
  { id: "p5", name: "Cargador USB-C 20W", price: 320, category: "Accesorio" },
  { id: "p6", name: "Diagnóstico avanzado", price: 250, category: "Servicio" },
  { id: "p7", name: "Limpieza por humedad", price: 480, category: "Servicio" },
  { id: "p8", name: "Audífonos Bluetooth", price: 590, category: "Accesorio" },
  { id: "p9", name: "Flex de carga Samsung", price: 320, category: "Refacción" },
];

// --------------------------- Caja ------------------------------
export const cashMovements = [
  { id: "c1", concept: "Venta mostrador — Funda + Cristal", type: "Ingreso", method: "Efectivo", amount: 400, time: daysFromNow(0) },
  { id: "c2", concept: "Reparación OS-00041", type: "Ingreso", method: "Stripe", amount: 3250, time: daysFromNow(0) },
  { id: "c3", concept: "Compra refacciones a proveedor", type: "Egreso", method: "Transferencia", amount: 8400, time: daysFromNow(0) },
  { id: "c4", concept: "Anticipo OS-00036", type: "Ingreso", method: "Mercado Pago", amount: 1500, time: daysFromNow(0) },
  { id: "c5", concept: "Pago de servicios (luz)", type: "Egreso", method: "Efectivo", amount: 1280, time: daysFromNow(0) },
  { id: "c6", concept: "Venta accesorios", type: "Ingreso", method: "Terminal", amount: 890, time: daysFromNow(0) },
];

// --------------------------- Usuarios / roles ------------------
export const users = [
  { name: "Luis de la Torre", email: "admin@istorepro.com", role: "Administrador", branch: "Centro", status: "Activo" },
  { name: "Miguel Ángel", email: "miguel@istorepro.com", role: "Técnico", branch: "Centro", status: "Activo" },
  { name: "Laura Méndez", email: "laura@istorepro.com", role: "Técnico", branch: "Norte", status: "Activo" },
  { name: "Sofía Ramírez", email: "sofia@istorepro.com", role: "Recepción", branch: "Sur", status: "Activo" },
  { name: "Jorge Castro", email: "jorge@istorepro.com", role: "Cajero", branch: "Norte", status: "Inactivo" },
];

export const roles = [
  { name: "Administrador", users: 1, permissions: "Acceso total al sistema" },
  { name: "Gerente", users: 3, permissions: "Operación + reportes, sin facturación" },
  { name: "Técnico", users: 12, permissions: "Órdenes, diagnósticos e inventario" },
  { name: "Recepción", users: 5, permissions: "Recepción, clientes y notificaciones" },
  { name: "Cajero", users: 4, permissions: "Ventas (POS) y caja" },
];

// --------------------------- iStore AI insights ----------------
export const aiInsights = [
  { icon: "trending", title: "Utilidad proyectada", value: "$268,400", detail: "Cierre estimado de junio (+8.3% vs may)", tone: "success" as const },
  { icon: "alert", title: "Refacciones por agotarse", value: "7 productos", detail: "Batería iPhone 11, Flex S22 y 5 más bajo mínimo", tone: "warning" as const },
  { icon: "users", title: "Clientes frecuentes", value: "142 activos", detail: "23 sin visita en 60 días — sugerir campaña", tone: "info" as const },
  { icon: "clock", title: "Órdenes en riesgo", value: "5 órdenes", detail: "Fecha promesa vencida sin entrega", tone: "danger" as const },
];

export const aiChat = [
  { role: "assistant", text: "Hola Luis 👋 Soy iStore AI. ¿Quieres un resumen del negocio de hoy?" },
  { role: "user", text: "Sí, dame el resumen y qué debo atender." },
  {
    role: "assistant",
    text: "Hoy llevas **$48,250** en ventas (+12.5% vs ayer) con **18 equipos recibidos**. Atención: **5 órdenes** pasaron su fecha promesa y **7 refacciones** están por agotarse. Miguel Ángel es tu técnico más productivo del mes con 142 reparaciones.",
  },
];
