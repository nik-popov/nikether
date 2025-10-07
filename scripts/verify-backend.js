#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { setTimeout: setNodeTimeout, clearTimeout: clearNodeTimeout } = require('timers');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

if ((process.env.SKIP_BACKEND_CHECK ?? '').toLowerCase() === 'true') {
  console.log('⚠️  Skipping backend reachability check because SKIP_BACKEND_CHECK=true.');
  process.exit(0);
}

const CLOUDFLARE_ALLOWED_PORTS = new Set(['', '80', '443', '2052', '2053', '2082', '2083', '2086', '2087', '2095', '2096']);

const DEFAULT_STATUS_URL = process.env.ICECAST_STATUS_URL ??
  'https://control.internet-radio.com/external/rpc.php?m=streaminfo.get';
const DEFAULT_USERNAME = process.env.ICECAST_USERNAME ?? 'apispopov';
const DEFAULT_MOUNT = process.env.ICECAST_MOUNT ?? '/stream';
const REQUEST_TIMEOUT = Number(process.env.ICECAST_TIMEOUT ?? 5000);

const ensureWorkerCompatiblePort = (incoming) => {
  const clone = new URL(incoming.toString());

  if (!clone.protocol.startsWith('http')) {
    return {
      url: clone,
      portAdjusted: false,
      originalPort: null,
    };
  }

  if (CLOUDFLARE_ALLOWED_PORTS.has(clone.port)) {
    return {
      url: clone,
      portAdjusted: false,
      originalPort: null,
    };
  }

  const adjusted = new URL(clone.toString());
  adjusted.port = '';

  return {
    url: adjusted,
    portAdjusted: true,
    originalPort: clone.port || null,
  };
};

const buildStatusUrl = () => {
  try {
    const url = new URL(DEFAULT_STATUS_URL);
    const mount = DEFAULT_MOUNT.startsWith('/') ? DEFAULT_MOUNT : `/${DEFAULT_MOUNT}`;
    const isCentovaEndpoint = url.pathname.endsWith('/external/rpc.php');
    const mountParam = isCentovaEndpoint ? 'mountpoint' : 'mount';

    if (DEFAULT_USERNAME && !url.searchParams.has('username')) {
      url.searchParams.set('username', DEFAULT_USERNAME);
    }

    if (mount && !url.searchParams.has(mountParam)) {
      url.searchParams.set(mountParam, mount);
    }

    return url;
  } catch (error) {
    console.error('❌ Invalid ICECAST_STATUS_URL:', error.message);
    process.exit(1);
  }
};

const controller = new AbortController();
const timeout = setNodeTimeout(() => controller.abort(), REQUEST_TIMEOUT);

(async () => {
  const url = buildStatusUrl();
  console.log(`🔍 Checking Icecast status endpoint: ${url.toString()}`);

  const compatibility = ensureWorkerCompatiblePort(url);
  const targetUrl = compatibility.url;

  if (compatibility.portAdjusted && compatibility.originalPort) {
    console.warn(
      `⚠️  Port ${compatibility.originalPort} is not reachable from Cloudflare Workers. Attempting fallback to ${targetUrl.toString()}.`
    );
  }

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'User-Agent': 'Nik-Ether-Deployment-Check/1.0',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Icecast status request failed with HTTP ${response.status}.`);
      process.exit(1);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      console.warn(`⚠️  Unexpected content-type "${contentType}". Continuing but please confirm.`);
    }

    const body = await response.text();
    try {
      JSON.parse(body);
    } catch (error) {
      console.warn('⚠️  Response was not valid JSON. Continuing but please confirm backend output.');
    }

    if (compatibility.portAdjusted && compatibility.originalPort) {
      console.log(
        '✅ Backend reachable via Cloudflare-compatible port. Update ICECAST_STATUS_URL to use this URL for production.'
      );
    } else {
      console.log('✅ Backend reachable and responded successfully.');
    }

    process.exit(0);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`❌ Backend check timed out after ${REQUEST_TIMEOUT}ms.`);
    } else {
      console.error('❌ Backend check failed:', error.message || error);
      if (compatibility.portAdjusted && compatibility.originalPort) {
        console.error(
          'ℹ️  Hint: expose the endpoint on an allowed port (80, 443, 2052, 2053, 2082, 2083, 2086, 2087, 2095, or 2096) or configure ICECAST_STATUS_URL accordingly.'
        );
      }
    }
    process.exit(1);
  } finally {
    clearNodeTimeout(timeout);
  }
})();
