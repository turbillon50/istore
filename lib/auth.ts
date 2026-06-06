// =====================================================================
// iStore Pro — Auth (Clerk). El cableado completo está listo; se activa
// automáticamente cuando existen las env vars:
//   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_live_...)
//   CLERK_SECRET_KEY                  (sk_live_...)
// Sin keys, la app corre en modo demo (sin auth) para no romper deploys.
// =====================================================================
export const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);
