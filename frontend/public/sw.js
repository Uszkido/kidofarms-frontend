self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('kido-shell-v1').then((cache) => cache.addAll(['/', '/shop'])));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open('kido-shell-v1').then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
      return cached || network.catch(() => caches.match('/'));
    })
  );
});
