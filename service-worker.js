const CACHE_NAME = 'resume-builder-v1';
const RUNTIME_CACHE = 'resume-runtime-v1';
const PRECACHE_URLS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME && n !== RUNTIME_CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    event.respondWith(networkFirst(event.request));
  } else {
    event.respondWith(cacheFirst(event.request));
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) { const c = await caches.open(CACHE_NAME); c.put(req, res.clone()); }
    return res;
  } catch (e) {
    const fallback = await caches.match('./index.html');
    return fallback || new Response('آفلاین', { status: 503 });
  }
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) { const c = await caches.open(RUNTIME_CACHE); c.put(req, res.clone()); }
    return res;
  } catch (e) {
    const cached = await caches.match(req);
    return cached || new Response('آفلاین', { status: 503 });
  }
}
