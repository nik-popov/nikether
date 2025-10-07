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
