"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Music4, RefreshCw, Radio, X } from "lucide-react";
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const MusicPlayer: React.FC = () => {
  const context = useAppContext();

  const {
    streamStatus,
    isStreamLoading,
    isStreamRefreshing,
    streamError,
    refreshStreamStatus,
    streamUpdatedAt,
  } = context;

  const streamName = streamStatus?.streamName ?? 'Nik Ether Radio';
  const streamDescription = streamStatus?.streamDescription ?? 'Unspecified description';
  const isOnline = Boolean(streamStatus?.isOnline);

  const badgeLabel = isOnline
    ? 'On Air'
    : isStreamLoading
      ? 'Connecting…'
      : streamStatus
        ? 'Offline'
        : 'Standby';

  const badgeClassName = isOnline
    ? 'border-green-400/40 bg-green-500/20 text-green-100'
    : isStreamLoading
      ? 'border-white/30 bg-white/10 text-white/80'
      : streamStatus
        ? 'border-red-500/40 bg-red-500/20 text-red-100'
        : 'border-white/20 bg-white/5 text-white/70';

  const effectiveStreamError = streamError;

  const listenersLabel = useMemo(() => {
    if (typeof streamStatus?.listeners === 'number' && typeof streamStatus?.listenerPeak === 'number') {
      return `${streamStatus.listeners} (peak ${streamStatus.listenerPeak})`;
    }
    if (typeof streamStatus?.listeners === 'number') {
      return `${streamStatus.listeners}`;
    }
    if (typeof streamStatus?.listenerPeak === 'number') {
      return `— (peak ${streamStatus.listenerPeak})`;
    }
    return '—';
  }, [streamStatus?.listenerPeak, streamStatus?.listeners]);

  const qualityLabel = useMemo(() => {
    const parts: string[] = [];
    if (typeof streamStatus?.bitrate === 'number') {
      parts.push(`${streamStatus.bitrate} kbps`);
    }
    if (streamStatus?.contentType) {
      parts.push(streamStatus.contentType);
    }
    return parts.length > 0 ? parts.join(' • ') : '—';
  }, [streamStatus?.bitrate, streamStatus?.contentType]);

  const updatedLabel = useMemo(() => {
    if (!streamUpdatedAt) return null;
    try {
      return formatDistanceToNow(new Date(streamUpdatedAt), { addSuffix: true });
    } catch {
      return null;
    }
  }, [streamUpdatedAt]);

  const streamTrack = streamStatus?.track ?? null;
  const trackTitle = streamTrack?.title ?? streamStatus?.currentlyPlaying ?? '—';
  const trackArtist = streamTrack?.artist ?? null;
  const trackArtwork = streamTrack?.artworkUrl ?? null;
  const pathname = usePathname();
  const isStreamRoute = pathname?.startsWith('/stream') ?? false;
  const [isMinimized, setIsMinimized] = useState<boolean>(() => isStreamRoute);
  const routeRef = useRef(isStreamRoute);

  useEffect(() => {
    if (isStreamRoute && !routeRef.current) {
      setIsMinimized(true);
    } else if (!isStreamRoute && routeRef.current) {
      setIsMinimized(false);
    }

    routeRef.current = isStreamRoute;
  }, [isStreamRoute]);

  const isVisible = Boolean(streamStatus || isStreamLoading || streamError);

  const infoItems = useMemo(
    () => [
      { label: 'Listeners', value: listenersLabel },
      { label: 'Quality', value: qualityLabel },
      { label: 'Last update', value: updatedLabel ? updatedLabel : 'Awaiting data' },
    ],
    [listenersLabel, qualityLabel, updatedLabel]
  );

  if (!isVisible && !isMinimized) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-xl hover:bg-white/90"
        >
          <Radio className="h-4 w-4" />
          {isOnline ? 'On Air' : 'Live Status'}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-40 transition-transform duration-500",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="sm:px-0">
        <Card className="rounded-[20px] border-white/10 bg-black/80 p-5 shadow-2xl backdrop-blur-2xl sm:w-[32rem] lg:w-[34rem]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    'flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em]',
                    badgeClassName
                  )}
                >
                  <Radio className="h-3 w-3" />
                  {badgeLabel}
                </Badge>
                <div className="text-left leading-tight">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Live Stream</p>
                  <h2 className="text-xl font-semibold text-white">{streamName}</h2>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/45">
                  {updatedLabel ? `Updated ${updatedLabel}` : 'Awaiting update'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize live status"
                  className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="mx-auto flex shrink-0 items-center justify-center sm:mx-0">
                <div className="relative aspect-square w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-inner sm:w-28">
                  {trackArtwork ? (
                    <Image
                      src={trackArtwork}
                      alt={trackTitle ?? 'Current track artwork'}
                      fill
                      sizes="(max-width: 768px) 40vw, 120px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Music4 className="h-8 w-8 text-white/50" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 text-left">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">Now Playing</p>
                  <h3 className="text-lg font-semibold leading-tight text-white" title={trackTitle ?? undefined}>
                    {trackTitle}
                  </h3>
                  {trackArtist && (
                    <p className="text-sm text-white/70" title={trackArtist}>
                      {trackArtist}
                    </p>
                  )}
                  <p className="text-xs text-white/50 line-clamp-2">{streamDescription}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs text-white/80 sm:grid-cols-3">
              {infoItems.map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</p>
                  <p className="mt-1 text-base font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {effectiveStreamError && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/20 p-4 text-sm text-red-50">
                {effectiveStreamError}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-white/60">
              <div className="flex items-center gap-3">
                <span className="uppercase tracking-[0.28em]">Status feed</span>
                <Link
                  href="/stream"
                  className="text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Stream link
                </Link>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshStreamStatus}
                disabled={isStreamRefreshing}
                aria-label="Refresh stream status"
                className="px-2 text-white"
              >
                <RefreshCw className={cn('h-4 w-4', isStreamRefreshing && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MusicPlayer;
