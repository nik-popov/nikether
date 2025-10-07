"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Track, discography } from '@/lib/data';

type AppContextType = {
  playlist: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (trackId: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [playlist] = useState<Track[]>(discography);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(playlist[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playTrack = (trackId: number) => {
    const trackToPlay = playlist.find(t => t.id === trackId);
    if (trackToPlay) {
      setCurrentTrack(trackToPlay);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(prev => !prev);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };
  
  const value = useMemo(() => ({
    playlist,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
  }), [playlist, currentTrack, isPlaying]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
