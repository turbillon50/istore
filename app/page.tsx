import { cookies } from "next/headers";
import { Logo } from "@/components/logo";
import { StoreHeader } from "@/components/store/store-header";
import { Storefront } from "@/components/store/storefront";
import { ACCESS_COOKIE, tokenRole } from "@/lib/access";

// La HOME es LA TIENDA: vitrina pública de productos a la venta + servicios de
// reparación. Navegación 100% libre, sin cuenta. El comprador se registra
// gratis solo al comprar/agendar. El pitch SaaS multi-tienda vive en /pro
// (no enlazado de forma prominente). El acceso al panel del dueño es discreto
// y solo aparece si la cookie de la liga-llave está presente.
export const dynamic = "force-dynamic";

export default function StorePage() {
  const hasAdminKey = Boolean(tokenRole(cookies().get(ACCESS_COOKIE)?.value));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader hasAdminKey={hasAdminKey} />
      <main>
        <Storefront />
      </main>

      <footer className="border-t border-border">
        <div
          className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
        >
          <Logo size={30} tagline="Celulares & Reparación" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} iStore · Garantía y factura en cada compra
          </p>
          <p className="text-xs text-muted-foreground/70">
            Envíos a todo México · Centro de reparación con técnicos expertos
          </p>
        </div>
      </footer>
    </div>
  );
}
