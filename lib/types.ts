// =====================================================================
// iStore Pro — Tipos de dominio (sin datos). Usar estos en runtime;
// lib/mock-data.ts solo se usa para seed bajo flag SEED_DEMO=true.
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

export type CheckState = "Aprobado" | "Falla" | "Revisar";

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

export interface Store {
  id: string;
  name: string;
  slug: string;
  isPrincipal: boolean;
  phone?: string;
  email?: string;
  address?: string;
  plan: string;
  status: string;
  paymentProvider?: string;
  paymentAccount?: string;
  ownerEmail?: string;
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
