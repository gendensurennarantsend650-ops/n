export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. AI-ийн хэсэг (Хэвээрээ үлдэнэ)
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      // ... (таны өмнөх AI код энд байна) ...
    }

    // 2. 🔥 ШИНЭ: R2 Bucket-аас кино болон зураг унших хэсэг
    // Хэрэв хаяг нь /movies/ эсвэл /posters/ гэж эхэлсэн байвал R2-оос хайна
    if (url.pathname.startsWith('/movies/') || url.pathname.startsWith('/posters/')) {
      const objectKey = decodeURIComponent(url.pathname.slice(1)); // /movies/test.mp4 -> movies/test.mp4
      const object = await env.MY_BUCKET.get(objectKey); // MY_BUCKET гэдэг нь таны R2-ийн нэр

      if (object === null) {
        return new Response('Файл олдсонгүй', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Access-Control-Allow-Origin', '*'); // Бусад сайтаас хандах эрх нээх
      headers.set('Accept-Ranges', 'bytes'); // Кино гүйлгэж үзэхэд хэрэгтэй

      return new Response(object.body, {
        headers,
      });
    }

    // Бусад бүх хандалтыг (index.html, css, js) хэвийнээр нь уншуулна
    return env.ASSETS.fetch(request);
  }
};
