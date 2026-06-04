import Link from "next/link";
import { getOrder, orders, diagnosticChecklist } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, PriorityBadge, CheckBadge } from "@/components/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Smartphone,
  FileText,
  Paperclip,
  CheckCircle2,
  Circle,
  Printer,
} from "lucide-react";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

const timeline = [
  { label: "Equipo recibido", time: "13 May · 11:30", done: true, by: "Recepción" },
  { label: "Diagnóstico iniciado", time: "13 May · 13:05", done: true, by: "Miguel Ángel" },
  { label: "Cotización enviada al cliente", time: "13 May · 14:20", done: true, by: "Sistema · WhatsApp" },
  { label: "Autorización del cliente", time: "13 May · 16:00", done: true, by: "Juan Pérez" },
  { label: "En reparación", time: "14 May · 09:15", done: true, by: "Miguel Ángel" },
  { label: "Pruebas de calidad", time: "Pendiente", done: false, by: "—" },
  { label: "Listo para entrega", time: "Pendiente", done: false, by: "—" },
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrder(params.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/ordenes"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Orden #{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Sucursal {order.branch} · Ingreso {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm"><Printer className="h-4 w-4" /> Imprimir</Button>
          <Button size="sm">Actualizar estado</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: device + tabs */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
              <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-secondary to-background">
                <Smartphone className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">{order.device}</h2>
                  <p className="text-sm text-muted-foreground">{order.brand} · 256 GB · Sierra Blue</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <Field label="IMEI" value={order.imei} />
                  <Field label="Serie" value="F2LDPQ0XQ7D1L" />
                  <Field label="Prioridad" value={<PriorityBadge priority={order.priority} />} />
                  <Field label="Accesorios" value="Caja, cable" />
                  <Field label="Técnico" value={order.technician} />
                  <Field label="Categoría" value={order.category} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Tabs defaultValue="diag">
                <TabsList>
                  <TabsTrigger value="diag">Diagnóstico</TabsTrigger>
                  <TabsTrigger value="files">Archivos</TabsTrigger>
                  <TabsTrigger value="comments">Comentarios</TabsTrigger>
                </TabsList>

                <TabsContent value="diag">
                  <div className="mb-3 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                    <span className="font-medium text-warning">Falla reportada: </span>
                    <span className="text-muted-foreground">{order.issue}. El Face ID no funciona.</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    {diagnosticChecklist.map((c) => (
                      <div key={c.label} className="flex items-center justify-between border-b border-border/40 py-2">
                        <span className="text-sm text-muted-foreground">{c.label}</span>
                        <CheckBadge state={c.state} />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="files">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["Frontal.jpg", "Trasera.jpg", "Pantalla.jpg", "Cotización.pdf"].map((f) => (
                      <div key={f} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4">
                        <Paperclip className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments">
                  <div className="space-y-3">
                    {[
                      { who: "Miguel Ángel", text: "Se confirma falla en módulo Face ID, se requiere reemplazo.", time: "13 May 13:40" },
                      { who: "Recepción", text: "Cliente autoriza reparación por WhatsApp.", time: "13 May 16:02" },
                    ].map((c, i) => (
                      <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium">{c.who}</span>
                          <span className="text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: client + costs + timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Cliente</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.client}</p>
                <p className="text-sm text-muted-foreground">{order.clientPhone}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1"><Phone className="h-4 w-4" /> Llamar</Button>
                <Button variant="success" size="sm" className="flex-1"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Resumen de costos</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Mano de obra" value={formatCurrency(order.cost * 0.4)} />
              <Row label="Refacción (módulo)" value={formatCurrency(order.cost * 0.55)} />
              <Row label="Diagnóstico" value={formatCurrency(order.cost * 0.05)} />
              <div className="my-2 h-px bg-border" />
              <Row label="Total" value={formatCurrency(order.cost)} bold />
              <Badge variant="warning" className="mt-2">Anticipo pendiente</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="relative space-y-4 pl-2">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {t.done ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      {i < timeline.length - 1 && (
                        <div className={`mt-1 w-px flex-1 ${t.done ? "bg-success/40" : "bg-border"}`} style={{ minHeight: 18 }} />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className={`text-sm ${t.done ? "font-medium" : "text-muted-foreground"}`}>{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.time} · {t.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "text-base font-semibold" : "font-medium"}>{value}</span>
    </div>
  );
}
