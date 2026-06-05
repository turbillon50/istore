import { Badge } from "@/components/ui/badge";
import type { OrderStatus, Priority, CheckState } from "@/lib/types";

const statusMap: Record<OrderStatus, { variant: any; dot: string }> = {
  Recibido: { variant: "secondary", dot: "bg-muted-foreground" },
  Diagnóstico: { variant: "default", dot: "bg-primary" },
  "Autorización Pendiente": { variant: "warning", dot: "bg-warning" },
  "En Reparación": { variant: "purple", dot: "bg-purple-400" },
  Terminado: { variant: "success", dot: "bg-success" },
  Entregado: { variant: "outline", dot: "bg-muted-foreground" },
  Cancelado: { variant: "danger", dot: "bg-destructive" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusMap[status];
  return (
    <Badge variant={cfg.variant} className="gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </Badge>
  );
}

const priorityMap: Record<Priority, any> = {
  Baja: "outline",
  Media: "secondary",
  Alta: "warning",
  Urgente: "danger",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant={priorityMap[priority]}>{priority}</Badge>;
}

const checkMap: Record<CheckState, any> = {
  Aprobado: "success",
  Falla: "danger",
  Revisar: "warning",
};

export function CheckBadge({ state }: { state: CheckState }) {
  return <Badge variant={checkMap[state]}>{state}</Badge>;
}
