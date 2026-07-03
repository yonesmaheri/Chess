"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { socketService } from "@/shared/socket/socket.service";
import { useAuth } from "./auth-provider";

type SocketContextValue = {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, status } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Connect only after auth state is resolved.
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!isAuthenticated) {
      socketService.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
      setError(null);
      return;
    }

    if (socketService.isConnected()) {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      return;
    }

    setIsConnecting(true);

    socketService
      .connect()
      .then(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Socket connection failed:", err);
        setIsConnected(false);
        setIsConnecting(false);
        setError(err);
      });
  }, [isAuthenticated, status]);

  // Keep connection state in sync with the singleton service.
  useEffect(() => {
    const unsubscribeConnect = socketService.on("connect", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });
    const unsubscribeDisconnect = socketService.on("disconnect", () => {
      setIsConnected(false);
      setIsConnecting(false);
    });
    const unsubscribeConnectError = socketService.on(
      "connect_error",
      (payload) => {
        const nextError =
          payload instanceof Error
            ? payload
            : new Error("اتصال بلادرنگ برقرار نشد.");
        setIsConnected(false);
        setIsConnecting(false);
        setError(nextError);
      },
    );

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeConnectError();
    };
  }, []);

  useEffect(() => {
    if (socketService.isConnected()) {
      setIsConnected(true);
      setIsConnecting(false);
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        isConnecting,
        error,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
}
