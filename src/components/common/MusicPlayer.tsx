"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Music4 } from "lucide-react";
import { cn } from '@/lib/utils';

const MusicPlayer: React.FC = () => {
  const context = useAppContext();
  const [progress, setProgress] = useState(0);

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
  }, [context?.currentTrack])
  
  if (!context) return null;
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = context;

  return (
    <div className={cn(
        "fixed bottom-0 left-0 right-auto z-40 transition-transform duration-500 w-full md:w-1/3",
        currentTrack ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="px-4 sm:px-6 lg:px-8">
        <Card className="bg-secondary/50 backdrop-blur-lg border-white/10 p-4 mb-4">
          <div className="flex items-center gap-4">
            {currentTrack ? (
              <div className="flex items-center gap-4 flex-1">
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  width={64}
                  height={64}
                  className="rounded-md"
                  data-ai-hint={currentTrack.hint}
                />
                <div className="flex-1 hidden sm:flex flex-col">
                  <p className="font-bold font-headline">{currentTrack.title}</p>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                    <Music4 className="w-8 h-8 text-muted-foreground" />
                  </div>
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center gap-2 flex-[2]">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={prevTrack}>
                        <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button variant="default" size="icon" onClick={togglePlay} className="bg-primary rounded-full w-12 h-12 shadow-lg accent-glow">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextTrack}>
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>
                <div className="w-full max-w-md hidden md:block">
                  <Slider 
                    value={[progress]} 
                    onValueChange={(value) => setProgress(value[0])}
                    max={100} 
                    step={1} 
                    className="w-full"
                  />
                </div>
            </div>

            <div className="flex-1" />

          </div>
        </Card>
      </div>
    </div>
  );
};

export default MusicPlayer;
