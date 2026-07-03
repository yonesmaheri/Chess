import { useCallback, useEffect, useRef, useState } from "react";
import { matchmakingService } from "@/shared/api/services/matchmaking";
import type { GetMatchStatusResponse } from "@/shared/api/services/matchmaking";

const POLLING_INTERVAL_MS = 2500; // 2.5 seconds
const MATCHMAKING_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

type MatchmakingState =
  | { status: "idle" }
  | { status: "starting" }
  | { status: "searching"; ticketId: string; elapsedSeconds: number }
  | {
      status: "matched";
      ticketId: string;
      sessionId: string;
      opponent: {
        id: string;
        name: string;
        rating?: number;
        country?: string;
      };
    }
  | { status: "cancelled" }
  | { status: "timeout" }
  | { status: "error"; message: string };

export function useMatchmaking() {
  const [state, setState] = useState<MatchmakingState>({ status: "idle" });
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const startTimeRef = useRef<number | null>(null);
  const ticketIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    startTimeRef.current = null;
    ticketIdRef.current = null;
  }, []);

  // Poll for match status
  const pollMatchStatus = useCallback(
    async (ticketId: string) => {
      try {
        const response = await matchmakingService.getMatchStatus(ticketId);

        const elapsedSeconds = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : 0;

        if (response.status === "matched") {
          setState({
            status: "matched",
            ticketId,
            sessionId: response.sessionId,
            opponent: {
              id: response.opponent.id,
              name: response.opponent.name,
              rating: response.opponent.rating,
              country: response.opponent.country,
            },
          });
          cleanup();
          return;
        }

        if (response.status === "failed") {
          setState({
            status: "error",
            message: response.reason || "خطا در جستجوی حریف",
          });
          cleanup();
          return;
        }

        // Check timeout
        if (elapsedSeconds >= MATCHMAKING_TIMEOUT_MS / 1000) {
          setState({ status: "timeout" });
          cleanup();
          return;
        }

        // Update searching state
        setState({
          status: "searching",
          ticketId,
          elapsedSeconds,
        });
      } catch (error) {
        console.error("Polling error:", error);
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "خطا در جستجوی حریف",
        });
        cleanup();
      }
    },
    [cleanup],
  );

  // Start matchmaking
  const start = useCallback(async () => {
    if (state.status !== "idle") {
      return;
    }

    setState({ status: "starting" });

    try {
      const response = await matchmakingService.createRandomMatch();

      if (response.status === "searching") {
        ticketIdRef.current = response.ticketId;
        startTimeRef.current = Date.now();

        setState({
          status: "searching",
          ticketId: response.ticketId,
          elapsedSeconds: 0,
        });

        // Start polling
        pollingIntervalRef.current = setInterval(() => {
          if (ticketIdRef.current) {
            void pollMatchStatus(ticketIdRef.current);
          }
        }, POLLING_INTERVAL_MS);
      }
    } catch (error) {
      console.error("Matchmaking error:", error);
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "خطا در شروع جستجوی حریف",
      });
    }
  }, [state.status, pollMatchStatus]);

  // Cancel matchmaking
  const cancel = useCallback(async () => {
    if (state.status !== "searching" || !ticketIdRef.current) {
      return;
    }

    try {
      await matchmakingService.cancelMatchmaking(ticketIdRef.current);
      setState({ status: "cancelled" });
    } catch (error) {
      console.error("Cancel error:", error);
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "خطا در لغو جستجوی حریف",
      });
    } finally {
      cleanup();
    }
  }, [state.status, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    start,
    cancel,
  };
}
