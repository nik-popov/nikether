"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IcecastStatus } from "@/lib/icecast";

type IcecastApiResponse = {
  status: IcecastStatus;
  updatedAt: string;
  upstream?: string;
};

export type IcecastHistoryEntry = {
  id: string;
  displayTitle: string;
  trackTitle: string | null;
  trackArtist: string | null;
  artworkUrl: string | null;
  startedAt: string;
  listeners: number | null;
  bitrate: number | null;
  statusSnapshot: IcecastStatus;
};

type UseIcecastStatusReturn = {
  status: IcecastStatus | null;
  updatedAt: string | null;
  history: IcecastHistoryEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const DEFAULT_INTERVAL = 45_000;
const HISTORY_LIMIT = 8;

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Unable to load stream status";
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useIcecastStatus = (pollInterval: number = DEFAULT_INTERVAL): UseIcecastStatusReturn => {
  const [data, setData] = useState<IcecastApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<IcecastHistoryEntry[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialFetchCompleted = useRef<boolean>(false);
  const lastTrackRef = useRef<string | null>(null);

  const fetchStatus = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;

      if (!silent) {
        setIsLoading(true);
      }

      try {
        const response = await fetch("/api/icecast/status", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Status request failed with ${response.status}`);
        }

        const json = (await response.json()) as IcecastApiResponse;
        setData(json);
        setError(null);
        isInitialFetchCompleted.current = true;

    const trackTitle = json.status?.track?.title?.trim() ?? null;
    const trackArtist = json.status?.track?.artist?.trim() ?? null;
    const artworkUrl = json.status?.track?.artworkUrl ?? null;
    const currentTitle = json.status?.currentlyPlaying?.trim() ?? null;
    const combinedLabel = [trackArtist, trackTitle].filter(Boolean).join(" – ") || null;
    const displayTitle = currentTitle ?? combinedLabel ?? trackTitle ?? null;
        const normalizedDisplayTitle = displayTitle?.trim() ?? null;
        const trackChanged = normalizedDisplayTitle && normalizedDisplayTitle !== lastTrackRef.current;

        if (trackChanged) {
          const entry: IcecastHistoryEntry = {
            id: generateId(),
            displayTitle: normalizedDisplayTitle,
            trackTitle,
            trackArtist,
            artworkUrl,
            startedAt: json.updatedAt,
            listeners: json.status?.listeners ?? null,
            bitrate: json.status?.bitrate ?? null,
            statusSnapshot: json.status,
          };

          setHistory((prev) => {
            const next = [entry, ...prev.filter((item) => item.displayTitle !== normalizedDisplayTitle)];
            return next.slice(0, HISTORY_LIMIT);
          });

          lastTrackRef.current = normalizedDisplayTitle;
        } else if (normalizedDisplayTitle && !lastTrackRef.current) {
          lastTrackRef.current = normalizedDisplayTitle;
          setHistory((prev) => {
            if (prev.length > 0 && prev[0].displayTitle === normalizedDisplayTitle) {
              return prev;
            }
            const entry: IcecastHistoryEntry = {
              id: generateId(),
              displayTitle: normalizedDisplayTitle,
              trackTitle,
              trackArtist,
              artworkUrl,
              startedAt: json.updatedAt,
              listeners: json.status?.listeners ?? null,
              bitrate: json.status?.bitrate ?? null,
              statusSnapshot: json.status,
            };
            return [entry, ...prev].slice(0, HISTORY_LIMIT);
          });
        }
      } catch (err) {
        setError(parseErrorMessage(err));
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (pollInterval <= 0) return;

    intervalRef.current = setInterval(() => {
      fetchStatus({ silent: true }).catch(() => {
        // Swallow errors: they'll be captured by state updates in fetchStatus.
      });
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStatus, pollInterval]);

  const derived = useMemo(() => {
    const status = data?.status ?? null;
    const updatedAt = data?.updatedAt ?? null;
    const isRefreshing = Boolean(isInitialFetchCompleted.current && isLoading);

    return {
      status,
      updatedAt,
      isRefreshing,
      history,
    };
  }, [data, history, isLoading]);

  const refresh = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  return {
    status: derived.status,
    updatedAt: derived.updatedAt,
    history: derived.history,
    isLoading: !isInitialFetchCompleted.current && isLoading,
    isRefreshing: derived.isRefreshing,
    error,
    refresh,
  };
};
