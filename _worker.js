export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── ВИДЕО БОЛОН ПОСТЕР ХАМГААЛАХ ХЭСЭГ ──
    if (url.pathname.startsWith('/movies/') || url.pathname.startsWith('/posters/')) {
      
      // 1. Хамгаалалтын шалгалт (Referer check)
      const referer = request.headers.get('Referer');
      
      // Хэрэв линкийг шууд Tab дээр нээвэл (Referer байхгүй) 
      // эсвэл өөр вэбсайтаас хандвал хаана.
      if (!referer || !referer.startsWith('https://nabooshy.pages.dev')) {
        return new Response('Хандах эрхгүй! (Access Denied)', { 
          status: 403,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }

      const objectKey = decodeURIComponent(url.pathname.slice(1));
      const range = request.headers.get('range');
      const object = await env.MY_BUCKET.get(objectKey, { range });

      if (!object) return new Response('Файл олдсонгүй!', { status: 404 });

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Access-Control-Allow-Origin', 'https://nabooshy.pages.dev'); // Зөвхөн өөрийн вэбэд зөвшөөрөх
      headers.set('Accept-Ranges', 'bytes');

      if (range && object.range) {
        headers.set('Content-Range', `bytes ${object.range.offset}-${object.range.offset + object.size - 1}/${object.size}`);
      }

      return new Response(object.body, {
        status: range ? 206 : 200,
        headers,
      });
    }

    // Бусад static assets (HTML, CSS, JS)
    return env.ASSETS.fetch(request);
  },
};
