import { NextResponse } from "next/server";
import { normalizeCentovaResponse, normalizeIcecastResponse } from "@/lib/icecast";

const DECODER_PRIORITIES = ["utf-8", "iso-8859-1", "latin1"] as const;
const DIRECT_STREAM_HINTS = [".mp3", ".aac", ".aacp", ".m4a", ".ogg", ".opus", ".webm"] as const;
const PLAYLIST_EXTENSIONS = [".m3u", ".m3u8", ".pls", ".xspf"] as const;
const CLOUDFLARE_ALLOWED_PORTS = new Set(["", "80", "443", "2052", "2053", "2082", "2083", "2086", "2087", "2095", "2096"]);

const decodeJson = (buffer: ArrayBuffer): unknown => {
  for (const encoding of DECODER_PRIORITIES) {
    try {
      const decoder = new TextDecoder(encoding, { fatal: false });
      const text = decoder.decode(buffer);
      if (!text) continue;
      return JSON.parse(text);
    } catch {
      // Continue to next encoding option
    }
  }

  throw new Error("Unable to decode Icecast response payload");
};

const isLikelyDirectStream = (url: string): boolean => {
  const normalized = url.toLowerCase();
  if (DIRECT_STREAM_HINTS.some((hint) => normalized.includes(hint))) {
    return true;
  }

  return normalized.includes("/stream") || normalized.includes(";stream");
};

const shouldResolvePlaylist = (url: string): boolean => {
  const normalized = url.toLowerCase();
  return PLAYLIST_EXTENSIONS.some((ext) => normalized.endsWith(ext));
};

const extractUrlsFromPlaylist = (content: string): string[] => {
  const urls = new Set<string>();
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(content)) !== null) {
    try {
      const candidate = new URL(match[1]);
      urls.add(candidate.toString());
    } catch {
      // Ignore invalid URLs
    }
  }

  return Array.from(urls);
};

const resolvePlaybackUrl = async (url: string | null, signal: AbortSignal): Promise<string | null> => {
  if (!url) return null;
  if (isLikelyDirectStream(url) || !shouldResolvePlaylist(url)) {
    return url;
  }

  try {
    let playlistUrl: URL;

    try {
      playlistUrl = new URL(url);
    } catch {
      return url;
    }

    const { adjusted: workerCompatibleUrl } = ensureWorkerCompatiblePort(playlistUrl);

    const response = await fetch(workerCompatibleUrl.toString(), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal,
      headers: {
        "User-Agent": "Nik-Ether-Status/1.0",
        Accept: "application/vnd.apple.mpegurl, application/x-mpegurl, application/pls+xml, application/xspf+xml, audio/x-mpegurl, text/plain, */*",
      },
    });

    if (!response.ok) {
      return url;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.startsWith("audio/")) {
      return url;
    }

    const body = await response.text();
    const candidates = extractUrlsFromPlaylist(body);
    if (candidates.length === 0) {
      return url;
    }

    const preferred = candidates.find((candidate) => isLikelyDirectStream(candidate));
    return preferred ?? candidates[0];
  } catch {
    return url;
  }
};

const DEFAULT_STATUS_URL =
  process.env.ICECAST_STATUS_URL ??
  "https://control.internet-radio.com/external/rpc.php?m=streaminfo.get";
const DEFAULT_USERNAME = process.env.ICECAST_USERNAME ?? "apispopov";
const DEFAULT_MOUNT = process.env.ICECAST_MOUNT ?? "/stream";
const REQUEST_TIMEOUT = Number(process.env.ICECAST_TIMEOUT ?? 5000);

export const revalidate = 0;
export const runtime = "edge";

type WorkerCompatibilityResult = {
  adjusted: URL;
  portAdjusted: boolean;
  originalPort: string | null;
};

