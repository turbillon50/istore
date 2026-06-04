"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications, autoMessages } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import {
  MessageCircle, Mail, Smartphone, Bell, CheckCircle2, DollarSign, AlertTriangle, Info, Send,
} from "lucide-react";

const channelIcon: Record<string, any> = {
  WhatsApp: MessageCircle, Correo: Mail, SMS: Smartphone, Push: Bell,
};
const typeIcon: Record<string, { icon: any; cls: string }> = {
  success: { icon: CheckCircle2, cls: "text-success bg-success/10" },
  payment: { icon: DollarSign, cls: "text-warning bg-warning/10" },
  warning: { icon: AlertTriangle, cls: "text-destructive bg-destructive/10" },
  info: { icon: Info, cls: "text-primary bg-primary/10" },
};

export default function NotificacionesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notificaciones" description="Centro de mensajes multicanal: WhatsApp, correo, SMS y push.">
        <Button size="sm"><Send className="h-4 w-4" /> Enviar notificación</Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="todas">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="nolejdas">No leídas</TabsTrigger>
              <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
            </TabsList>
            <TabsContent value="todas">
              <Card>
                <CardContent className="divide-y divide-border/60 p-0">
                  {notifications.map((n) => {
                    const t = typeIcon[n.type];
                    const Ch = channelIcon[n.channel];
                    return (
                      <div key={n.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-accent/30">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${t.cls}`}>
                          <t.icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{n.title}</p>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{n.body}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary" className="gap-1"><Ch className="h-3 w-3" /> {n.channel}</Badge>
                          <span className="text-xs text-muted-foreground">{timeAgo(n.time)}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nolejdas">
              <Card><CardContent className="p-6 text-sm text-muted-foreground">Tienes 3 notificaciones sin leer.</CardContent></Card>
            </TabsContent>
            <TabsContent value="enviadas">
              <Card><CardContent className="p-6 text-sm text-muted-foreground">128 mensajes enviados este mes.</CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Canales activos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "WhatsApp Business", icon: MessageCircle, on: true },
                { name: "Correo (Resend)", icon: Mail, on: true },
                { name: "SMS (Twilio)", icon: Smartphone, on: false },
                { name: "Push Notifications", icon: Bell, on: true },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm">{c.name}</span>
                  <Switch defaultChecked={c.on} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Mensajes automáticos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {autoMessages.map((m) => (
                <div key={m.trigger} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{m.trigger}</p>
                    <Switch defaultChecked />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.template}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
