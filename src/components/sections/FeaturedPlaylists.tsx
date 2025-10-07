"use client";

import React from "react";
import Section from "@/components/common/Section";
import { featuredPlaylists, Playlist } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const FeaturedPlaylists: React.FC = () => {
  const { playTrack } = useAppContext();

  // For now, playing a playlist will just play the first track of the discography
  // as the playlist tracks are not yet implemented.
  const handlePlayPlaylist = (playlist: Playlist) => {
    // A real implementation would load the playlist's tracks.
    // For this example, we'll just play the first track of the main discography.
    playTrack(1); 
  };

  return (
    <Section id="playlists" title="FEATURED PLAYLISTS">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {featuredPlaylists.map((playlist: Playlist) => (
          <Card key={playlist.id} className="group overflow-hidden border-white/10 bg-card backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-2 hover:shadow-2xl">
            <CardContent className="p-0 relative">
              <Image
                src={playlist.cover}
                alt={playlist.name}
                width={500}
                height={500}
                className="aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={playlist.hint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold font-headline text-lg uppercase">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute bottom-4 right-4 bg-primary/50 text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  onClick={() => handlePlayPlaylist(playlist)}
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

export default FeaturedPlaylists;
