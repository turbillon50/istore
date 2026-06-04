import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarSeries } from "@/components/charts";
import { salesByMonth } from "@/lib/mock-data";
import {
  FileSpreadsheet, FileText, DollarSign, Package, Users, Wrench, UserCog, TrendingUp, Download,
} from "lucide-react";

const reports = [
  { name: "Ventas", desc: "Ingresos, tickets y métodos de pago", icon: DollarSign, tone: "text-success" },
  { name: "Inventario", desc: "Stock, valor y rotación de productos", icon: Package, tone: "text-primary" },
  { name: "Clientes", desc: "Altas, recurrencia y valor de vida", icon: Users, tone: "text-purple-400" },
  { name: "Reparaciones", desc: "Órdenes, tiempos y tasa de éxito", icon: Wrench, tone: "text-warning" },
  { name: "Técnicos", desc: "Productividad y rendimiento individual", icon: UserCog, tone: "text-primary" },
  { name: "Utilidades", desc: "Margen y rentabilidad por categoría", icon: TrendingUp, tone: "text-success" },
];

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" description="Genera y exporta reportes detallados de tu operación.">
        <Button variant="secondary" size="sm"><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
        <Button size="sm"><FileText className="h-4 w-4" /> PDF</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.name} className="group p-5 transition-all hover:border-primary/40">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                <r.icon className={`h-5 w-5 ${r.tone}`} />
              </span>
              <Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 font-semibold">Reporte de {r.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="xs" className="flex-1">Ver</Button>
              <Button variant="secondary" size="xs" className="flex-1">Exportar</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Resumen anual de ventas</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Comparativo mensual 2026</p>
          </div>
          <Badge variant="success">Año fiscal en curso</Badge>
        </CardHeader>
        <CardContent>
          <BarSeries data={salesByMonth} dataKey="ventas" height={300} />
        </CardContent>
      </Card>
    </div>
  );
}
