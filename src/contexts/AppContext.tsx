"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Track, discography } from '@/lib/data';
import { useIcecastStatus, type IcecastHistoryEntry } from '@/hooks/use-icecast-status';
import type { IcecastStatus } from '@/lib/icecast';

type AppContextType = {
  playlist: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (trackId: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  streamStatus: IcecastStatus | null;
  streamUpdatedAt: string | null;
  streamHistory: IcecastHistoryEntry[];
  isStreamLoading: boolean;
  isStreamRefreshing: boolean;
  streamError: string | null;
  streamPlaybackError: string | null;
  isStreamBuffering: boolean;
  refreshStreamStatus: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [playlist] = useState<Track[]>(discography);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(playlist[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isStreamBuffering, setIsStreamBuffering] = useState<boolean>(false);
  const [streamPlaybackError, setStreamPlaybackError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    status: streamStatus,
    updatedAt: streamUpdatedAt,
    history: streamHistory,
    isLoading: isStreamLoading,
    isRefreshing: isStreamRefreshing,
    error: streamError,
    refresh: refreshStreamStatus,
  } = useIcecastStatus();
  const streamUrl = streamStatus?.playbackUrl ?? streamStatus?.listenUrl ?? null;

  const ensureAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'none';
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
    }

    return audioRef.current;
  }, []);

  const describeMediaError = useCallback((audio: HTMLAudioElement): string => {
    const { error } = audio;
    if (!error) return 'Unable to play the stream.';

    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        return 'Stream playback was aborted.';
      case error.MEDIA_ERR_NETWORK:
        return 'Network error interrupted the stream.';
      case error.MEDIA_ERR_DECODE:
        return 'The stream could not be decoded.';
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return 'The stream source is unavailable.';
      default:
        return 'An unknown playback error occurred.';
    }
  }, []);

  const stopStream = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // Some browsers may disallow setting currentTime on live streams.
      }
    }

    setIsStreamBuffering(false);
    setIsPlaying(false);
    setStreamPlaybackError(null);
  }, []);

  const playStream = useCallback(async () => {
    const url = streamUrl;
    if (!url) {
      setStreamPlaybackError('Stream is currently unavailable.');
      setIsPlaying(false);
      return;
    }

    const audio = ensureAudio();
    if (!audio) {
      setStreamPlaybackError('Playback is not supported in this environment.');
      setIsPlaying(false);
      return;
    }

    if (audio.src !== url) {
      audio.src = url;
      audio.load();
    }

    setStreamPlaybackError(null);
    setIsStreamBuffering(true);

    try {
      await audio.play();
      setIsPlaying(true);
      setIsStreamBuffering(false);
    } catch (error) {
      const fallback = describeMediaError(audio);
      const isDomException = error instanceof DOMException;
      const isPermissionError = isDomException && error.name === 'NotAllowedError';
      const message = isPermissionError
        ? 'Playback requires a user interaction.'
        : error instanceof Error && error.message
          ? error.message
          : fallback;
      setStreamPlaybackError(message ?? fallback);
      setIsPlaying(false);
      setIsStreamBuffering(false);
    }
  }, [describeMediaError, ensureAudio, streamUrl]);

  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return;

    const handlePlaying = () => {
      setIsStreamBuffering(false);
      setStreamPlaybackError(null);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsStreamBuffering(false);
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      if (!audio.paused) {
        setIsStreamBuffering(true);
      }
    };

    const handleError = () => {
      setIsStreamBuffering(false);
      setIsPlaying(false);
      setStreamPlaybackError(describeMediaError(audio));
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [describeMediaError, ensureAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!streamUrl && audio) {
      stopStream();
      audio.removeAttribute('src');
    }
  }, [streamUrl, stopStream]);

  useEffect(() => {
    if (!streamUrl) return;

    const audio = audioRef.current;
    if (audio && !audio.paused) {
      void playStream();
    }
  }, [playStream, streamUrl]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audioRef.current = null;
      }
    };
  }, []);

  const playTrack = (trackId: number) => {
    const trackToPlay = playlist.find(t => t.id === trackId);
    if (trackToPlay) {
      setCurrentTrack(trackToPlay);
      void playStream();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopStream();
    } else {
      void playStream();
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    void playStream();
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
    void playStream();
  };
  
  const value = useMemo(() => ({
    playlist,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    streamStatus,
    streamUpdatedAt,
    streamHistory,
    isStreamLoading,
    isStreamRefreshing,
    streamError,
    streamPlaybackError,
    isStreamBuffering,
    refreshStreamStatus,
  }), [
    playlist,
    currentTrack,
    isPlaying,
    streamStatus,
    streamUpdatedAt,
    streamHistory,
    isStreamLoading,
    isStreamRefreshing,
    streamError,
    streamPlaybackError,
    isStreamBuffering,
    refreshStreamStatus,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
