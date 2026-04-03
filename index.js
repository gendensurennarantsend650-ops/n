// index.js — Nabooshy R2 Media Worker (2026-04-02)
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const referer = request.headers.get("Referer");

    // 1. Хамгаалалт: зөвхөн nabooshy.pages.dev-аас ирсэн хүсэлт
    if (!referer || !referer.includes("nabooshy.pages.dev")) {
      return new Response("Хандах эрхгүй!", { status: 403 });
    }

    // 2. CORS preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://nabooshy.pages.dev",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 3. Монгол нэр (Кирилл) тайлах
    let key;
    try {
      key = decodeURIComponent(url.pathname.substring(1));
    } catch {
      key = url.pathname.substring(1);
    }

    if (!key) {
      return new Response("Хаяг дутуу байна", { status: 400 });
    }

    // 4. Cloudflare Cache API — ижил файлыг дахин R2-оос татахгүй
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // Cache-аас хайх (зөвхөн Range-гүй хүсэлтэд)
    const rangeHeader = request.headers.get("range");
    if (!rangeHeader) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    // 5. R2-оос файл авах (Range дамжуулах — видео seek-д зайлшгүй)
    const object = await env.MY_BUCKET.get(key, {
      range: request.headers,
    });

    if (!object) {
      return new Response("Файл олдсонгүй: " + key, { status: 404 });
    }

    // 6. Хариуны header бэлтгэх
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Access-Control-Allow-Origin", "https://nabooshy.pages.dev");
    headers.set("Accept-Ranges", "bytes");

    // Видео болон зурагт тохирсон cache тохиргоо
    const isVideo = key.match(/\.(mp4|m4v|webm|mkv|mov)$/i);
    const isPoster = key.match(/\.(jpg|jpeg|png|webp|avif)$/i);
    if (isVideo) {
      headers.set("Cache-Control", "public, max-age=7200");
    } else if (isPoster) {
      headers.set("Cache-Control", "public, max-age=86400");
    } else {
      headers.set("Cache-Control", "public, max-age=3600");
    }

    const status = object.body
      ? rangeHeader ? 206 : 200
      : 304;

    // 7. TransformStream — том файлыг buffer хийхгүйгээр streaming
    const { readable, writable } = new TransformStream();
    object.body.pipeTo(writable);

    const response = new Response(readable, { status, headers });

    // 8. Range-гүй хүсэлтийг cache-д хадгалах (ар талд)
    if (!rangeHeader && status === 200) {
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  },
};
