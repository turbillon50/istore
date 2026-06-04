"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    // En GitHub Pages la app vive bajo un basePath (/istore); el SW de la raíz
    // no aplica, así que lo omitimos para evitar 404. En Vercel/local sí se registra.
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    if (basePath) return;
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* silenciar en demo */
      });
    }
  }, []);
  return null;
}
