// iStore Pro — Service Worker (demo)
// Cache mínima de tipo "app shell" para soportar instalación PWA y modo offline básico.
const CACHE = "istore-pro-v2";
const APP_SHELL = ["/", "/dashboard", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Datos en vivo: nunca cachear API.
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;

  // Network-first para navegación, con fallback a caché.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/dashboard")))
    );
    return;
  }

  // Cache-first para estáticos.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
