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
