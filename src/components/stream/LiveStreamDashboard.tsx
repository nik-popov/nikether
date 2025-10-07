"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useAppContext } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, Headphones, Loader2, PauseCircle, PlayCircle, Radio, RefreshCw, Waves } from "lucide-react";

const getRelativeTime = (value: string | null | undefined): string | null => {
  if (!value) return null;
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return null;
  }
};

const LiveStreamDashboard: React.FC = () => {
  const {
    streamStatus,
    streamUpdatedAt,
    isStreamLoading,
    isStreamRefreshing,
    streamError,
    streamPlaybackError,
    isStreamBuffering,
    isPlaying,
    togglePlay,
    refreshStreamStatus,
  } = useAppContext();

  const isOnline = Boolean(streamStatus?.isOnline);
  const streamName = streamStatus?.streamName ?? "Nik Ether Radio";
  const streamDescription = streamStatus?.streamDescription ??
    "A 24/7 journey through electronic textures, experimental beats, and immersive ambience.";
  const playbackUrl = streamStatus?.playbackUrl ?? streamStatus?.listenUrl ?? null;
  const listeners = typeof streamStatus?.listeners === "number" ? streamStatus.listeners : null;
  const bitrate = typeof streamStatus?.bitrate === "number" ? `${streamStatus.bitrate} kbps` : null;
  const updatedLabel = getRelativeTime(streamUpdatedAt);
  const bufferingLabel = isStreamBuffering && !isPlaying ? "Buffering…" : null;
  const playbackIssue = streamPlaybackError ?? streamError ?? null;
  const currentTrack = streamStatus?.track ?? null;
  const trackTitle = currentTrack?.title ?? streamStatus?.currentlyPlaying ?? "Live mix in progress";
  const trackArtist = currentTrack?.artist ?? undefined;
  const trackArtwork = currentTrack?.artworkUrl ?? null;
  const canStream = Boolean(playbackUrl);
  const currentDisplayTitle = useMemo(() => {
    const fromTrack = currentTrack ? [currentTrack.artist, currentTrack.title].filter(Boolean).join(" – ") : null;
    return fromTrack || streamStatus?.currentlyPlaying || null;
  }, [currentTrack, streamStatus?.currentlyPlaying]);

  const infoItems = useMemo(
    () => [
      {
        label: "Listeners",
        icon: Headphones,
        value: listeners !== null ? listeners.toString() : "—",
      },
      {
        label: "Bitrate",
        icon: Waves,
        value: bitrate ?? "—",
      },
      {
        label: "Last update",
        icon: RefreshCw,
        value: updatedLabel ? `Updated ${updatedLabel}` : "Awaiting data",
      },
    ],
    [bitrate, listeners, updatedLabel],
  );

  const badgeClassName = isOnline
    ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
    : isStreamLoading
      ? "border-white/20 bg-white/10 text-white/80"
      : "border-red-500/40 bg-red-500/20 text-red-100";

  const playButtonLabel = isPlaying ? "Pause stream" : "Listen live";

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0c1020] via-[#111931] to-black" />
      <div className="container mx-auto flex justify-center px-4 text-white">
        <Card className="w-full max-w-3xl border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
                badgeClassName,
              )}
            >
              <Radio className="h-3.5 w-3.5" />
              {isOnline ? "On Air" : isStreamLoading ? "Connecting" : "Offline"}
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold uppercase tracking-tight md:text-4xl">{streamName}</h1>
              <p className="text-sm text-white/70 md:text-base">{streamDescription}</p>
            </div>

            <div className="flex w-full flex-col items-center gap-5 rounded-3xl border border-white/10 bg-black/40 p-6 md:flex-row md:items-center md:text-left">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg">
                {trackArtwork ? (
                  <Image
                    src={trackArtwork}
                    alt={trackTitle ?? "Current track artwork"}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Radio className="h-9 w-9 text-white/40" />
                  </div>
                )}
              </div>
              <div className="space-y-2 md:flex-1">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Now Playing</p>
                <h2 className="text-lg font-semibold leading-tight" title={trackTitle ?? undefined}>
                  {trackTitle}
                </h2>
                {trackArtist ? (
                  <p className="text-sm text-white/70" title={trackArtist}>
                    {trackArtist}
                  </p>
                ) : null}
                {currentDisplayTitle && currentDisplayTitle !== trackTitle ? (
                  <p className="text-xs uppercase tracking-[0.28em] text-white/40">{currentDisplayTitle}</p>
                ) : null}
              </div>
            </div>

            {playbackIssue ? (
              <div className="flex w-full items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-4 text-left text-sm text-amber-50">
                <AlertCircle className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-semibold uppercase tracking-[0.28em]">Playback notice</p>
                  <p className="text-amber-100/80">{playbackIssue}</p>
                </div>
              </div>
            ) : null}

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button
                onClick={() => togglePlay()}
                size="lg"
                className="flex-1 rounded-full px-6 py-6 text-base font-semibold sm:flex-none sm:px-10"
                disabled={!canStream || (isStreamBuffering && !isPlaying)}
              >
                {isStreamBuffering && !isPlaying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <PauseCircle className="h-5 w-5" />
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
                {bufferingLabel ?? playButtonLabel}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full border border-white/10 bg-white/10 px-6 text-white/80 hover:bg-white/20"
                onClick={() => void refreshStreamStatus()}
                disabled={isStreamRefreshing}
              >
                {isStreamRefreshing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
                {isStreamRefreshing ? "Refreshing" : "Refresh"}
              </Button>
            </div>

            <div className="grid w-full gap-3 text-left sm:grid-cols-3">
              {infoItems.map(({ label, icon: Icon, value }) => (
                <div key={label} className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/40">
                    <Icon className="h-4 w-4" />
                    {label}
                  </div>
                  <p className="text-base font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LiveStreamDashboard;
