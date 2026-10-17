const CACHE_NAME = 'token-game-v1';
const STATIC_ASSETS = [
  '/',
  '/coins',
  '/how-to-play',
  '/roadmap',
  '/tokenomics',
  '/leaderboard',
  '/manifest.json',
];

// Install: cache core pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same-origin or navigations
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip API routes — always go to network
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for navigations and static assets
        if (response.ok && (event.request.mode === 'navigate' || url.pathname.startsWith('/assets/'))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback: serve from cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, return the cached home page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
