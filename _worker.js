export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/movies/') || url.pathname.startsWith('/posters/')) {
      const objectKey = decodeURIComponent(url.pathname.slice(1));
      const range = request.headers.get('range');
      
      // Хамгаалалт: Зөвхөн өөрийн вэбээс хандахыг зөвшөөрөх
      const referer = request.headers.get('Referer');
      if (!referer && !url.searchParams.has('preview')) {
        return new Response('Access Denied', { status: 403 });
      }

      const object = await env.MY_BUCKET.get(objectKey, { range });
      if (!object) return new Response('Not Found', { status: 404 });

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Access-Control-Allow-Origin', 'https://nabooshy.pages.dev');
      headers.set('Accept-Ranges', 'bytes');

      return new Response(object.body, {
        status: range ? 206 : 200,
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
