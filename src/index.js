export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/health" || pathname === "/v2/health") {
      return new Response(JSON.stringify({ ok: true, time: new Date().toISOString() }), {
        headers: { "content-type": "application/json" }
      });
    }
    if (pathname === "/api/list" || pathname === "/v2/api/list") {
      return new Response(JSON.stringify({ ok: true, items: [] }), {
        headers: { "content-type": "application/json" }
      });
    }
    return new Response("FlipTips worker online", { status: 200 });
  }
}
