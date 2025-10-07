"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Music4 } from "lucide-react";
import { cn } from '@/lib/utils';

const MusicPlayer: React.FC = () => {
  const context = useAppContext();
  const [progress, setProgress] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (context?.isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000); // Faking 100s track duration
    }
    return () => clearInterval(interval);
  }, [context?.isPlaying]);

  useEffect(() => {
    setProgress(0);
    checkOverflow();
  }, [context?.currentTrack])
  
  const checkOverflow = () => {
    if (titleRef.current) {
        const { scrollWidth, clientWidth } = titleRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);


  if (!context) return null;
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = context;

  const titleContainerClasses = cn("whitespace-nowrap", {
    "animate-marquee-long-titles": isOverflowing,
  });

  const duplicateTitleContainerClasses = cn("absolute top-0 left-0 whitespace-nowrap", {
    "animate-marquee2-long-titles": isOverflowing,
  });


  return (
    <div className={cn(
        "fixed bottom-0 left-0 right-auto z-40 transition-transform duration-500 w-full md:w-[30rem]",
        currentTrack ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="px-4 sm:px-6 lg:px-8">
        <Card className="bg-secondary/50 backdrop-blur-lg border-white/10 p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-start gap-2">
                <Button variant="ghost" size="icon" onClick={prevTrack}>
                    <SkipBack className="w-5 h-5" />
                </Button>
                <Button variant="default" size="icon" onClick={togglePlay} className="bg-primary rounded-full w-10 h-10 shadow-lg accent-glow">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={nextTrack}>
                    <SkipForward className="w-5 h-5" />
                </Button>
            </div>
            
            {currentTrack ? (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  width={48}
                  height={48}
                  className="rounded-md shrink-0"
                  data-ai-hint={currentTrack.hint}
                />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                   <div ref={titleRef} className="relative overflow-hidden">
                    <div className={titleContainerClasses}>
                      <p className="font-bold font-headline whitespace-nowrap text-base truncate uppercase">
                        {currentTrack.title}
                      </p>
                    </div>
                    {isOverflowing && (
                      <div className={duplicateTitleContainerClasses} style={{ animationDelay: '7.5s' }}>
                        <p className="font-bold font-headline whitespace-nowrap text-base truncate uppercase">
                            {currentTrack.title}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                    <Music4 className="w-6 h-6 text-muted-foreground" />
                  </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MusicPlayer;
