"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { socketService } from "@/shared/socket/socket.service";
import { MATCHMAKING_SERVER_EVENTS } from "@/shared/socket/matchmaking.events";
import type {
  ConnectedPayload,
  QueueJoinedPayload,
  SearchingPayload,
  MatchFoundPayload,
  ErrorPayload,
  QueueCancelledPayload,
} from "@/shared/socket/matchmaking.events";

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
  const [isReady, setIsReady] = useState(socketService.isMatchmakingReady());
  const startTimeRef = useRef<number | null>(null);
  const ticketIdRef = useRef<string | null>(null);
  const stateStatusRef = useRef<MatchmakingState["status"]>("idle");
  const startRequestedRef = useRef(false);
  const timeoutIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  useEffect(() => {
    stateStatusRef.current = state.status;
  }, [state.status]);

  // Track elapsed time
  useEffect(() => {
    if (state.status !== "searching") {
      if (timeoutIntervalRef.current) {
        clearInterval(timeoutIntervalRef.current);
        timeoutIntervalRef.current = null;
      }
      return;
    }

    timeoutIntervalRef.current = setInterval(() => {
      const elapsedSeconds = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0;

      if (elapsedSeconds >= MATCHMAKING_TIMEOUT_MS / 1000) {
        startRequestedRef.current = false;
        setState({ status: "timeout" });
        socketService.leaveQueue(ticketIdRef.current!);
      } else {
        setState((prev) => {
          if (prev.status === "searching") {
            return { ...prev, elapsedSeconds };
          }
          return prev;
        });
      }
    }, 1000);

    return () => {
      if (timeoutIntervalRef.current) {
        clearInterval(timeoutIntervalRef.current);
        timeoutIntervalRef.current = null;
      }
    };
  }, [state.status]);

  // Subscribe to socket events
  useEffect(() => {
    const unsubConnected = socketService.on(
      MATCHMAKING_SERVER_EVENTS.CONNECTED,
      (_payload: ConnectedPayload) => {
        setIsReady(true);
      },
    );
    const unsubDisconnected = socketService.on("disconnect", () => {
      setIsReady(false);
      startRequestedRef.current = false;
    });

    // Queue joined
    const unsubQueueJoined = socketService.on(
      MATCHMAKING_SERVER_EVENTS.QUEUE_JOINED,
      (payload: QueueJoinedPayload) => {
        // #region debug-point B:queue-joined-event
        fetch("http://127.0.0.1:7777/event", {
          method: "POST",
          body: JSON.stringify({
            sessionId: "matchmaking-no-match",
            runId: "pre-fix",
            hypothesisId: "B",
            location: "useMatchmakingWebSocket.ts:88",
            msg: "[DEBUG] queue_joined received on client",
            data: payload,
            ts: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        startRequestedRef.current = false;
        if (stateStatusRef.current === "matched") {
          return;
        }
        ticketIdRef.current = payload.ticketId;
        startTimeRef.current = Date.now();
        setState({
          status: "searching",
          ticketId: payload.ticketId,
          elapsedSeconds: 0,
        });
      },
    );

    const unsubSearching = socketService.on(
      MATCHMAKING_SERVER_EVENTS.SEARCHING,
      (payload: SearchingPayload) => {
        // #region debug-point B:searching-event
        fetch("http://127.0.0.1:7777/event", {
          method: "POST",
          body: JSON.stringify({
            sessionId: "matchmaking-no-match",
            runId: "pre-fix",
            hypothesisId: "B",
            location: "useMatchmakingWebSocket.ts:113",
            msg: "[DEBUG] searching received on client",
            data: payload,
            ts: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        startRequestedRef.current = false;
        if (stateStatusRef.current === "matched") {
          return;
        }
        ticketIdRef.current = payload.ticketId;
        if (!startTimeRef.current) {
          startTimeRef.current = Date.now() - payload.elapsedSeconds * 1000;
        }

        setState({
          status: "searching",
          ticketId: payload.ticketId,
          elapsedSeconds: payload.elapsedSeconds,
        });
      },
    );

    // Match found
    const unsubMatchFound = socketService.on(
      MATCHMAKING_SERVER_EVENTS.MATCH_FOUND,
      (payload: MatchFoundPayload) => {
        // #region debug-point D:match-found-event
        fetch("http://127.0.0.1:7777/event", {
          method: "POST",
          body: JSON.stringify({
            sessionId: "matchmaking-no-match",
            runId: "pre-fix",
            hypothesisId: "D",
            location: "useMatchmakingWebSocket.ts:142",
            msg: "[DEBUG] match_found received on client",
            data: payload,
            ts: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        startRequestedRef.current = false;
        ticketIdRef.current = payload.ticketId;
        setState({
          status: "matched",
          ticketId: payload.ticketId,
          sessionId: payload.sessionId,
          opponent: {
            id: payload.opponent.id,
            name: payload.opponent.name,
            rating: payload.opponent.rating,
            country: payload.opponent.country,
          },
        });
      },
    );

    // Queue cancelled
    const unsubQueueCancelled = socketService.on(
      MATCHMAKING_SERVER_EVENTS.QUEUE_CANCELLED,
      (_payload: QueueCancelledPayload) => {
        startRequestedRef.current = false;
        setState({ status: "cancelled" });
      },
    );

    // Error
    const unsubError = socketService.on(
      MATCHMAKING_SERVER_EVENTS.ERROR,
      (payload: ErrorPayload) => {
        startRequestedRef.current = false;
        setState({
          status: "error",
          message: payload.message || "خطا در جستجوی حریف",
        });
      },
    );

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubQueueJoined();
      unsubSearching();
      unsubMatchFound();
      unsubQueueCancelled();
      unsubError();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutIntervalRef.current) {
        clearInterval(timeoutIntervalRef.current);
      }
    };
  }, []);

  // Start matchmaking
  const start = useCallback(async () => {
    if (state.status !== "idle" || startRequestedRef.current) {
      // #region debug-point E:start-skipped-state
      fetch("http://127.0.0.1:7777/event", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "matchmaking-no-match",
          runId: "pre-fix",
          hypothesisId: "E",
          location: "useMatchmakingWebSocket.ts:219",
          msg: "[DEBUG] matchmaking start skipped because state is not idle",
          data: { status: state.status },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return;
    }

    if (!socketService.isMatchmakingReady()) {
      return;
    }

    if (!socketService.isConnected()) {
      // #region debug-point A:start-skipped-not-connected
      fetch("http://127.0.0.1:7777/event", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "matchmaking-no-match",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "useMatchmakingWebSocket.ts:234",
          msg: "[DEBUG] matchmaking start skipped because socket is not connected",
          data: {},
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setState({
        status: "error",
        message: "اتصال به سرور قطع شده است",
      });
      return;
    }

    startRequestedRef.current = true;
    setState({ status: "starting" });
    // #region debug-point A:start-join-queue
    fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      body: JSON.stringify({
        sessionId: "matchmaking-no-match",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "useMatchmakingWebSocket.ts:249",
        msg: "[DEBUG] matchmaking start is emitting joinQueue",
        data: {},
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    socketService.joinQueue();
  }, [state.status]);

  // Cancel matchmaking
  const cancel = useCallback(async () => {
    if (state.status !== "searching") {
      return;
    }

    startRequestedRef.current = false;
    if (ticketIdRef.current) {
      socketService.leaveQueue(ticketIdRef.current);
    }
  }, [state.status]);

  return {
    isReady,
    state,
    start,
    cancel,
  };
}
