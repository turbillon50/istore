import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarSeries } from "@/components/charts";
import { formatCurrency } from "@/lib/utils";
import { Building2, DollarSign, Wrench, Users, Plus, MapPin } from "lucide-react";

import { getBranches, getStores } from "@/lib/data";
import { StoresPanel } from "./stores-panel";

export const dynamic = "force-dynamic";

export default async function SucursalesPage() {
  const [branches, stores] = await Promise.all([getBranches(), getStores()]);
  const totalSales = branches.reduce((s, b) => s + b.sales, 0);
  const totalOrders = branches.reduce((s, b) => s + (b.orders || 0), 0);
  const totalTechs = branches.reduce((s, b) => s + (b.technicians || 0), 0);
  const chartData = branches.map((b) => ({ label: b.name, ventas: b.sales }));

  return (
    <div className="space-y-6">
      <PageHeader title="Multisucursal" description="Vista consolidada de todas tus ubicaciones." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Sucursales activas" value={String(branches.length)} icon={Building2} tone="primary" />
        <MetricCard label="Ventas consolidadas" value={formatCurrency(totalSales)} icon={DollarSign} tone="success" />
        <MetricCard label="Órdenes totales" value={totalOrders.toLocaleString("es-MX")} icon={Wrench} tone="purple" />
        <MetricCard label="Equipo total" value={`${totalTechs} técnicos`} icon={Users} tone="warning" />
      </div>

      {/* Modelo marketplace: tiendas dentro del sistema (iStore = principal). */}
      <StoresPanel initialStores={stores} />

      {branches.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {branches.map((b, i) => (
            <Card key={b.name} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold">Sucursal {b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.technicians} técnicos</p>
                  </div>
                </div>
                <Badge variant={i === 0 ? "success" : "secondary"}>{i === 0 ? "Top" : `#${i + 1}`}</Badge>
              </div>
              <div className="mt-5 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ventas</span>
                    <span className="font-semibold">{formatCurrency(b.sales)}</span>
                  </div>
                  <Progress value={totalSales ? (b.sales / totalSales) * 100 : 0} className="mt-1.5" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Órdenes</span>
                  <span className="font-medium">{b.orders}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Crecimiento</span>
                  <Badge variant="success">+{b.growth}%</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {branches.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Comparativo de ventas por sucursal</CardTitle></CardHeader>
          <CardContent>
            <BarSeries data={chartData} dataKey="ventas" height={280} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
