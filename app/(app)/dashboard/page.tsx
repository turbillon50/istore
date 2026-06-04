import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AreaTrend, DonutChart } from "@/components/charts";
import {
  kpis,
  salesByDay,
  incomeByCategory,
  orders,
  technicians,
  notifications,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/utils";
import {
  Smartphone,
  Wrench,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Ticket,
  PackageCheck,
  ArrowRight,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const recent = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="¡Hola, Luis! 👋"
        description="Este es el resumen operativo de tu taller hoy, 4 de junio."
      >
        <Button variant="secondary" size="sm" asChild>
          <Link href="/reportes">Ver reportes</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/recepciones">Nueva recepción</Link>
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Equipos en taller" value={formatNumber(kpis.devicesInShop)} delta={6.2} icon={Smartphone} tone="primary" />
        <MetricCard label="Reparaciones activas" value={formatNumber(kpis.activeRepairs)} delta={3.1} icon={Wrench} tone="purple" />
        <MetricCard label="Ventas del día" value={formatCurrency(kpis.salesToday)} delta={12.5} icon={DollarSign} tone="success" />
        <MetricCard label="Utilidad del día" value={formatCurrency(kpis.profitToday)} delta={8.4} icon={TrendingUp} tone="success" />
        <MetricCard label="Refacciones disponibles" value={formatNumber(kpis.partsAvailable)} delta={-2.3} icon={Package} tone="warning" />
        <MetricCard label="Clientes registrados" value={formatNumber(kpis.clients)} delta={4.7} icon={Users} tone="primary" />
        <MetricCard label="Tickets abiertos" value={formatNumber(kpis.openTickets)} delta={-1.8} icon={Ticket} tone="danger" />
        <MetricCard label="Equipos entregados" value={formatNumber(kpis.delivered)} delta={9.6} icon={PackageCheck} tone="success" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Ventas y utilidad</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Últimos 7 días</p>
            </div>
            <Badge variant="success">+12.5% vs semana previa</Badge>
          </CardHeader>
          <CardContent>
            <AreaTrend
              data={salesByDay}
              dataKeys={[
                { key: "ventas", color: "#2563EB" },
                { key: "utilidad", color: "#22C55E" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos por categoría</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Este mes</p>
          </CardHeader>
          <CardContent>
            <DonutChart data={incomeByCategory} />
            <div className="mt-2 space-y-2">
              {incomeByCategory.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + side column */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Órdenes recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ordenes">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2 font-medium">Folio</th>
                    <th className="px-5 py-2 font-medium">Cliente</th>
                    <th className="px-5 py-2 font-medium">Equipo</th>
                    <th className="px-5 py-2 font-medium">Estado</th>
                    <th className="px-5 py-2 text-right font-medium">Costo</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id} className="border-b border-border/50 transition-colors hover:bg-accent/40">
                      <td className="px-5 py-3">
                        <Link href={`/ordenes/${o.id}`} className="font-mono text-xs text-primary hover:underline">
                          #{o.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 font-medium">{o.client}</td>
                      <td className="px-5 py-3 text-muted-foreground">{o.device}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 text-right font-medium">{formatCurrency(o.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Técnicos más productivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {technicians.slice(0, 4).map((t, i) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.repairs} reparaciones</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-warning">
                    <Star className="h-3 w-3 fill-warning" /> {t.rating}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actividad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.body} · {timeAgo(n.time)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
