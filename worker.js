/**
 * VideoVault — Cloudflare Worker CORS Proxy
 *
 * Deploy this worker to your Cloudflare account, then replace the
 * placeholder URL below in index.html and video.html with your
 * actual worker subdomain:
 *
 *   https://<your-worker>.<your-subdomain>.workers.dev?url=...
 *
 * Usage: GET https://your-worker.workers.dev?url=<encoded-target-url>
 */

const ALLOWED_ORIGINS = ['*']; // Restrict to your domain in production, e.g. ['https://yourdomain.com']

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Range',
  'Access-Control-Max-Age': '86400',
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

    // Forward the request to the target
    let upstreamResponse;
    try {
      upstreamResponse = await fetch(targetURL.toString(), {
        method: request.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VideoVault-Proxy/1.0)',
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': targetURL.origin + '/',
        },
        redirect: 'follow',
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

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  },
};
