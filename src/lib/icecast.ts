import { z } from "zod";

const numberLikeSchema = z.union([z.string(), z.number()]);

type NumberLike = z.infer<typeof numberLikeSchema>;

const icecastSourceSchema = z
  .object({
    listenurl: z.string().optional(),
    server_name: z.string().optional(),
    server_description: z.string().optional(),
    server_type: z.string().optional(),
    audio_info: z.string().optional(),
    bitrate: numberLikeSchema.optional(),
    channels: numberLikeSchema.optional(),
    genre: z.string().optional(),
    listener_peak: numberLikeSchema.optional(),
    listeners: numberLikeSchema.optional(),
    title: z.string().optional(),
    stream_start: z.string().optional(),
    stream_start_iso8601: z.string().optional(),
    mount: z.string().optional(),
  })
  .passthrough();

const icecastStatsSchema = z
  .object({
    admin: z.string().optional(),
    host: z.string().optional(),
    location: z.string().optional(),
    server_id: z.string().optional(),
    server_start: z.string().optional(),
    server_start_iso8601: z.string().optional(),
    source: z.union([icecastSourceSchema, z.array(icecastSourceSchema)]).optional(),
  })
  .passthrough();

const icecastResponseSchema = z.object({
  icestats: icecastStatsSchema.optional(),
});

const centovaTrackSchema = z
  .object({
    artist: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    album: z.string().nullable().optional(),
    imageurl: z.string().nullable().optional(),
  })
  .passthrough();

const centovaStreamSchema = z
  .object({
    title: z.string().optional(),
    song: z.string().optional(),
    summary: z.string().optional(),
    track: centovaTrackSchema.optional(),
    bitrate: z.union([z.string(), z.number()]).optional(),
    server: z.string().optional(),
    autodj: z.union([z.string(), z.boolean()]).optional(),
    source: z.union([z.string(), z.boolean()]).optional(),
    offline: z.boolean().optional(),
    listeners: numberLikeSchema.optional(),
    listenertotal: numberLikeSchema.optional(),
    maxlisteners: numberLikeSchema.optional(),
    rawmeta: z.string().optional(),
    mountpoint: z.string().optional(),
    tuneinurl: z.string().optional(),
    tuneinurltls: z.string().optional(),
    proxytuneinurl: z.string().optional(),
    proxytuneinurltls: z.string().optional(),
    tuneinformat: z.string().optional(),
    servertype: z.string().optional(),
    webplayer: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    url: z.string().optional(),
  })
  .passthrough();

const centovaResponseSchema = z
  .object({
    type: z.string(),
    rid: z.union([z.string(), z.number()]).optional(),
    data: z.array(centovaStreamSchema).optional(),
    error: z.string().optional(),
  })
  .passthrough();

export type IcecastResponse = z.infer<typeof icecastResponseSchema>;
export type IcecastSource = z.infer<typeof icecastSourceSchema>;
export type CentovaResponse = z.infer<typeof centovaResponseSchema>;
export type CentovaStreamInfo = z.infer<typeof centovaStreamSchema>;

export type IcecastTrackInfo = {
  artist: string | null;
  title: string | null;
  album: string | null;
  artworkUrl: string | null;
};

export type IcecastStatus = {
  isOnline: boolean;
  mount: string;
  streamName: string | null;
  streamDescription: string | null;
  contentType: string | null;
  streamStarted: string | null;
  bitrate: number | null;
  listeners: number | null;
  listenerPeak: number | null;
  genre: string | null;
  currentlyPlaying: string | null;
  track: IcecastTrackInfo | null;
  listenUrl: string | null;
  playbackUrl: string | null;
  server: {
    host: string | null;
    admin: string | null;
    location: string | null;
    version: string | null;
  };
  raw?: unknown;
};

export type IcecastNormalizeOptions = {
  mount?: string;
  includeRaw?: boolean;
};

