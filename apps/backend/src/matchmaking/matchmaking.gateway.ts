import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  BadRequestException,
  Logger,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  ESTIMATED_WAIT_SECONDS,
  MatchmakingQueueService,
} from './matchmaking-queue.service';
import {
  MATCHMAKING_CLIENT_EVENTS,
  MATCHMAKING_SERVER_EVENTS,
} from './events/matchmaking.events';
import { JoinQueueDto, LeaveQueueDto } from './dto/matchmaking.dto';
import type {
  ConnectedPayload,
  QueueJoinedPayload,
  QueueUpdatedPayload,
  SearchingPayload,
  MatchFoundPayload,
  ErrorPayload,
  HeartbeatPayload,
} from './dto/matchmaking.dto';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ACCESS_TOKEN_COOKIE } from '../auth/constants/auth.constants';

type AuthenticatedSocket = Socket & { user?: AuthenticatedUser };

const HEARTBEAT_INTERVAL_MS = 30 * 1000; // 30 seconds

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/matchmaking',
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // #region debug-point B:gateway-validation-error
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'matchmaking-no-match',
          runId: 'pre-fix',
          hypothesisId: 'B',
          location: 'matchmaking.gateway.ts:49',
          msg: '[DEBUG] gateway validation failed before handler body',
          data: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints ?? null,
            children: error.children?.length ?? 0,
            targetType: error.target?.constructor?.name ?? null,
            valueType:
              error.value === null
                ? 'null'
                : error.value === undefined
                  ? 'undefined'
                  : typeof error.value,
          })),
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return new BadRequestException(errors);
    },
  }),
)
export class MatchmakingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MatchmakingGateway.name);
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private userSocketMap = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly queueService: MatchmakingQueueService,
  ) {}

  /**
   * Handle new WebSocket connections
   * Authenticate using JWT from cookies
   */
  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    this.logger.debug(`Client connected: ${socket.id}`);
    // #region debug-point C:handle-connection-enter
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'matchmaking-no-match',
        runId: 'pre-fix',
        hypothesisId: 'C',
        location: 'matchmaking.gateway.ts:76',
        msg: '[DEBUG] handleConnection entered',
        data: { socketId: socket.id },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    try {
      const token = this.extractAccessToken(socket);

      if (!token) {
        this.logger.warn(`Connection rejected - no token: ${socket.id}`);
        socket.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        phone: string;
      }>(token, {
        secret: this.configService.getOrThrow<string>(
          'AUTH_ACCESS_TOKEN_SECRET',
        ),
      });

      const user = await this.usersService.findByIdOrThrow(payload.sub);
      socket.user = this.usersService.toAuthenticatedUser(user);

      this.userSocketMap.set(socket.user.id, socket.id);
      this.queueService.updateSocketId(socket.user.id, socket.id);

      this.logger.debug(`User authenticated: ${socket.user.id} (${socket.id})`);
      // #region debug-point C:handle-connection-authenticated
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'matchmaking-no-match',
          runId: 'pre-fix',
          hypothesisId: 'C',
          location: 'matchmaking.gateway.ts:103',
          msg: '[DEBUG] socket authenticated',
          data: {
            userId: socket.user.id,
            socketId: socket.id,
            knownSockets: this.userSocketMap.size,
          },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      const connectedPayload: ConnectedPayload = {
        userId: socket.user.id,
        message: 'Connected to matchmaking service',
      };
      socket.emit(MATCHMAKING_SERVER_EVENTS.CONNECTED, connectedPayload);

      const existingPlayer = this.queueService.getPlayerByUserId(
        socket.user.id,
      );
      // #region debug-point C:handle-connection-existing-player
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'matchmaking-no-match',
          runId: 'pre-fix',
          hypothesisId: 'C',
          location: 'matchmaking.gateway.ts:123',
          msg: '[DEBUG] checked existing queue entry on connect',
          data: {
            userId: socket.user.id,
            socketId: socket.id,
            existingTicketId: existingPlayer?.id ?? null,
            existingPlayerSocketId: existingPlayer?.socketId ?? null,
          },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      if (existingPlayer) {
        const queueJoinedPayload: QueueJoinedPayload = {
          ticketId: existingPlayer.id,
          queue: existingPlayer.queue,
          estimatedWaitSeconds: ESTIMATED_WAIT_SECONDS,
        };
        const searchingPayload: SearchingPayload = {
          ticketId: existingPlayer.id,
          queue: existingPlayer.queue,
          elapsedSeconds: Math.floor(
            (Date.now() - existingPlayer.joinedAt) / 1000,
          ),
          estimatedWaitSeconds: ESTIMATED_WAIT_SECONDS,
        };

        socket.emit(MATCHMAKING_SERVER_EVENTS.QUEUE_JOINED, queueJoinedPayload);
        socket.emit(MATCHMAKING_SERVER_EVENTS.SEARCHING, searchingPayload);
      }

      // Start heartbeat if not already running
      if (!this.heartbeatInterval) {
        this.startHeartbeat();
      }
    } catch (error) {
      this.logger.warn(
        `Authentication failed for ${socket.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      socket.disconnect(true);
    }
  }

  /**
   * Handle client disconnection
   */
  async handleDisconnect(socket: AuthenticatedSocket): Promise<void> {
    if (!socket.user) {
      return;
    }

    this.logger.debug(`User disconnected: ${socket.user.id} (${socket.id})`);

    if (this.userSocketMap.get(socket.user.id) === socket.id) {
      this.userSocketMap.delete(socket.user.id);
    }

    // Remove from queue if this socket owned the active queue entry
    const player = this.queueService.getPlayerByUserId(socket.user.id);
    // #region debug-point C:handle-disconnect-before-cleanup
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'matchmaking-no-match',
        runId: 'pre-fix',
        hypothesisId: 'C',
        location: 'matchmaking.gateway.ts:190',
        msg: '[DEBUG] handleDisconnect queue lookup',
        data: {
          userId: socket.user.id,
          socketId: socket.id,
          queueTicketId: player?.id ?? null,
          queueSocketId: player?.socketId ?? null,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (player?.socketId === socket.id) {
      this.queueService.removePlayer(player.id);
      this.logger.debug(`User ${socket.user.id} removed from queue`);
      this.emitQueueUpdated();
    }

    // Stop intervals if no more connected users
    if (this.userSocketMap.size === 0) {
      this.stopHeartbeat();
    }
  }

  /**
   * Client: Join matchmaking queue
   */
  @SubscribeMessage(MATCHMAKING_CLIENT_EVENTS.JOIN_QUEUE)
  async handleJoinQueue(
    @MessageBody() payload: JoinQueueDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    // #region debug-point A:handle-join-queue-enter
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'matchmaking-no-match',
        runId: 'pre-fix',
        hypothesisId: 'A',
        location: 'matchmaking.gateway.ts:216',
        msg: '[DEBUG] handleJoinQueue received',
        data: {
          socketId: socket.id,
          userId: socket.user?.id ?? null,
          payload,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!socket.user) {
      this.sendError(socket, 'Not authenticated');
      return;
    }

    try {
      const { ticketId, estimatedWaitSeconds } = this.queueService.addPlayer(
        socket.user,
        socket.id,
      );
      const player = this.queueService.getPlayer(ticketId);

      if (!player) {
        this.sendError(socket, 'Failed to join queue');
        return;
      }

      const response: QueueJoinedPayload = {
        ticketId,
        queue: payload.queue,
        estimatedWaitSeconds,
      };
      const searchingPayload: SearchingPayload = {
        ticketId,
        queue: payload.queue,
        elapsedSeconds: Math.floor((Date.now() - player.joinedAt) / 1000),
        estimatedWaitSeconds,
      };

      socket.emit(MATCHMAKING_SERVER_EVENTS.QUEUE_JOINED, response);
      socket.emit(MATCHMAKING_SERVER_EVENTS.SEARCHING, searchingPayload);

      this.logger.debug(
        `User ${socket.user.id} joined queue with ticket ${ticketId}`,
      );
      // #region debug-point B:handle-join-queue-added
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'matchmaking-no-match',
          runId: 'pre-fix',
          hypothesisId: 'B',
          location: 'matchmaking.gateway.ts:271',
          msg: '[DEBUG] user added to queue',
          data: {
            userId: socket.user.id,
            socketId: socket.id,
            ticketId,
            queueSize: this.queueService.getQueueSize(),
          },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      this.emitQueueUpdated();
      this.processMatches();
    } catch (error) {
      this.logger.error(
        `Error joining queue for user ${socket.user.id}:`,
        error,
      );
      this.sendError(socket, 'Failed to join queue');
    }
  }

  /**
   * Client: Leave matchmaking queue
   */
  @SubscribeMessage(MATCHMAKING_CLIENT_EVENTS.LEAVE_QUEUE)
  async handleLeaveQueue(
    @MessageBody() payload: LeaveQueueDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    if (!socket.user) {
      this.sendError(socket, 'Not authenticated');
      return;
    }

    try {
      const removed = this.queueService.removePlayerForUser(
        payload.ticketId,
        socket.user.id,
      );

      if (!removed) {
        this.sendError(socket, 'Ticket not found');
        return;
      }

      socket.emit(MATCHMAKING_SERVER_EVENTS.QUEUE_CANCELLED, {
        ticketId: payload.ticketId,
        reason: 'User cancelled',
      });

      this.logger.debug(
        `User ${socket.user.id} left queue (ticket: ${payload.ticketId})`,
      );

      this.emitQueueUpdated();
    } catch (error) {
      this.logger.error(
        `Error leaving queue for user ${socket.user.id}:`,
        error,
      );
      this.sendError(socket, 'Failed to leave queue');
    }
  }

  /**
   * Client: Heartbeat (keep-alive)
   */
  @SubscribeMessage(MATCHMAKING_CLIENT_EVENTS.PING)
  handlePing(
    @MessageBody() _payload: Record<string, never>,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): void {
    const payload: HeartbeatPayload = {
      timestamp: Date.now(),
    };
    socket.emit(MATCHMAKING_SERVER_EVENTS.HEARTBEAT, payload);
  }

  /**
   * Periodically send heartbeat to all connected clients
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const payload: HeartbeatPayload = {
        timestamp: Date.now(),
      };
      this.server.emit(MATCHMAKING_SERVER_EVENTS.HEARTBEAT, payload);
    }, HEARTBEAT_INTERVAL_MS);

    this.logger.debug('Heartbeat started');
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      this.logger.debug('Heartbeat stopped');
    }
  }

  /**
   * Check for player matches and emit match_found events
   */
  private processMatches(): void {
    let matchedAtLeastOnePair = false;
    // #region debug-point D:process-matches-enter
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'matchmaking-no-match',
        runId: 'pre-fix',
        hypothesisId: 'D',
        location: 'matchmaking.gateway.ts:376',
        msg: '[DEBUG] processMatches entered',
        data: {
          queueSize: this.queueService.getQueueSize(),
          connectedSockets: this.userSocketMap.size,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    while (true) {
      const match = this.queueService.findAndPairPlayers();
      if (!match) {
        // #region debug-point D:process-matches-empty
        fetch('http://127.0.0.1:7777/event', {
          method: 'POST',
          body: JSON.stringify({
            sessionId: 'matchmaking-no-match',
            runId: 'pre-fix',
            hypothesisId: 'D',
            location: 'matchmaking.gateway.ts:392',
            msg: '[DEBUG] processMatches found no pair',
            data: {
              queueSize: this.queueService.getQueueSize(),
              connectedSockets: this.userSocketMap.size,
            },
            ts: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        break;
      }

      matchedAtLeastOnePair = true;

      const { player1, player2, sessionId } = match;

      // Get socket IDs
      const socket1Id = this.userSocketMap.get(player1.userId);
      const socket2Id = this.userSocketMap.get(player2.userId);
      // #region debug-point D:process-matches-paired
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'matchmaking-no-match',
          runId: 'pre-fix',
          hypothesisId: 'D',
          location: 'matchmaking.gateway.ts:409',
          msg: '[DEBUG] processMatches paired players',
          data: {
            player1UserId: player1.userId,
            player1TicketId: player1.id,
            player2UserId: player2.userId,
            player2TicketId: player2.id,
            socket1Id: socket1Id ?? null,
            socket2Id: socket2Id ?? null,
            sessionId,
          },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (!socket1Id || !socket2Id) {
        this.logger.warn(
          `Socket not found for matched players: ${player1.userId}, ${player2.userId}`,
        );
        continue;
      }

      // Send match found to both players
      const payload1: MatchFoundPayload = {
        ticketId: player1.id,
        sessionId,
        queue: 'random',
        opponent: {
          id: player2.userId,
          name: player2.userName,
        },
      };

      const payload2: MatchFoundPayload = {
        ticketId: player2.id,
        sessionId,
        queue: 'random',
        opponent: {
          id: player1.userId,
          name: player1.userName,
        },
      };

      this.server
        .to(socket1Id)
        .emit(MATCHMAKING_SERVER_EVENTS.MATCH_FOUND, payload1);
      this.server
        .to(socket2Id)
        .emit(MATCHMAKING_SERVER_EVENTS.MATCH_FOUND, payload2);

      this.logger.log(
        `Match found and notified: ${player1.userId} vs ${player2.userId}`,
      );
    }

    if (matchedAtLeastOnePair) {
      this.emitQueueUpdated();
    }
  }

  /**
   * Send error to client
   */
  private sendError(socket: Socket, message: string): void {
    const payload: ErrorPayload = {
      message,
    };
    socket.emit(MATCHMAKING_SERVER_EVENTS.ERROR, payload);
  }

  private emitQueueUpdated(): void {
    const payload: QueueUpdatedPayload = {
      queueSize: this.queueService.getQueueSize(),
    };
    this.server.emit(MATCHMAKING_SERVER_EVENTS.QUEUE_UPDATED, payload);
  }

  private extractAccessToken(socket: Socket): string | undefined {
    return socket.handshake.headers.cookie
      ?.split('; ')
      .find((cookie) => cookie.startsWith(`${ACCESS_TOKEN_COOKIE}=`))
      ?.substring(`${ACCESS_TOKEN_COOKIE}=`.length);
  }

  /**
   * Clean up on module destroy
   */
  onModuleDestroy(): void {
    this.stopHeartbeat();
    this.queueService.stopCleanupInterval();
  }
}
