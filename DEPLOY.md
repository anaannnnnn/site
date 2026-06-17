# Cloudflare Worker Deployment Guide

## Prerequisites

1. **Cloudflare Account** - https://dash.cloudflare.com
2. **Node.js** - https://nodejs.org (LTS version)
3. **Wrangler CLI** - Cloudflare's worker deployment tool

## Step 1: Install Wrangler

```bash
npm install -g wrangler
```

Or with yarn:
```bash
yarn global add wrangler
```

## Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate. Click "Allow" to grant permissions.

## Step 3: Deploy the Worker

```bash
wrangler deploy
```

Wrangler will:
- Read `wrangler.toml` configuration
- Upload `worker.js` to Cloudflare
- Deploy to your workers.dev subdomain

## Step 4: Get Your Worker URL

After deployment, you'll see:
```
✓ Uploaded videovault-proxy (0.15 sec)
✓ Published videovault-proxy
https://videovault-proxy.<your-account>.workers.dev
```

**Important:** Update your proxy URL if it's different!

## Step 5: Test the Deployment

Replace `YOUR_WORKER_URL` with your actual URL:

```bash
curl "YOUR_WORKER_URL?url=https%3A%2F%2Fwww.eporner.com%2Fapi%2Fv2%2Fvideo%2Fsearch%2F%3Fquery%3Dtrending%26per_page%3D5%26format%3Djson"
```

Should return JSON with videos.

## Step 6: Update App Configuration (Optional)

If your worker URL changed, update in `index.html` and `video.html`:

```javascript
const PROXY_URLS = [
  'https://YOUR_NEW_WORKER_URL.workers.dev',
];
```

## Troubleshooting

**"Not authenticated"**
- Run `wrangler login` again

**"Worker not found"**
- Check `wrangler.toml` has correct name
- Run `wrangler whoami` to verify account

**"Timeout errors"**
- Check Cloudflare account has Workers enabled
- Verify account has free tier Workers available

## API Endpoints

Once deployed, use:

**Search:**
```
https://YOUR_WORKER_URL.workers.dev?url=https%3A%2F%2Fwww.eporner.com%2Fapi%2Fv2%2Fvideo%2Fsearch%2F%3Fquery%3Dtrending%26per_page%3D30%26format%3Djson
```

**Get Video:**
```
https://YOUR_WORKER_URL.workers.dev?url=https%3A%2F%2Fwww.eporner.com%2Fapi%2Fv2%2Fvideo%2Fid%2F%3Fid%3DVIDEO_ID%26thumbsize%3Dbig%26format%3Djson
```

## More Info

- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
