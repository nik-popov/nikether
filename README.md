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
npm run cf:build
npm run cf:preview
```

The preview command runs through Wrangler's Pages emulator so you can verify the Worker bundle before deploying.

### Deploy to Workers

```bash
npm run cf:deploy
```

Behind the scenes this runs `next-on-pages deploy`, which produces the Worker bundle (`.vercel/output/static/_worker.js`) and hands it to Cloudflare. Update `wrangler.toml` to customize bindings, routes, or environment-specific settings as needed.