export type CentovaNormalizeOptions = IcecastNormalizeOptions & {
  username?: string;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const parseAudioInfo = (audioInfo?: string) => {
  if (!audioInfo) {
    return {} as { bitrate?: number | null; channels?: number | null; samplerate?: number | null };
  }

  const result: { bitrate?: number | null; channels?: number | null; samplerate?: number | null } = {};
  const segments = audioInfo.split(";").map((segment) => segment.trim());

  for (const segment of segments) {
    if (!segment.includes("=")) continue;
    const [key, rawValue] = segment.split("=");
    const normalizedKey = key.trim().toLowerCase();
    const value = rawValue.trim();

    switch (normalizedKey) {
      case "bitrate":
        result.bitrate = toNumber(value);
        break;
      case "channels":
        result.channels = toNumber(value);
        break;
      case "samplerate":
        result.samplerate = toNumber(value);
        break;
      default:
        break;
    }
  }

  return result;
};

const toIsoDate = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const ensureMountFormat = (mount?: string): string | null => {
  if (!mount || mount === "/") return null;
  return mount.startsWith("/") ? mount : `/${mount}`;
};

const parseBitrate = (value: unknown): number | null => {
  const numeric = toNumber(value);
  if (numeric !== null) return numeric;

  if (typeof value === "string") {
    const match = value.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (match) {
      const parsed = Number(match[1]);
      return Number.isNaN(parsed) ? null : parsed;
    }
  }

  return null;
};

const stripHtml = (value?: string | null): string | null => {
  if (!value) return null;
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
};

const cleanString = (value?: string | null): string | null => {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : null;
};

const sanitizeUrl = (value?: string | null): string | null => {
  const cleaned = cleanString(value);
  if (!cleaned) return null;
  try {
    const url = new URL(cleaned);
    return url.toString();
  } catch {
    return null;
  }
};

type ParsedSong = {
  artist: string | null;
  title: string | null;
  combined: string | null;
};

const parseSongString = (value?: string | null): ParsedSong => {
  const cleaned = cleanString(stripHtml(value));
  if (!cleaned) {
    return { artist: null, title: null, combined: null };
  }

  const separators = [" - ", " – ", " — "];
  for (const separator of separators) {
    const index = cleaned.indexOf(separator);
    if (index > 0 && index < cleaned.length - separator.length) {
      const artist = cleanString(cleaned.slice(0, index));
      const title = cleanString(cleaned.slice(index + separator.length));
      if (artist || title) {
        return {
          artist,
          title,
          combined: [artist, title].filter(Boolean).join(" – ") || cleaned,
        };
      }
    }
  }

  return {
    artist: null,
    title: cleaned,
    combined: cleaned,
  };
};

const buildIcecastTrackInfo = (source: IcecastSource | null | undefined): {
  nowPlaying: string | null;
  track: IcecastTrackInfo | null;
} => {
  const parsed = parseSongString(source?.title);

  if (!parsed.combined) {
    return {
      nowPlaying: null,
      track: null,
    };
  }

  return {
    nowPlaying: parsed.combined,
    track: {
      artist: parsed.artist,
      title: parsed.title ?? parsed.combined,
      album: null,
      artworkUrl: null,
    },
  };
};

const buildCentovaTrackInfo = (entry: CentovaStreamInfo): IcecastTrackInfo => {
  const parsedSong = parseSongString(entry.song ?? entry.rawmeta);
  const trackTitle = cleanString(entry.track?.title) ?? parsedSong.title ?? parsedSong.combined;
  const trackArtist = cleanString(entry.track?.artist) ?? parsedSong.artist;
  const album = cleanString(entry.track?.album);
  const artworkUrl = sanitizeUrl(entry.track?.imageurl);

  return {
    artist: trackArtist,
    title: trackTitle,
    album,
    artworkUrl,
  };
};

const findSourceForMount = (
  sourceOrList: IcecastSource | IcecastSource[] | undefined,
  mount: string
): IcecastSource | null => {
  if (!sourceOrList) return null;
  if (Array.isArray(sourceOrList)) {
    const matched = sourceOrList.find((source) => {
      const listenUrl = source.listenurl ?? "";
      const explicitMount = source.mount ?? "";
      return listenUrl.includes(mount) || explicitMount === mount;
    });
    return matched ?? sourceOrList[0] ?? null;
  }
  return sourceOrList;
};

export const normalizeIcecastResponse = (
  input: unknown,
  options: IcecastNormalizeOptions = {}
): IcecastStatus => {
  const { mount = "/live", includeRaw = false } = options;
  const parsed = icecastResponseSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid Icecast response payload");
  }

  const icestats = parsed.data.icestats;
  const source = findSourceForMount(icestats?.source, mount);
  const audioInfo = parseAudioInfo(source?.audio_info);
  const { nowPlaying, track } = buildIcecastTrackInfo(source);

  const streamName = source?.server_name ?? null;
  const streamDescription = source?.server_description ?? null;
  const contentType = source?.server_type ?? null;
  const streamStarted = source?.stream_start_iso8601
    ? toIsoDate(source.stream_start_iso8601)
    : toIsoDate(source?.stream_start ?? null);
  const listenUrl = sanitizeUrl(source?.listenurl);
  const playbackUrl = listenUrl;

  const bitrate = toNumber(source?.bitrate) ?? audioInfo.bitrate ?? null;
  const listeners = toNumber(source?.listeners);
  const listenerPeak = toNumber(source?.listener_peak);
  const currentlyPlaying = nowPlaying ?? cleanString(source?.title);

  const status: IcecastStatus = {
    isOnline: Boolean(source),
    mount,
    streamName,
    streamDescription,
    contentType,
    streamStarted,
    bitrate,
    listeners,
    listenerPeak,
    genre: source?.genre ?? null,
    currentlyPlaying,
    track,
    listenUrl,
    playbackUrl,
    server: {
      host: icestats?.host ?? null,
      admin: icestats?.admin ?? null,
      location: icestats?.location ?? null,
      version: icestats?.server_id ?? null,
    },
  };

  if (includeRaw) {
    status.raw = parsed.data;
  }

  return status;
};

