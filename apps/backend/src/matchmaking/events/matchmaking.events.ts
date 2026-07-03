/**
 * Client -> Server Events
 */
export const MATCHMAKING_CLIENT_EVENTS = {
  JOIN_QUEUE: 'join_queue',
  LEAVE_QUEUE: 'leave_queue',
  PING: 'ping',
} as const;

/**
 * Server -> Client Events
 */
export const MATCHMAKING_SERVER_EVENTS = {
  QUEUE_JOINED: 'queue_joined',
  QUEUE_UPDATED: 'queue_updated',
  SEARCHING: 'searching',
  MATCH_FOUND: 'match_found',
  QUEUE_CANCELLED: 'queue_cancelled',
  ERROR: 'error',
  HEARTBEAT: 'heartbeat',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
} as const;

export type ClientEvent =
  (typeof MATCHMAKING_CLIENT_EVENTS)[keyof typeof MATCHMAKING_CLIENT_EVENTS];
export type ServerEvent =
  (typeof MATCHMAKING_SERVER_EVENTS)[keyof typeof MATCHMAKING_SERVER_EVENTS];
