"use client";

import React, { useMemo } from "react";
import Section from "@/components/common/Section";
import { discography, Track } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const Discography: React.FC = () => {
  const { playTrack, streamHistory, streamStatus } = useAppContext();

  const historyCards = useMemo(() => {
    if (!streamHistory.length) return [];

    return streamHistory.slice(0, 4).map((entry, index) => {
      let relativeTime = "";
      try {
        relativeTime = formatDistanceToNow(new Date(entry.startedAt), { addSuffix: true });
      } catch {
        relativeTime = "Recently";
      }

      const listenersLabel =
        typeof entry.listeners === "number" ? `${entry.listeners} listeners` : "Listeners unknown";

      const badgeLabel = index === 0 ? "NOW PLAYING" : "RECENT";
      const combinedTitle = entry.trackArtist
        ? `${entry.trackArtist} – ${entry.trackTitle ?? entry.displayTitle}`
        : entry.trackTitle ?? entry.displayTitle;

      return (
        <Card
          key={`history-${entry.id}`}
          className="group overflow-hidden border-white/10 bg-gradient-to-br from-purple-600/40 via-indigo-500/10 to-transparent shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/30"
        >
          <CardContent className="flex h-full flex-col overflow-hidden p-0 text-white">
            <div className="relative h-36 w-full overflow-hidden">
              {entry.artworkUrl ? (
                <Image
                  src={entry.artworkUrl}
                  alt={combinedTitle ?? "Recent track artwork"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-indigo-500/30">
                  <Play className="h-12 w-12 text-white/60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="border-white/40 bg-black/30 text-[10px] text-white/80 backdrop-blur">
                  {badgeLabel}
                </Badge>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3 p-5">
              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight uppercase">
                  {entry.trackTitle ?? entry.displayTitle}
                </h3>
                {entry.trackArtist && (
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {entry.trackArtist}
                  </p>
                )}
                <p className="text-xs text-white/70">{listenersLabel}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>{relativeTime}</span>
                {typeof entry.bitrate === "number" && <span>{entry.bitrate} kbps</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  }, [streamHistory]);

  return (
    <Section id="music" title="TOP TRACKS">
      {(streamStatus?.currentlyPlaying || streamStatus?.track) && (
        <div className="mb-6 text-center text-sm uppercase tracking-[0.25em] text-white/60">
          Now playing:
          <span className="ml-2 text-white">
            {streamStatus?.track?.artist ? (
              <>
                {streamStatus.track.artist}
                {streamStatus.track.title && " – "}
                {streamStatus.track.title ?? streamStatus.currentlyPlaying}
              </>
            ) : (
              streamStatus?.track?.title ?? streamStatus?.currentlyPlaying
            )}
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {historyCards}
        {discography.map((track: Track) => (
          <Card key={track.id} className="group overflow-hidden border-white/10 bg-card shadow-lg transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-2 hover:shadow-2xl">
            <CardContent className="p-0 relative">
              <Image
                src={track.cover}
                alt={track.title}
                width={500}
                height={500}
                className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={track.hint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold font-headline text-lg uppercase">{track.title}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute bottom-4 right-4 bg-primary/50 text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  onClick={() => playTrack(track.id)}
                >
                  <Play className="fill-current"/>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Discography;
