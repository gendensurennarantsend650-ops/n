export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const referer = request.headers.get("Referer");

    // 1. Хамгаалалт: Зөвхөн чиний сайтаас ирсэн хүсэлтийг зөвшөөрнө
    if (!referer || !referer.includes("nabooshy.pages.dev")) {
      return new Response("Хандах эрхгүй!", { status: 403 });
    }

    // 2. CORS OPTIONS (Хөтөч зөвшөөрөл авахад хэрэгтэй)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://nabooshy.pages.dev",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    // 3. Монгол нэрийг тайлж унших
    let key;
    try {
      key = decodeURIComponent(url.pathname.substring(1));
    } catch (e) {
      key = url.pathname.substring(1);
    }
    
    // 4. R2-оос файлыг авах (Range дамжуулах - Видео гүйлгэхэд хэрэгтэй)
    const object = await env.MY_BUCKET.get(key, {
      range: request.headers, 
    });

    if (!object) {
      return new Response("Файл олдсонгүй: " + key, { status: 404 });
    }

    // 5. Хариу илгээх
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Access-Control-Allow-Origin", "https://nabooshy.pages.dev");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");

    const status = object.body ? (request.headers.get("range") ? 206 : 200) : 304;

    return new Response(object.body, {
      status,
      headers,
    });
  }
};
