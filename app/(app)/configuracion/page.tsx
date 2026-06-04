import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/logo";
import {
  Building, CreditCard, Bell, Plug, Receipt, Save, Check,
} from "lucide-react";

const integrations = [
  { name: "Stripe", desc: "Pagos con tarjeta", on: true },
  { name: "Mercado Pago", desc: "Pagos y QR", on: true },
  { name: "WhatsApp Business", desc: "Mensajería al cliente", on: true },
  { name: "Resend", desc: "Correos transaccionales", on: true },
  { name: "Twilio", desc: "SMS", on: false },
  { name: "QuickBooks", desc: "Contabilidad", on: false },
];

const payMethods = ["Efectivo", "Transferencia", "Stripe", "Mercado Pago", "Terminal", "QR"];

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" description="Administra tu empresa, pagos, integraciones y preferencias.">
        <Button size="sm"><Save className="h-4 w-4" /> Guardar cambios</Button>
      </PageHeader>

      <Tabs defaultValue="empresa">
        <TabsList className="flex-wrap">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="pagos">Métodos de pago</TabsTrigger>
          <TabsTrigger value="facturacion">Facturación</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Información del negocio</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4">
                <Logo size={48} showText={false} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Logotipo de la empresa</p>
                  <p className="text-xs text-muted-foreground">PNG o SVG, máx. 2 MB</p>
                </div>
                <Button variant="secondary" size="sm">Cambiar</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre comercial" value="iStore Pro" />
                <Field label="Razón social" value="Colectivo Mass S.A. de C.V." />
                <Field label="Teléfono" value="55 4000 1234" />
                <Field label="Correo" value="contacto@istorepro.com" />
                <Field label="Dirección" value="Av. Reforma 222, CDMX" />
                <Field label="Horario" value="Lun–Sáb 9:00–19:00" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Métodos de pago aceptados</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {payMethods.map((m) => (
                <div key={m} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <span className="text-sm font-medium">{m}</span>
                  <Switch defaultChecked={m !== "QR"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facturacion">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> Facturación e impuestos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="RFC" value="CMA180101XXX" />
                <Field label="Régimen fiscal" value="601 - General" />
                <Field label="IVA aplicado" value="16%" />
                <Field label="Folio inicial" value="A-0001" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div><p className="text-sm font-medium">Facturación automática</p><p className="text-xs text-muted-foreground">Genera CFDI al cerrar cada venta</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Plug className="h-5 w-5 text-primary" /> Integraciones</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {integrations.map((it) => (
                <div key={it.name} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                  <div>
                    <p className="text-sm font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.desc}</p>
                  </div>
                  {it.on ? (
                    <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Conectado</Badge>
                  ) : (
                    <Button variant="secondary" size="xs">Conectar</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input defaultValue={value} />
    </div>
  );
}
