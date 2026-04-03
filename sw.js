// --- START OF FILE sw.js ---

const CACHE_NAME = 'nabooshy-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/config.js',
  '/manifest.json',
  '/pwa-init.js'
];

// 1. СУУЛГАХ (Install): Статик файлуудыг кэшлэх
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ИДЭВХЖҮҮЛЭХ (Activate): Хуучин кэшийг цэвэрлэх
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. ХҮСЭЛТ БАРИХ (Fetch): МАШ ЧУХАЛ ХЭСЭГ
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ── ВИДЕО БОЛОН ПОСТЕРЫГ АЛГАСАХ (BYPASS) ──
  // Хэрэв хүсэлт /movies/ эсвэл /posters/ хавтас руу байвал 
  // Service Worker огт оролцохгүй, шууд сүлжээнээс (Network) авна.
  // Энэ нь 500 алдаа болон видео гацалтыг засна.
  if (url.pathname.startsWith('/movies/') || url.pathname.startsWith('/posters/')) {
    return; // Энд return хийснээр хөтөч өөрөө видеог хэвийн тоглуулна.
  }

  // Бусад статик файлуудыг (HTML, CSS, JS) кэшээс хайх, байхгүй бол сүлжээнээс авах
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Хэрэв интернетгүй үед кэшэд байхгүй файл дуудвал index.html-ийг харуулж болно
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// --- END OF FILE sw.js ---
