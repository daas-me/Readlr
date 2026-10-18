const SHELL_CACHE = 'readlr-shell-v1';
const PACK_PREFIX = 'readlr-pack-v1-';
const SHELL = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names
    .filter((name) => name.startsWith('readlr-shell-') && name !== SHELL_CACHE)
    .map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});

async function packMatch(request) {
  const names = await caches.keys();
  for (const name of names) {
    if (!name.startsWith(PACK_PREFIX)) continue;
    const response = await (await caches.open(name)).match(request);
    if (response) return response;
  }
  return null;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/media/readlr2/')) {
    event.respondWith(packMatch(request).then((saved) => saved || fetch(request)));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(SHELL_CACHE).then((cache) => cache.put('/index.html', response.clone()));
      return response;
    }).catch(() => caches.match('/index.html')));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(caches.open(SHELL_CACHE).then(async (cache) => {
      const saved = await cache.match(request);
      if (saved) return saved;
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    }));
  }
});
