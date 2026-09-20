const CACHE = 'shopsmart-v9';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    // cache:'no-store' zwingt den Browser, wirklich jedes Mal frisch vom
    // Server zu holen, statt die HTTP-eigene Zwischenspeicherung von
    // GitHub Pages zu nutzen. Nur wenn das (z.B. offline) fehlschlägt,
    // greifen wir auf die zuletzt bekannte Version aus dem SW-Cache zurück.
    fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )),
      self.clients.claim()
    ])
  );
});
