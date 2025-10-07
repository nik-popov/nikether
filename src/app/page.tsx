"use client";

import React from "react";
import { AppContextProvider } from "@/contexts/AppContext";
import Header from "@/components/common/Header";
import MusicPlayer from "@/components/common/MusicPlayer";
import HeroVisualizer from "@/components/sections/HeroVisualizer";
import ArtistPortfolio from "@/components/sections/ArtistPortfolio";
import Booking from "@/components/sections/Booking";

export default function Home() {
  return (
    <AppContextProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow">
          <HeroVisualizer />
          <ArtistPortfolio />
          <Booking />
        </main>
        <MusicPlayer />
      </div>
    </AppContextProvider>
  );
}
