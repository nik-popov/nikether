# Nik Ether

Next.js + Tailwind workspace for the Nik Ether radio experience. The site exposes a real-time view of the Icecast stream, integrates with AI-driven visuals, and ships with shadcn/ui components.

## Configuration

Create a `.env.local` file at the project root and supply the following (defaults are provided for Nik Ether's hosted stream):

```
ICECAST_STATUS_URL="https://control.internet-radio.com:2199/external/rpc.php?m=streaminfo.get"
ICECAST_USERNAME="apispopov"
ICECAST_MOUNT="/stream"
ICECAST_TIMEOUT=5000
```

Override these values if you need to point the app at a different Centova/Icecast installation.

## Development

Run the development server:

```bash
npm run dev
```

The app will be available on [http://localhost:9002](http://localhost:9002).

## Cloudflare Workers Deployment

Prerequisites:

- Install and log into the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/):

```bash
npm install -g wrangler
wrangler login
```

- Ensure your Cloudflare account has a Workers plan.
- Create a Cloudflare API token with the **Workers Scripts** and **Pages Write** permissions, or use **Edit Cloudflare Workers** template. Store the token in `CLOUDFLARE_API_TOKEN` and your account identifier in `CLOUDFLARE_ACCOUNT_ID` for CI deployments (add them as project/environment variables). When running locally you can instead rely on `wrangler login`.
- The build step drops a `.assetsignore` file into `.vercel/output/static` so the generated `_worker.js` directory isn't uploaded as a static asset. If you customize the output directory, update `scripts/prepare-cloudflare.js` accordingly.
- Before deploy, `npm run cf:deploy` runs `scripts/verify-backend.js` to hit the Icecast endpoint with the same parameters the Worker uses. Set `SKIP_BACKEND_CHECK=true` if you need to bypass it temporarily (for example, in local dev without Internet access).

### Build and preview locally

```bash
npm run cf:preview
```

This script builds the project with `next-on-pages` and then runs Wrangler's Pages emulator so you can verify the Worker bundle before deploying. Use `npm run cf:build` if you only need to refresh the `.vercel/output` artifacts without starting the preview server.

### Deploy to Workers

```bash
npm run cf:deploy
```

This script triggers a fresh `next-on-pages` build before handing the output (`.vercel/output/static/_worker.js`) to `wrangler deploy`. Update `wrangler.toml` to customize bindings, routes, or environment-specific settings as needed.

> ⚙️ The `wrangler.toml` already excludes the generated `_worker.js` directory from static asset uploads, preventing the deployment warning about exposing worker code.
