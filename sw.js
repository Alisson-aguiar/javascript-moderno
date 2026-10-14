/* ============================================
   Service Worker — JS Moderno PWA
   ============================================ */

const VERSION = 'v1.0.0';
const STATIC_CACHE = `jsm-static-${VERSION}`;
const RUNTIME_CACHE = `jsm-runtime-${VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './tutorial.html',
  './manifest.webmanifest',
  './assets/css/style.css',
  './assets/css/prism-theme.css',
  './assets/js/app.js',
  './assets/js/router.js',
  './assets/js/search.js',
  './assets/js/theme-toggle.js',
  './assets/js/playground.js',
  './assets/data/search-index.json'
];

// Instalação: pré-cacheia estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: estratégia por tipo de recurso
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return; // não intercepta CDN

  // Markdown e índice → network-first, fallback cache
  if (url.pathname.endsWith('.md') || url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML → network-first
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // CSS, JS, imagens → cache-first
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_err) {
    return caches.match('./index.html');
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}
