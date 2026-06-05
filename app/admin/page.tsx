import { redirect } from "next/navigation";

// /admin no es una ruta pública del producto: redirige al dashboard.
export default function AdminPage() {
  redirect("/dashboard");
}
