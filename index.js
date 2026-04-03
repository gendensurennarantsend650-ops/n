// index.js — Nabooshy R2 Media Worker (2026-04-03 Төгс хувилбар)

const ALLOWED_ORIGINS =[
  "nabooshy.pages.dev",
  "gendensurennarantsend650-ops.github.io",
  "localhost",
];

function isAllowed(urlStr) {
  if (!urlStr) return false;
  return ALLOWED_ORIGINS.some(o => urlStr.includes(o));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const referer = request.headers.get("Referer") || "";
    const origin  = request.headers.get("Origin")  || "";

    // 1. ХАМГААЛАЛТ: Зөвхөн зөвшөөрөгдсөн сайтаас хандахыг шалгах
    if (!isAllowed(referer) && !isAllowed(origin)) {
      return new Response("Хандах эрхгүй! (Access Denied)", { status: 403 });
    }

    const allowedOrigin = ALLOWED_ORIGINS.find(o => origin.includes(o)) ? origin : "https://nabooshy.pages.dev";

    // 2. CORS PREFLIGHT: Браузерын шалгалтыг нэвтрүүлэх
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Range, Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin",
        },
      });
    }

    // 3. URL-аас видеоны нэрийг гаргаж авах (Монгол кирилл үсгийг тайлах)
    let key;
    try {
      key = decodeURIComponent(url.pathname.substring(1));
    } catch {
      key = url.pathname.substring(1);
    }

    if (!key) {
      return new Response("Хаяг дутуу байна", { status: 400 });
    }

    // 4. RANGE REQUEST: Видеог гүйлгэж үзэхэд зориулсан тохиргоо
    const rangeHeader = request.headers.get("range");
    const r2Options = {};
    if (rangeHeader) {
      r2Options.range = request.headers; // R2 руу Range мэдээллийг дамжуулах
    }

    // 5. R2 BUCKET-ААС ФАЙЛ ТАТАХ
    const object = await env.MY_BUCKET.get(key, r2Options);

    if (!object) {
      return new Response("Файл олдсонгүй: " + key, { status: 404 });
    }

    // 6. ХАРИУНЫ HEADERS ТОХИРУУЛАХ
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Vary", "Origin");
    headers.set("Accept-Ranges", "bytes"); // Видео гүйлгэхийг дэмжинэ гэдгээ зарлах
    headers.set("etag", object.httpEtag);

    // Cache-Control (Браузерт хэр удаан хадгалахыг заах)
    const isVideo  = key.match(/\.(mp4|m4v|webm|mkv|mov|ts|m3u8)$/i);
    if (isVideo) {
      headers.set("Cache-Control", "public, max-age=7200");
    } else {
      headers.set("Cache-Control", "public, max-age=86400");
    }

    // Хэрэв Range хүсэлт ирсэн бол 206 (Partial Content), үгүй бол 200 (OK)
    const status = object.body ? (rangeHeader ? 206 : 200) : 304;

    // 7. ШУУД ДАМЖУУЛАХ (Хамгийн чухал өөрчлөлт)
    // TransformStream болон Cache API ашиглахгүйгээр шууд object.body-г буцаана.
    // Энэ нь 1GB+ хэмжээтэй файлыг ямар ч санах ойн ачаалалгүйгээр дамжуулах цорын ганц зөв арга юм.
    return new Response(object.body, { 
      status, 
      headers 
    });
  }
};