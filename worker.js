// ═══════════════════════════════════════════
// Cloudflare Worker — CORS Proxy for Gemini API
// ═══════════════════════════════════════════
// نصب:
// 1. برو به dash.cloudflare.com → Workers & Pages → Create
// 2. نام بذار (مثلا: gemini-proxy)
// 3. کد زیر رو جایگزین کن
// 4. Deploy کن
// 5. لینک Worker رو کپی کن (مثلا: https://gemini-proxy.你的username.workers.dev)
// 6. آخرش ?url= اضافه کن → https://gemini-proxy.你的username.workers.dev/?url=
// ═══════════════════════════════════════════

export default {
  async fetch(request, env) {
    // فقط درخواست‌های OPTIONS (preflight) و POST/GET قبول
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'CORS Proxy فعاله ✅ — لینک API رو به عنوان ?url= بفرست',
        usage: request.url + '?url=https://generativelanguage.googleapis.com/...',
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // ساخت درخواست به API اصلی
      const apiRequest = new Request(target, {
        method: request.method,
        headers: (() => {
          const h = new Headers();
          h.set('Content-Type', 'application/json');
          // Forward authorization header if present
          const auth = request.headers.get('Authorization');
          if (auth) h.set('Authorization', auth);
          return h;
        })(),
        body: request.method !== 'GET' ? request.body : undefined,
      });

      const response = await fetch(apiRequest);

      // ساخت پاسخ با CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      };

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        _proxy: true,
        _error: error.message,
        target: target,
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
