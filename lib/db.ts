// =====================================================================
// iStore Pro — Conexión Neon Postgres (serverless)
// DATABASE_URL viene de las env vars del proyecto en Vercel.
// =====================================================================
import { neon } from "@neondatabase/serverless";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  "";

export const hasDb = Boolean(url);

// sql tagged-template; lanza error claro si no hay connection string.
export const sql = url
  ? neon(url)
  : ((() => {
      throw new Error("DATABASE_URL no configurada");
    }) as unknown as ReturnType<typeof neon>);
