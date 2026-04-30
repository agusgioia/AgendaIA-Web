const CACHE_NAME = "agenda-ia-v2";
const STATIC_ASSETS = ["/", "/index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // Limpiar caches viejas
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  // Para navegación: devolver index.html desde cache
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match("/index.html").then((cached) => cached || fetch(e.request)),
    );
    return;
  }
  // Para el resto: red primero, cache como fallback
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
