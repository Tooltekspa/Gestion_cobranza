/* ══════════════════════════════════════════════════
   SERVICE WORKER — Cobranza Tooltek v2
══════════════════════════════════════════════════ */

const CACHE  = 'cobranza-v4';
const ASSETS = [
  '/Gestion_cobranza/',
  '/Gestion_cobranza/index.html',
  '/Gestion_cobranza/manifest.json',
  '/Gestion_cobranza/icon-192.png',
  '/Gestion_cobranza/icon-512.png'
];

// Dominios que NUNCA deben ser interceptados por el SW
const PASSTHROUGH = [
  'script.google.com',
  'script.googleusercontent.com',
  'googleapis.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Dejar pasar SIEMPRE: externos, no-GET, y dominios de Google
  if (e.request.method !== 'GET') return;
  if (PASSTHROUGH.some(d => url.includes(d))) return;
  if (!url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached || new Response('Sin conexión', { status: 503 }));
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
