export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Зөвхөн /api/ai хаяг руу хандвал AI логикийг ажиллуулна
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      try {
        const body = await request.json();

        // 11 түлхүүрийг шалгах
        const keys = [];
        for (let i = 1; i <= 11; i++) {
          if (env[`GEMINI_KEY_${i}`]) {
            keys.push(env[`GEMINI_KEY_${i}`]);
          }
        }

        if (keys.length === 0) {
          return new Response(JSON.stringify({ error: "API Key олдсонгүй" }), { status: 500 });
        }

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const MODEL = "gemini-2.5-flash-lite";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${randomKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Google API алдаа", details: data }), { status: response.status });
        }

        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: "Серверийн алдаа", details: error.message }), { status: 500 });
      }
    }

    // Бусад бүх хандалтыг (index.html, css, js) хэвийнээр нь уншуулна
    // Early Hints нь _headers файлаар Cloudflare дамжуулан ажиллана
    return env.ASSETS.fetch(request);
  }
};
