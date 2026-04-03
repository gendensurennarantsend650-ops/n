export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── 1. ВИДЕО БОЛОН ПОСТЕР (R2-оос татах хэсэг) ─────────────────
    // Хэрэв линк /movies/ эсвэл /posters/ гэж эхэлсэн байвал R2-оос хайна
    if (url.pathname.startsWith('/movies/') || url.pathname.startsWith('/posters/')) {
      const objectKey = url.pathname.slice(1); // 'movies/video.mp4' гэх мэт болно
      
      // R2-оос файлыг хайх (env.MY_BUCKET гэдэг нь таны R2 binding нэр)
      const object = await env.MY_BUCKET.get(objectKey);

      if (!object) {
        return new Response('Файл олдсонгүй!', { status: 404 });
      }

      // Видеог гацалтгүй тоглуулах (Streaming) толгой мэдээлэл
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Access-Control-Allow-Origin', '*'); // CORS зөвшөөрөх
      headers.set('Accept-Ranges', 'bytes');

      return new Response(object.body, {
        headers,
      });
    }

    // ── 2. AI Endpoint (/api/ai) ──────────────────────────────
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      try {
        const body = await request.json();
        const userMessage = body.message || '';

        const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: 'Та Nabooshy-ийн AI туслах. Монгол хэлээр хариул.',
            messages: [{ role: 'user', content: userMessage }],
          }),
        });

        const aiData = await aiResponse.json();
        return Response.json({ reply: aiData.content[0].text }, {
          headers: { 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return Response.json({ error: 'AI алдаа' }, { status: 500 });
      }
    }

    // ── 3. Бусад бүх хүсэлт → Static Assets (HTML, CSS, JS) ─────
    return env.ASSETS.fetch(request);
  },
};
