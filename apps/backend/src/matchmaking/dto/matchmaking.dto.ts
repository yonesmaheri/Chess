import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * Client -> Server Payloads
 */

export class JoinQueueDto {
  @IsIn(['random'])
  queue: 'random';
}

export class LeaveQueueDto {
  @IsUUID('4')
  ticketId: string;
}

/**
 * Server -> Client Payloads
 */

export class QueueJoinedPayload {
  ticketId: string;
  queue: 'random';
  estimatedWaitSeconds: number;
}

export class SearchingPayload {
  ticketId: string;
  queue: 'random';
  elapsedSeconds: number;
  estimatedWaitSeconds: number;
}

export class MatchFoundPayload {
  ticketId: string;
  sessionId: string;
  queue: 'random';
  opponent: {
    id: string;
    name: string;
    rating?: number;
    country?: string;
  };
}

export class QueueCancelledPayload {
  ticketId: string;
  reason: string;
}

export class ErrorPayload {
  message: string;

  @IsOptional()
  @IsString()
  code?: string;
}

export class HeartbeatPayload {
  timestamp: number;
}

export class QueueUpdatedPayload {
  queueSize: number;
}

export class ConnectedPayload {
  userId: string;
  message: string;
}

export class DisconnectedPayload {
  reason: string;
}
