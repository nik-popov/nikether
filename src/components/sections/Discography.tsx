"use client";

import React from "react";
import Section from "@/components/common/Section";
import { discography, Track } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const Discography: React.FC = () => {
  const { playTrack } = useAppContext();

  return (
    <Section id="music" title="TOP TRACKS">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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