const ensureWorkerCompatiblePort = (incoming: URL): WorkerCompatibilityResult => {
  const clone = new URL(incoming.toString());
  const port = clone.port;

  if (!clone.protocol.startsWith("http")) {
    return {
      adjusted: clone,
      portAdjusted: false,
      originalPort: null,
    };
  }

  if (CLOUDFLARE_ALLOWED_PORTS.has(port)) {
    return {
      adjusted: clone,
      portAdjusted: false,
      originalPort: null,
    };
  }

  const adjusted = new URL(clone.toString());
  adjusted.port = "";

  return {
    adjusted,
    portAdjusted: true,
    originalPort: port || null,
  };
};

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  let requestedUrl = DEFAULT_STATUS_URL;
  let resolvedUrl = DEFAULT_STATUS_URL;
  let portAdjusted = false;
  let originalPort: string | null = null;

  try {
    const url = new URL(DEFAULT_STATUS_URL);
    const mount = DEFAULT_MOUNT.startsWith("/") ? DEFAULT_MOUNT : `/${DEFAULT_MOUNT}`;
    const isCentovaEndpoint = url.pathname.endsWith("/external/rpc.php");
    const mountParam = isCentovaEndpoint ? "mountpoint" : "mount";

    if (DEFAULT_USERNAME && !url.searchParams.has("username")) {
      url.searchParams.set("username", DEFAULT_USERNAME);
    }

    if (mount && !url.searchParams.has(mountParam)) {
      url.searchParams.set(mountParam, mount);
    }

    const compatibility = ensureWorkerCompatiblePort(url);
    const workerUrl = compatibility.adjusted;
    portAdjusted = compatibility.portAdjusted;
    originalPort = compatibility.originalPort;
    requestedUrl = url.toString();
    resolvedUrl = workerUrl.toString();

    const response = await fetch(resolvedUrl, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "Nik-Ether-Status/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorMessage = `Icecast status request failed with ${response.status}`;
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const payload = decodeJson(buffer);
    const includeRaw = process.env.NODE_ENV !== "production";
    const payloadRecord = (payload ?? {}) as Record<string, unknown>;
    const typeProperty = typeof payloadRecord.type === "string" ? (payloadRecord.type as string) : null;
    const dataProperty = Array.isArray(payloadRecord.data) ? (payloadRecord.data as unknown[]) : null;
    const isCentovaPayload = Boolean(typeProperty && dataProperty);

    const status = isCentovaPayload
      ? normalizeCentovaResponse(payload, {
          mount,
          includeRaw,
          username: DEFAULT_USERNAME,
        })
      : normalizeIcecastResponse(payload, {
          mount,
          includeRaw,
        });

    const playbackUrl = await resolvePlaybackUrl(status.playbackUrl ?? status.listenUrl, controller.signal);
    const enhancedStatus = {
      ...status,
      playbackUrl: playbackUrl ?? status.playbackUrl ?? status.listenUrl ?? null,
    };
    const upstreamMeta = {
      requested: requestedUrl,
      resolved: resolvedUrl,
      portFallbackApplied: portAdjusted,
      originalPort: originalPort ?? undefined,
    };

    return NextResponse.json({
      status: enhancedStatus,
      updatedAt: new Date().toISOString(),
      upstream: resolvedUrl,
      upstreamMeta,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Icecast status request timed out"
        : error instanceof Error
          ? error.message
          : "Unexpected error while fetching Icecast status";

    const statusCode = message.includes("timed out") ? 504 : 500;
    const portGuidance =
      portAdjusted && originalPort
        ? ` Cloudflare Workers cannot reach port ${originalPort}. Please expose the endpoint on an allowed port (80, 443, 2052, 2053, 2082, 2083, 2086, 2087, 2095, or 2096) or update ICECAST_STATUS_URL to use one of those ports.`
        : "";

    return NextResponse.json(
      {
        error: `${message}${portGuidance}`.trim(),
        upstream: resolvedUrl,
        upstreamMeta: {
          requested: requestedUrl,
          resolved: resolvedUrl,
          portFallbackApplied: portAdjusted,
          originalPort: originalPort ?? undefined,
        },
      },
      { status: statusCode }
    );
  } finally {
    clearTimeout(timeout);
  }
}