export const normalizeCentovaResponse = (
  input: unknown,
  options: CentovaNormalizeOptions = {}
): IcecastStatus => {
  const { mount, includeRaw = false, username } = options;
  const parsed = centovaResponseSchema.safeParse(input);

  if (!parsed.success || parsed.data.type !== "result") {
    const errorMessage = parsed.success
      ? parsed.data.error ?? "Unexpected Centova response payload"
      : "Invalid Centova response payload";
    throw new Error(errorMessage);
  }

  const entry = parsed.data.data?.[0];

  if (!entry) {
    throw new Error("Centova response missing stream data");
  }

  const normalizedMount = ensureMountFormat(entry.mountpoint ?? mount ?? "/live") ?? "/live";
  const streamName = entry.title?.trim() || null;
  const streamDescription = stripHtml(entry.summary);
  const contentType = entry.tuneinformat ? `audio/${entry.tuneinformat}` : null;
  const bitrate = parseBitrate(entry.bitrate);
  const listeners = toNumber(entry.listeners);
  const listenerPeak = toNumber(entry.maxlisteners ?? entry.listenertotal);
  const track = buildCentovaTrackInfo(entry);
  const parsedSong = parseSongString(entry.song ?? entry.rawmeta);
  const currentlyPlaying = track.artist || track.title
    ? [track.artist, track.title].filter(Boolean).join(" – ") || track.title
    : parsedSong.combined;
  const listenUrl =
    sanitizeUrl(entry.proxytuneinurltls) ??
    sanitizeUrl(entry.proxytuneinurl) ??
    sanitizeUrl(entry.tuneinurltls) ??
    sanitizeUrl(entry.tuneinurl) ??
    null;
  const playbackUrl = listenUrl;

  let host: string | null = null;
  if (entry.url) {
    try {
      host = new URL(entry.url).host || null;
    } catch {
      host = null;
    }
  }

  const serverOnline = typeof entry.server === "string" ? entry.server.toLowerCase() === "online" : Boolean(entry.server);
  const sourceConnected =
    typeof entry.source === "string"
      ? entry.source.toLowerCase() === "yes"
      : Boolean(entry.source);
  const offline = entry.offline ?? false;

  const status: IcecastStatus = {
    isOnline: (!offline && (serverOnline || sourceConnected)) || Boolean(listenUrl),
    mount: normalizedMount,
    streamName,
    streamDescription,
    contentType,
    streamStarted: null,
    bitrate,
    listeners,
    listenerPeak,
    genre: null,
    currentlyPlaying,
    track: track.title || track.artist || track.album || track.artworkUrl ? track : null,
    listenUrl,
    playbackUrl,
    server: {
      host,
      admin: username ?? null,
      location: null,
      version: entry.servertype ?? null,
    },
  };

  if (includeRaw) {
    status.raw = parsed.data;
  }

  return status;
};
