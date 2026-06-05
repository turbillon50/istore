import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getKpis, getProducts, getOrders } from "@/lib/data";
import { Sparkles, TrendingUp, AlertTriangle, Users, Clock, Bot } from "lucide-react";

export const dynamic = "force-dynamic";

const toneMap: Record<string, string> = {
  success: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  info: "text-primary bg-primary/10 border-primary/20",
  danger: "text-destructive bg-destructive/10 border-destructive/20",
};

export default async function AsistentePage() {
  const [kpis, products, orders] = await Promise.all([getKpis(), getProducts(), getOrders()]);

  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const now = Date.now();
  const atRisk = orders.filter(
    (o) => !["Entregado", "Cancelado", "Terminado"].includes(o.status) && new Date(o.promiseAt).getTime() < now
  );

  // Insights calculados de datos reales (no mock).
  const insights = [
    { icon: TrendingUp, title: "Ventas de hoy", value: formatCurrency(kpis.salesToday), detail: `Utilidad del día: ${formatCurrency(kpis.profitToday)}`, tone: "success" },
    { icon: AlertTriangle, title: "Refacciones por agotarse", value: `${lowStock.length} productos`, detail: lowStock.length ? `${lowStock.slice(0, 2).map((p) => p.name).join(", ")}${lowStock.length > 2 ? ` y ${lowStock.length - 2} más` : ""}` : "Inventario sano", tone: "warning" },
    { icon: Users, title: "Clientes registrados", value: `${kpis.clients}`, detail: `${kpis.totalOrders} órdenes históricas`, tone: "info" },
    { icon: Clock, title: "Órdenes en riesgo", value: `${atRisk.length} órdenes`, detail: atRisk.length ? "Fecha promesa vencida sin entrega" : "Todo dentro de fecha promesa", tone: "danger" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="iStore AI" description="Tu asistente de negocio con insights calculados de tus datos reales.">
        <Badge variant="purple" className="gap-1"><Sparkles className="h-3.5 w-3.5" /> Próximamente</Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((ins) => (
          <Card key={ins.title} className={`border p-4 ${toneMap[ins.tone]}`}>
            <ins.icon className="h-5 w-5" />
            <p className="mt-3 text-xl font-semibold text-foreground">{ins.value}</p>
            <p className="text-sm font-medium text-foreground">{ins.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ins.detail}</p>
          </Card>
        ))}
      </div>

      <Card className="flex h-[360px] flex-col items-center justify-center gap-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white">
          <Bot className="h-7 w-7" />
        </span>
        <div>
          <p className="text-lg font-semibold">El chat de iStore AI llega pronto</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Estamos conectando el asistente conversacional a tus datos en tiempo real.
            Mientras tanto, los insights de arriba se calculan directamente de tu operación.
          </p>
        </div>
        <Badge variant="purple" className="gap-1"><Sparkles className="h-3.5 w-3.5" /> Próximamente</Badge>
      </Card>
    </div>
  );
}
