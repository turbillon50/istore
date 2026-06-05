import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, TrendingDown, Lock } from "lucide-react";

const methodColor: Record<string, any> = {
  Efectivo: "success", Stripe: "default", Transferencia: "purple", "Mercado Pago": "warning", Terminal: "secondary",
};

import { getCashMovements } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CajaPage() {
  const [cashMovements] = await Promise.all([getCashMovements()]);
  const ingresos = cashMovements.filter((m) => m.type === "Ingreso").reduce((s, m) => s + m.amount, 0);
  const egresos = cashMovements.filter((m) => m.type === "Egreso").reduce((s, m) => s + m.amount, 0);
  const balance = ingresos - egresos;

  return (
    <div className="space-y-6">
      <PageHeader title="Caja" description="Corte del día · Turno matutino · Cajero: Luis de la Torre">
        <Button variant="secondary" size="sm"><Lock className="h-4 w-4" /> Cerrar corte</Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Ingresos del día" value={formatCurrency(ingresos)} icon={TrendingUp} tone="success" />
        <MetricCard label="Egresos del día" value={formatCurrency(egresos)} icon={TrendingDown} tone="danger" />
        <MetricCard label="Balance en caja" value={formatCurrency(balance)} icon={Wallet} tone="primary" />
        <MetricCard label="Fondo inicial" value={formatCurrency(2000)} icon={Wallet} tone="purple" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader><CardTitle>Movimientos del día</CardTitle></CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2 font-medium">Concepto</th>
                    <th className="px-5 py-2 font-medium">Método</th>
                    <th className="px-5 py-2 font-medium">Hora</th>
                    <th className="px-5 py-2 text-right font-medium">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {cashMovements.map((m) => (
                    <tr key={m.id} className="border-b border-border/50 hover:bg-accent/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`grid h-7 w-7 place-items-center rounded-full ${m.type === "Ingreso" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                            {m.type === "Ingreso" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                          </span>
                          <span className="font-medium">{m.concept}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3"><Badge variant={methodColor[m.method]}>{m.method}</Badge></td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDateTime(m.time)}</td>
                      <td className={`px-5 py-3 text-right font-semibold ${m.type === "Ingreso" ? "text-success" : "text-destructive"}`}>
                        {m.type === "Ingreso" ? "+" : "-"}{formatCurrency(m.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Desglose por método</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { m: "Efectivo", v: 1290 },
              { m: "Stripe", v: 3250 },
              { m: "Mercado Pago", v: 1500 },
              { m: "Terminal", v: 890 },
            ].map((x) => (
              <div key={x.m} className="flex items-center justify-between">
                <Badge variant={methodColor[x.m]}>{x.m}</Badge>
                <span className="font-medium">{formatCurrency(x.v)}</span>
              </div>
            ))}
            <div className="mt-3 rounded-lg bg-secondary/40 p-3 text-center">
              <p className="text-xs text-muted-foreground">Efectivo esperado en caja</p>
              <p className="text-xl font-semibold">{formatCurrency(3290)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
