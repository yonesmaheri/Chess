"use client";

import { io, Socket } from "socket.io-client";
import type {
  ConnectedPayload,
  QueueJoinedPayload,
  QueueCancelledPayload,
  QueueUpdatedPayload,
  SearchingPayload,
  MatchFoundPayload,
  ErrorPayload,
  HeartbeatPayload,
  DisconnectedPayload,
} from "./matchmaking.events";
import {
  MATCHMAKING_CLIENT_EVENTS,
  MATCHMAKING_SERVER_EVENTS,
} from "./matchmaking.events";

type BuiltInSocketEvent = "connect" | "disconnect" | "connect_error";
type MatchmakingServerEvent =
  (typeof MATCHMAKING_SERVER_EVENTS)[keyof typeof MATCHMAKING_SERVER_EVENTS];
type SocketEventName = BuiltInSocketEvent | MatchmakingServerEvent;

export type SocketEventPayloadMap = {
  connect: undefined;
  disconnect: DisconnectedPayload;
  connect_error: Error;
  [MATCHMAKING_SERVER_EVENTS.CONNECTED]: ConnectedPayload;
  [MATCHMAKING_SERVER_EVENTS.QUEUE_JOINED]: QueueJoinedPayload;
  [MATCHMAKING_SERVER_EVENTS.QUEUE_UPDATED]: QueueUpdatedPayload;
  [MATCHMAKING_SERVER_EVENTS.SEARCHING]: SearchingPayload;
  [MATCHMAKING_SERVER_EVENTS.MATCH_FOUND]: MatchFoundPayload;
  [MATCHMAKING_SERVER_EVENTS.QUEUE_CANCELLED]: QueueCancelledPayload;
  [MATCHMAKING_SERVER_EVENTS.ERROR]: ErrorPayload;
  [MATCHMAKING_SERVER_EVENTS.HEARTBEAT]: HeartbeatPayload;
  [MATCHMAKING_SERVER_EVENTS.DISCONNECTED]: DisconnectedPayload;
};

export type SocketEventListener<T = unknown> = (payload: T) => void;

/**
 * Singleton Socket.IO service for managing WebSocket connection
 * Ensures only one connection per browser session
 */
