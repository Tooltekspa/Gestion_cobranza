/* ══════════════════════════════════════════════════
   SERVICE WORKER — Cobranza Tooltek
   Maneja: cache offline + sync en background
══════════════════════════════════════════════════ */

const CACHE   = 'cobranza-v1';
const ASSETS  = [
  '/Gestion_cobranza/',
  '/Gestion_cobranza/index.html',
  '/Gestion_cobranza/manifest.json',
  '/Gestion_cobranza/icon-192.png',
  '/Gestion_cobranza/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('googleapis') || e.request.url.includes('script.google')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && e.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

self.addEventListener('sync', e => {
  if (e.tag === 'sync-visitas') {
    e.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients =>
        clients.forEach(c => c.postMessage({ type: 'DO_SYNC' }))
      )
    );
  }
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
