// index.js — Nabooshy R2 Media Worker (2026-04-02)

const ALLOWED_ORIGINS = [
  "nabooshy.pages.dev",
  "gendensurennarantsend650-ops.github.io",
  "localhost",
];

function isAllowed(referer) {
  if (!referer) return false;
  return ALLOWED_ORIGINS.some(o => referer.includes(o));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const referer = request.headers.get("Referer") || "";
    const origin  = request.headers.get("Origin")  || "";

    // 1. Хамгаалалт
    if (!isAllowed(referer) && !isAllowed(origin)) {
      return new Response("Хандах эрхгүй!", { status: 403 });
    }

    // 2. CORS headers — зөвшөөрөгдсөн origin-г буцаана
    const allowedOrigin =
      ALLOWED_ORIGINS.find(o => origin.includes(o))
        ? origin
        : "https://nabooshy.pages.dev";

    // 3. CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin":  allowedOrigin,
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age":       "86400",
          "Vary": "Origin",
        },
      });
    }

    // 4. Монгол нэр (Кирилл) тайлах
    let key;
    try {
      key = decodeURIComponent(url.pathname.substring(1));
    } catch {
      key = url.pathname.substring(1);
    }

    if (!key) {
      return new Response("Хаяг дутуу байна", { status: 400 });
    }

    // 5. Cloudflare Cache API
    const cacheKey   = new Request(url.toString(), request);
    const cache      = caches.default;
    const rangeHeader = request.headers.get("range");

    if (!rangeHeader) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    // 6. R2-оос файл авах
    const object = await env.MY_BUCKET.get(key, {
      range: request.headers,
    });

    if (!object) {
      return new Response("Файл олдсонгүй: " + key, { status: 404 });
    }

    // 7. Хариуны header
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Vary", "Origin");
    headers.set("Accept-Ranges", "bytes");

    const isVideo  = key.match(/\.(mp4|m4v|webm|mkv|mov)$/i);
    const isPoster = key.match(/\.(jpg|jpeg|png|webp|avif)$/i);
    if (isVideo)       headers.set("Cache-Control", "public, max-age=7200");
    else if (isPoster) headers.set("Cache-Control", "public, max-age=86400");
    else               headers.set("Cache-Control", "public, max-age=3600");

    const status = object.body ? (rangeHeader ? 206 : 200) : 304;

    // 8. TransformStream streaming
    const { readable, writable } = new TransformStream();
    object.body.pipeTo(writable);

    const response = new Response(readable, { status, headers });

    if (!rangeHeader && status === 200) {
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  },
};
