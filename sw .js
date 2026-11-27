const CACHE = 'shopsmart-v10';
const CACHE_PREFIX = 'shopsmart-';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      // Nur eigene, alte ShopSmart-Caches löschen — Caches anderer Apps derselben Domain bleiben unberührt
      caches.keys().then(keys => Promise.all(
        keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k))
      )),
      self.clients.claim()
    ])
  );
});
