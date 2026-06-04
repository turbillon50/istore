"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { aiInsights, aiChat } from "@/lib/mock-data";
import {
  Sparkles, TrendingUp, AlertTriangle, Users, Clock, Send, Bot,
} from "lucide-react";

const iconMap: Record<string, any> = { trending: TrendingUp, alert: AlertTriangle, users: Users, clock: Clock };
const toneMap: Record<string, string> = {
  success: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  info: "text-primary bg-primary/10 border-primary/20",
  danger: "text-destructive bg-destructive/10 border-destructive/20",
};

const suggestions = [
  "¿Cuánto vendí esta semana?",
  "¿Qué refacciones debo reordenar?",
  "Dame los clientes inactivos",
  "Proyección de utilidad de junio",
];

export default function AsistentePage() {
  const [messages, setMessages] = React.useState(aiChat);
  const [input, setInput] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "📊 (Demo) En producción, iStore AI consultaría tus datos en tiempo real para responder esto. Por ahora muestro información simulada del panel.",
        },
      ]);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="iStore AI" description="Tu asistente de negocio. Pregunta cualquier cosa sobre tu taller.">
        <Badge variant="purple" className="gap-1"><Sparkles className="h-3.5 w-3.5" /> Beta</Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aiInsights.map((ins) => {
          const Icon = iconMap[ins.icon];
          return (
            <Card key={ins.title} className={`border p-4 ${toneMap[ins.tone]}`}>
              <Icon className="h-5 w-5" />
              <p className="mt-3 text-xl font-semibold text-foreground">{ins.value}</p>
              <p className="text-sm font-medium text-foreground">{ins.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{ins.detail}</p>
            </Card>
          );
        })}
      </div>

      <Card className="flex h-[520px] flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium">iStore AI</p>
            <p className="text-xs text-success">● En línea</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <Input placeholder="Escribe tu pregunta…" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
