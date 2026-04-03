// ============================================================
// sw.js — Nabooshy Service Worker (2026 Speed Stack)
// Стратеги: Cache First (статик) + Network First (мэдээлэл)
// ============================================================

const CACHE_STATIC = 'nabooshy-static-v2';
const CACHE_DATA   = 'nabooshy-data-v2';

const APP_SHELL = [
  '/', '/index.html',
  '/style.css', '/base.css', '/nave.css', '/hero.css', '/cards.css',
  '/modals.css', '/pages.css',
  '/app.js', '/zar.js', '/data.json', '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_STATIC && k !== CACHE_DATA).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/') || request.method !== 'GET') return;
  if (url.hostname.includes('youtube') || url.hostname.includes('google')) return;

  // TMDB зураг: Cache First
  if (url.hostname.includes('image.tmdb.org')) {
    event.respondWith(
      caches.open(CACHE_DATA).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Статик файл: Cache First
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
    return;
  }

  // HTML: Network First
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).then(res => {
        caches.open(CACHE_STATIC).then(c => c.put(request, res.clone()));
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
