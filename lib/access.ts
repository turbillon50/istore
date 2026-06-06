// =====================================================================
// iStore Pro — Patrón "liga-llave" (acceso a módulos de administración).
// La liga ES la llave: una URL secreta /<TOKEN> instala una cookie de
// acceso de 1 año que abre el panel sin contraseña (paralelo a Clerk).
//
// Tokens (NUNCA en el repo — solo en env de Vercel y en el brain):
//   ADMIN_LINK_TOKEN  -> rol "admin" (acceso total)
//   STAFF_LINK_TOKEN  -> rol "staff" (opcional)
//
// La cookie guarda el propio token; se re-valida contra el env en cada
// request, así que falsificarla exige conocer el token (= ya autorizado).
// =====================================================================

export const ACCESS_COOKIE = "istore_key";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 365; // 1 año en segundos

export type AccessRole = "admin" | "staff";

/** Devuelve el rol que corresponde a un token, o null si no es válido. */
export function tokenRole(token: string | undefined | null): AccessRole | null {
  if (!token) return null;
  const admin = process.env.ADMIN_LINK_TOKEN;
  const staff = process.env.STAFF_LINK_TOKEN;
  if (admin && token === admin) return "admin";
  if (staff && token === staff) return "staff";
  return null;
}
