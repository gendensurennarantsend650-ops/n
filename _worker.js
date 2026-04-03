export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── 1. ВИДЕО БОЛОН ПОСТЕР (R2-оос дамжуулах хэсэг) ──
    if (url.pathname.startsWith('/movies/') || url.pathname.startsWith('/posters/')) {
      const key = decodeURIComponent(url.pathname.substring(1));
      const range = request.headers.get('range');

      try {
        const object = await env.MY_BUCKET.get(key, {
          range: range,
        });

        if (!object) {
          return new Response('Файл олдсонгүй!', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Accept-Ranges', 'bytes');
        
        if (key.toLowerCase().endsWith('.mp4')) {
          headers.set('Content-Type', 'video/mp4');
        }

        return new Response(object.body, {
          status: range ? 206 : 200,
          headers,
        });
      } catch (e) {
        return new Response('R2 Алдаа: ' + e.message, { status: 500 });
      }
    }

    // ── 2. AI ENDPOINT (/api/ai) ──
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

    // ── 3. БУСАД СТАТИК ФАЙЛУУД (HTML, CSS, JS) ──
    return env.ASSETS.fetch(request);
  },
};