class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners = new Map<SocketEventName, Set<SocketEventListener>>();
  private isConnecting = false;
  private isGatewayReady = false;
  private maxReconnectAttempts = 5;
  private connectPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.isConnecting = true;
    this.connectPromise = new Promise((resolve, reject) => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        // #region debug-point A:socket-connect-start
        fetch("http://127.0.0.1:7777/event", {
          method: "POST",
          body: JSON.stringify({
            sessionId: "matchmaking-no-match",
            runId: "pre-fix",
            hypothesisId: "A",
            location: "socket.service.ts:84",
            msg: "[DEBUG] socket connect started",
            data: { normalizedBaseUrl },
            ts: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        this.socket = io(`${normalizedBaseUrl}/matchmaking`, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
          withCredentials: true,
          transports: ["websocket", "polling"],
        });

        this.registerBuiltInListeners(resolve, reject);
        this.registerServerEventListeners();
      } catch (error) {
        this.isConnecting = false;
        this.connectPromise = null;
        reject(
          error instanceof Error ? error : new Error("Socket connection failed"),
        );
      }
    });

    return this.connectPromise;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.isGatewayReady = false;
    this.connectPromise = null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get socket ID
   */
  getId(): string | undefined {
    return this.socket?.id;
  }

  isConnectionInProgress(): boolean {
    return this.isConnecting;
  }

  isMatchmakingReady(): boolean {
    return this.isConnected() && this.isGatewayReady;
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      // #region debug-point A:socket-emit-blocked
      fetch("http://127.0.0.1:7777/event", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "matchmaking-no-match",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "socket.service.ts:151",
          msg: "[DEBUG] socket emit blocked because not connected",
          data: { event, data, hasSocket: Boolean(this.socket) },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      console.warn("[Socket] Not connected, cannot emit event:", event);
      return;
    }
    // #region debug-point A:socket-emit
    fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      body: JSON.stringify({
        sessionId: "matchmaking-no-match",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "socket.service.ts:166",
        msg: "[DEBUG] socket emit forwarded",
        data: { event, data, socketId: this.socket.id },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    this.socket.emit(event, data);
  }

  /**
   * Listen for event from server
   */
  on<K extends SocketEventName>(
    event: K,
    callback: SocketEventListener<SocketEventPayloadMap[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as SocketEventListener);

    return () => {
      this.listeners.get(event)?.delete(callback as SocketEventListener);
    };
  }

  /**
   * Listen for event once
   */
  once(event: string, callback: SocketEventListener): void {
    if (this.socket) {
      this.socket.once(event, callback);
    }
  }

  /**
   * Register all server event listeners
   */
  private registerServerEventListeners(): void {
    if (!this.socket) return;

    this.socket.on(MATCHMAKING_SERVER_EVENTS.CONNECTED, (payload) => {
      this.isGatewayReady = true;
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.CONNECTED, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.QUEUE_JOINED, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.QUEUE_JOINED, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.QUEUE_UPDATED, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.QUEUE_UPDATED, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.SEARCHING, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.SEARCHING, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.MATCH_FOUND, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.MATCH_FOUND, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.QUEUE_CANCELLED, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.QUEUE_CANCELLED, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.ERROR, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.ERROR, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.HEARTBEAT, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.HEARTBEAT, payload);
    });
    this.socket.on(MATCHMAKING_SERVER_EVENTS.DISCONNECTED, (payload) => {
      this.notifyListeners(MATCHMAKING_SERVER_EVENTS.DISCONNECTED, payload);
    });
  }

  /**
   * Join matchmaking queue
   */
  joinQueue(): void {
    this.emit(MATCHMAKING_CLIENT_EVENTS.JOIN_QUEUE, { queue: "random" });
  }

  /**
   * Leave matchmaking queue
   */
  leaveQueue(ticketId: string): void {
    this.emit(MATCHMAKING_CLIENT_EVENTS.LEAVE_QUEUE, { ticketId });
  }

  /**
   * Send ping (keep-alive)
   */
  ping(): void {
    this.emit(MATCHMAKING_CLIENT_EVENTS.PING, {});
  }

  private registerBuiltInListeners(
    resolve: () => void,
    reject: (reason?: unknown) => void,
  ): void {
    if (!this.socket) {
      return;
    }

    this.socket.on("connect", () => {
      this.isConnecting = false;
      this.isGatewayReady = false;
      this.connectPromise = null;
      // #region debug-point A:socket-connect-success
      fetch("http://127.0.0.1:7777/event", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "matchmaking-no-match",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "socket.service.ts:281",
          msg: "[DEBUG] socket connect success",
          data: { socketId: this.socket?.id ?? null },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      this.notifyListeners("connect", undefined);
      resolve();
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnecting = false;
      this.isGatewayReady = false;
      // #region debug-point C:socket-disconnect
      fetch("http://127.0.0.1:7777/event", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "matchmaking-no-match",
          runId: "pre-fix",
          hypothesisId: "C",
          location: "socket.service.ts:296",
          msg: "[DEBUG] socket disconnect observed",
          data: { reason, socketId: this.socket?.id ?? null },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      this.notifyListeners("disconnect", { reason });
    });

    this.socket.on("connect_error", (error) => {
      this.isConnecting = false;
      this.isGatewayReady = false;
      this.connectPromise = null;
      // #region debug-point A:socket-connect-error
      fetch("http://127.0.0.1:7777/event", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "matchmaking-no-match",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "socket.service.ts:312",
          msg: "[DEBUG] socket connect error",
          data: { message: error.message },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      this.notifyListeners("connect_error", error);
      reject(error);
    });
  }

  private notifyListeners<K extends SocketEventName>(
    event: K,
    payload: SocketEventPayloadMap[K],
  ): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => {
      listener(payload);
    });
  }
}

export const socketService = SocketService.getInstance();
