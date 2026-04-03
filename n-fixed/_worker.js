// _worker.js — Nabooshy Pages Advanced Worker (2026-04-02)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── 1. AI Endpoint (/api/ai) ──────────────────────────────
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      // CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': 'https://nabooshy.pages.dev',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      try {
        const body = await request.json();
        const userMessage = body.message || '';

        if (!userMessage.trim()) {
          return Response.json({ error: 'Мессеж хоосон байна' }, { status: 400 });
        }

        // Anthropic Claude API дуудах
        const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: 'Та Nabooshy кино стриминг платформын AI туслах юм. Монгол хэлээр хариул. Кино, цуврал, тоглоом зэргийн талаар товч, тустай хариулт өг.',
            messages: [{ role: 'user', content: userMessage }],
          }),
        });

        if (!aiResponse.ok) {
          const err = await aiResponse.text();
          console.error('Anthropic API error:', err);
          return Response.json({ error: 'AI үйлчилгээнд алдаа гарлаа' }, { status: 502 });
        }

        const aiData = await aiResponse.json();
        const reply = aiData.content?.[0]?.text || 'Хариу авахад алдаа гарлаа';

        return Response.json(
          { reply },
          {
            headers: {
              'Access-Control-Allow-Origin': 'https://nabooshy.pages.dev',
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (e) {
        console.error('AI endpoint error:', e);
        return Response.json({ error: 'Серверийн алдаа' }, { status: 500 });
      }
    }

    // ── 2. Бусад бүх хүсэлт → static assets (Pages) ──────────
    return env.ASSETS.fetch(request);
  },
};
