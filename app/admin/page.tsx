import { redirect } from "next/navigation";

// Destino de la liga-llave instalable (start_url -> /<token> -> /admin) y de
// los usuarios autenticados. El acceso ya lo garantiza el middleware (sesión
// Clerk o cookie de llave); aquí entramos directo al panel operativo.
export const dynamic = "force-dynamic";

export default function AdminPage() {
  redirect("/dashboard");
}
