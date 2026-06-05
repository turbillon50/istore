import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <Logo size={36} />
        <p className="text-7xl font-bold tracking-tight text-primary">404</p>
        <div>
          <h1 className="text-xl font-semibold">Página no encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            La página que buscas no existe o fue movida. Vuelve al inicio para
            seguir gestionando tu taller con iStore Pro.
          </p>
        </div>
        <Button asChild><Link href="/dashboard">Ir al inicio</Link></Button>
      </div>
    </div>
  );
}
