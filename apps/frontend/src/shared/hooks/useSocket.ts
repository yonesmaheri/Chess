"use client";

import { useCallback, useEffect, useState } from "react";
import { socketService } from "../socket/socket.service";
import type { SocketEventListener } from "../socket/socket.service";

type SocketState =
  | "idle"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

export function useSocket() {
  const [state, setState] = useState<SocketState>("idle");
  const [error, setError] = useState<Error | null>(null);

  // Connect to socket on mount
  useEffect(() => {
    if (socketService.isConnected()) {
      setState("connected");
      return;
    }

    setState("connecting");

    socketService
      .connect()
      .then(() => {
        setState("connected");
        setError(null);
      })
      .catch((err) => {
        console.error("Socket connection error:", err);
        setState("error");
        setError(err);
      });

    // Cleanup on unmount
    return () => {
      // Don't disconnect on unmount - keep connection alive for other components
    };
  }, []);

  // Listen to disconnect events
  useEffect(() => {
    const unsubscribe = socketService.on("disconnect", () => {
      setState("disconnected");
    });

    return unsubscribe;
  }, []);

  /**
   * Subscribe to WebSocket event
   */
  const subscribe = useCallback(
    (event: string, callback: SocketEventListener) => {
      return socketService.on(event, callback);
    },
    [],
  );

  /**
   * Emit event to server
   */
  const emit = useCallback((event: string, data?: any) => {
    socketService.emit(event, data);
  }, []);

  return {
    state,
    error,
    isConnected: socketService.isConnected(),
    subscribe,
    emit,
  };
}
