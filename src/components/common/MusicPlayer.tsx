"use client";

import React, { useMemo } from 'react';
import { useAppContext } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Music4, RefreshCw, Radio } from "lucide-react";
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const MusicPlayer: React.FC = () => {
  const context = useAppContext();

  if (!context) return null;
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
  const badgeLabel = streamStatus?.isOnline
    ? 'On Air'
    : isStreamLoading
      ? 'Connecting…'
      : 'Offline';

  const badgeClassName = streamStatus?.isOnline
    ? 'border-green-400/40 bg-green-500/20 text-green-100'
    : isStreamLoading
      ? 'border-white/30 bg-white/10 text-white/80'
      : 'border-red-500/40 bg-red-500/20 text-red-100';

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
  const isVisible = Boolean(streamStatus || isStreamLoading || streamError);

  const infoItems = useMemo(
    () => [
      { label: 'Listeners', value: listenersLabel },
      { label: 'Quality', value: qualityLabel },
      { label: 'Last update', value: updatedLabel ? updatedLabel : 'Awaiting data' },
    ],
    [listenersLabel, qualityLabel, updatedLabel]
  );

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 sm:left-auto sm:right-6 sm:bottom-6 z-40 transition-transform duration-500 w-full sm:w-[32rem] lg:w-[34rem]",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="px-4 pb-4 sm:px-0">
        <Card className="mb-4 rounded-[24px] border-white/10 bg-black/75 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start gap-3">
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
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="mx-auto flex shrink-0 items-center justify-center sm:mx-0">
                <div className="relative aspect-square w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-inner sm:w-24 md:w-28">
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
              <span className="uppercase tracking-[0.28em]">Status feed</span>
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
