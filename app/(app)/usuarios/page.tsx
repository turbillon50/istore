import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { users, roles } from "@/lib/mock-data";
import { initials } from "@/lib/utils";
import { Plus, ShieldCheck, UserPlus, Settings2 } from "lucide-react";

const roleVariant: Record<string, any> = {
  Administrador: "default", Gerente: "purple", Técnico: "secondary", Recepción: "success", Cajero: "warning",
};

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios y permisos" description="Gestiona el acceso de tu equipo y sus roles.">
        <Button size="sm"><UserPlus className="h-4 w-4" /> Invitar usuario</Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader><CardTitle>Equipo ({users.length})</CardTitle></CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2 font-medium">Usuario</th>
                    <th className="px-5 py-2 font-medium">Rol</th>
                    <th className="px-5 py-2 font-medium">Sucursal</th>
                    <th className="px-5 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-border/50 hover:bg-accent/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8"><AvatarFallback>{initials(u.name)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><Badge variant={roleVariant[u.role]}>{u.role}</Badge></td>
                      <td className="px-5 py-3 text-muted-foreground">{u.branch}</td>
                      <td className="px-5 py-3">
                        <Badge variant={u.status === "Activo" ? "success" : "secondary"}>{u.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Roles y permisos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {roles.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-primary" /> {r.name}
                  </span>
                  <Badge variant="secondary">{r.users}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.permissions}</p>
              </div>
            ))}
            <Button variant="secondary" className="w-full"><Settings2 className="h-4 w-4" /> Configurar permisos</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
