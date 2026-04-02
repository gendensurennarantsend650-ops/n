/**
 * NABOOSHY - Cloudflare Worker Video Proxy
 * Хамгаалалт: Referer Check, CORS, Range Requests (Seeking), Cyrillic Support
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const referer = request.headers.get("Referer");

    // 1. ХАМГААЛАЛТ: Зөвхөн чиний сайтаас ирсэн хүсэлтийг зөвшөөрнө
    // Хэрэв хүн шууд линкээр орох эсвэл өөр сайт дээр тавибал 403 алдаа өгнө.
    if (!referer || !referer.includes("nabooshy.pages.dev")) {
      return new Response("Хандах эрхгүй! (Forbidden)", { 
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // 2. CORS OPTIONS: Хөтөч видеог ачаалахаас өмнө зөвшөөрөл нэхдэг (Preflight)
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

    // 3. МОНГОЛ НЭР: URL-д байгаа кодчилсон Монгол нэрийг тайлж унших
    // Жишээ нь: %D0%90%D0%BC... -> Амтат_шөнийн...
    let key;
    try {
      key = decodeURIComponent(url.pathname.substring(1));
    } catch (e) {
      key = url.pathname.substring(1);
    }

    // 4. R2-ООС ФАЙЛ ТАТАХ: Range request-ийг дамжуулна (Видеог гүйлгэж үзэхэд хэрэгтэй)
    const object = await env.MY_BUCKET.get(key, {
      range: request.headers,
    });

    // Файл олдохгүй бол 404 алдаа өгнө
    if (!object) {
      return new Response("Файл олдсонгүй: " + key, { status: 404 });
    }

    // 5. ХАРИУ ИЛГЭЭХ: Headers-ийг маш нарийн тохируулах
    const headers = new Headers();
    
    // R2-оос ирсэн мета өгөгдлийг (Content-Type г.м) хуулах
    object.writeHttpMetadata(headers);
    
    // Нэмэлт шаардлагатай толгой мэдээллүүд
    headers.set("Access-Control-Allow-Origin", "https://nabooshy.pages.dev");
    headers.set("Accept-Ranges", "bytes"); // Видеог дундуур нь тоглуулах боломж олгоно
    headers.set("Cache-Control", "public, max-age=3600"); // 1 цаг кэшлэнэ
    headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");

    // Хэрэв видеоны хэсгийг татаж байвал 206 (Partial Content) статус өгнө
    const status = object.body ? (request.headers.get("range") ? 206 : 200) : 304;

    return new Response(object.body, {
      status,
      headers,
    });
  }
};
