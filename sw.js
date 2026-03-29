const CACHE_NAME = 'nabooshy-v1-2026';
const urlsToCache =[
  '/',
  '/index.html',
  '/style.css',
  '/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // ШИНЭЧЛЭЛ: API болон POST хүсэлтүүдийг Service Worker барихгүй шууд явуулна!
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});