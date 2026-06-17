/**
 * VideoVault — Cloudflare Worker CORS Proxy with Region Bypass
 *
 * Deploy this worker to your Cloudflare account:
 *   wrangler deploy
 *
 * Usage: GET https://your-worker.workers.dev?url=<encoded-target-url>
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Range',
  'Access-Control-Max-Age': '86400',
};

// Headers that help bypass regional restrictions
const BYPASS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'max-age=0',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
};

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only allow GET / HEAD
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const target = searchParams.get('url');

    if (!target) {
      return new Response('Missing required "url" query parameter.', {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Validate the target is an http(s) URL
    let targetURL;
    try {
      targetURL = new URL(target);
    } catch {
      return new Response('Invalid "url" parameter.', { status: 400, headers: CORS_HEADERS });
    }

    if (targetURL.protocol !== 'https:' && targetURL.protocol !== 'http:') {
      return new Response('Only http and https URLs are supported.', {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Forward the request to the target with region bypass headers
    let upstreamResponse;
    try {
      const fetchHeaders = {
        ...BYPASS_HEADERS,
        'Referer': targetURL.origin + '/',
        'X-Forwarded-For': '8.8.8.8', // Use public IP to help bypass geo-blocks
        'X-Forwarded-Proto': 'https',
        'X-Real-IP': '8.8.8.8',
      };

      upstreamResponse = await fetch(targetURL.toString(), {
        method: request.method,
        headers: fetchHeaders,
        redirect: 'follow',
        cf: {
          cacheTtl: 60,
          cacheEverything: true,
          mirage: true,
          polish: 'lossy',
          minify: {
            javascript: false,
            css: false,
            html: false,
          },
          // Bypass geo-blocking by using Cloudflare's edge location
          country: 'US', // Spoof as US traffic
        },
      });
    } catch (err) {
      return new Response(`Upstream fetch failed: ${err.message}`, {
        status: 502,
        headers: CORS_HEADERS,
      });
    }

    // Stream the response back with CORS headers injected
    const responseHeaders = new Headers(upstreamResponse.headers);
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(k, v);
    }
    // Remove headers that can cause issues when re-served
    responseHeaders.delete('content-security-policy');
    responseHeaders.delete('x-frame-options');
    responseHeaders.delete('x-content-type-options');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  },
};
