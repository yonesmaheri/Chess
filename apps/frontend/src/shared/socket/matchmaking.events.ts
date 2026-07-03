/**
 * Client -> Server Events
 */
export const MATCHMAKING_CLIENT_EVENTS = {
  JOIN_QUEUE: "join_queue",
  LEAVE_QUEUE: "leave_queue",
  PING: "ping",
} as const;

/**
 * Server -> Client Events
 */
export const MATCHMAKING_SERVER_EVENTS = {
  QUEUE_JOINED: "queue_joined",
  QUEUE_UPDATED: "queue_updated",
  SEARCHING: "searching",
  MATCH_FOUND: "match_found",
  QUEUE_CANCELLED: "queue_cancelled",
  ERROR: "error",
  HEARTBEAT: "heartbeat",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
} as const;

/**
 * WebSocket Payloads
 */

export interface QueueJoinedPayload {
  ticketId: string;
  queue: "random";
  estimatedWaitSeconds: number;
}

export interface SearchingPayload {
  ticketId: string;
  queue: "random";
  elapsedSeconds: number;
  estimatedWaitSeconds: number;
}

export interface MatchFoundPayload {
  ticketId: string;
  sessionId: string;
  queue: "random";
  opponent: {
    id: string;
    name: string;
    rating?: number;
    country?: string;
  };
}

export interface QueueCancelledPayload {
  ticketId: string;
  reason: string;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

export interface HeartbeatPayload {
  timestamp: number;
}

export interface QueueUpdatedPayload {
  queueSize: number;
}

export interface ConnectedPayload {
  userId: string;
  message: string;
}

export interface DisconnectedPayload {
  reason: string;
}
