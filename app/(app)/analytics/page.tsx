import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaTrend, BarSeries, DonutChart } from "@/components/charts";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, Wrench, Users, Calendar, Star } from "lucide-react";

import { getSalesByMonth, getSalesByDay, getIncomeByCategory, getTechnicians, getTopParts, getClients } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [salesByMonth, salesByDay, incomeByCategory, technicians, topParts, clients] = await Promise.all([getSalesByMonth(), getSalesByDay(), getIncomeByCategory(), getTechnicians(), getTopParts(), getClients()]);

  // KPIs reales derivados de los datos.
  const annualSales = salesByMonth.reduce((s, m) => s + (m.ventas || 0), 0);
  const repaired = salesByMonth.reduce((s, m) => s + (m.equipos || 0), 0);
  const newClients = clients.filter((c) => c.tag === "Nuevo").length;
  // Margen estimado a partir de la utilidad semanal real (transparente: "est.").
  const wVentas = salesByDay.reduce((s, d) => s + (d.ventas || 0), 0);
  const wUtil = salesByDay.reduce((s, d) => s + (d.utilidad || 0), 0);
  const margin = wVentas ? wUtil / wVentas : 0;
  const estProfit = Math.round(annualSales * margin);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Inteligencia de negocio">
        <Button variant="secondary" size="sm"><Calendar className="h-4 w-4" /> Este año</Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Ventas del año" value={formatCurrency(annualSales)} icon={DollarSign} tone="success" />
        <MetricCard label="Utilidad neta (est.)" value={formatCurrency(estProfit)} icon={TrendingUp} tone="primary" />
        <MetricCard label="Equipos reparados" value={repaired.toLocaleString("es-MX")} icon={Wrench} tone="purple" />
        <MetricCard label="Clientes nuevos" value={newClients.toLocaleString("es-MX")} icon={Users} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Ventas por mes</CardTitle>
            <Badge variant="success">+18.2% YoY</Badge>
          </CardHeader>
          <CardContent>
            <AreaTrend data={salesByMonth} dataKeys={[{ key: "ventas", color: "#2563EB" }]} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ingresos por categoría</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={incomeByCategory} />
            <div className="mt-2 space-y-2">
              {incomeByCategory.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.name}
                  </span>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Equipos reparados por mes</CardTitle></CardHeader>
          <CardContent>
            <BarSeries data={salesByMonth} dataKey="equipos" money={false} color="#A855F7" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ventas y utilidad semanal</CardTitle></CardHeader>
          <CardContent>
            <AreaTrend data={salesByDay} dataKeys={[{ key: "ventas", color: "#2563EB" }, { key: "utilidad", color: "#22C55E" }]} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Técnicos más productivos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {technicians.map((t) => (
              <div key={t.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">{t.name}
                    <span className="flex items-center gap-0.5 text-xs text-warning"><Star className="h-3 w-3 fill-warning" />{t.rating}</span>
                  </span>
                  <span className="text-muted-foreground">{t.repairs} reparaciones</span>
                </div>
                <Progress value={t.efficiency} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Refacciones más vendidas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topParts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-semibold">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sold} unidades</p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(p.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
