import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tokenRole } from "@/lib/access";
import { AccessInstall } from "./install";

export const dynamic = "force-dynamic";

// El manifest propio (start_url=/<token>, standalone) se enlaza por ruta,
// para que "Agregar a inicio" instale la liga como app nativa.
export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  if (!tokenRole(params.token)) return {};
  return {
    title: "Acceso · iStore Admin",
    robots: { index: false, follow: false },
    manifest: `/km/${params.token}`,
  };
}

// Página de la liga-llave. La cookie ya la instaló el middleware; aquí solo
// resolvemos el destino: si la PWA corre en standalone -> /admin; si está en
// el navegador -> instrucciones de instalación. Token inválido -> 404.
export default function TokenPage({
  params,
}: {
  params: { token: string };
}) {
  const role = tokenRole(params.token);
  if (!role) notFound();
  return <AccessInstall role={role} />;
}
