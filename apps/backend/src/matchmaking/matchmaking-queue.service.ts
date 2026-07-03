import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

const MATCHMAKING_TICKET_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
export const ESTIMATED_WAIT_SECONDS = 12;
const CLEANUP_INTERVAL_MS = 30 * 1000; // 30 seconds

type QueuePlayerStatus = 'searching' | 'matched' | 'cancelled';

type QueuePlayer = {
  id: string;
  userId: string;
  userName: string;
  queue: 'random';
  joinedAt: number;
  socketId: string;
  status: QueuePlayerStatus;
  matchedWith?: string; // ticketId of matched opponent
  sessionId?: string;
};

@Injectable()
export class MatchmakingQueueService {
  private readonly logger = new Logger(MatchmakingQueueService.name);
  private queue = new Map<string, QueuePlayer>(); // ticketId -> QueuePlayer
  private userQueueMap = new Map<string, string>(); // userId -> ticketId
  private cleanupIntervalHandle: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
  }

  /**
   * Add player to queue
   * Prevents duplicates - one player, one ticket
   */
  addPlayer(
    user: AuthenticatedUser,
    socketId: string,
  ): {
    ticketId: string;
    estimatedWaitSeconds: number;
    alreadyQueued: boolean;
  } {
    // Check for existing active ticket
    const existingTicketId = this.userQueueMap.get(user.id);
    if (existingTicketId) {
      const existingPlayer = this.queue.get(existingTicketId);
      if (
        existingPlayer &&
        existingPlayer.status === 'searching' &&
        Date.now() - existingPlayer.joinedAt < MATCHMAKING_TICKET_EXPIRY_MS
      ) {
        existingPlayer.socketId = socketId;
        this.logger.debug(
          `User ${user.id} already has active ticket ${existingTicketId}`,
        );
        return {
          ticketId: existingTicketId,
          estimatedWaitSeconds: ESTIMATED_WAIT_SECONDS,
          alreadyQueued: true,
        };
      }

      this.removePlayer(existingTicketId);
    }

    // Create new ticket
    const ticketId = randomUUID();
    const player: QueuePlayer = {
      id: ticketId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      queue: 'random',
      joinedAt: Date.now(),
      socketId,
      status: 'searching',
    };

    this.queue.set(ticketId, player);
    this.userQueueMap.set(user.id, ticketId);

    this.logger.debug(`Player ${user.id} joined queue with ticket ${ticketId}`);

    return {
      ticketId,
      estimatedWaitSeconds: ESTIMATED_WAIT_SECONDS,
      alreadyQueued: false,
    };
  }

  /**
   * Remove player from queue
   */
  removePlayer(ticketId: string): boolean {
    const player = this.queue.get(ticketId);
    if (!player) {
      return false;
    }

    this.userQueueMap.delete(player.userId);
    this.queue.delete(ticketId);

    this.logger.debug(`Player removed from queue: ${ticketId}`);
    return true;
  }

  removePlayerForUser(ticketId: string, userId: string): boolean {
    const player = this.queue.get(ticketId);
    if (!player || player.userId !== userId) {
      return false;
    }

    return this.removePlayer(ticketId);
  }

  removePlayerByUserId(userId: string): QueuePlayer | null {
    const player = this.getPlayerByUserId(userId);
    if (!player) {
      return null;
    }

    this.removePlayer(player.id);
    return player;
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return Array.from(this.queue.values()).filter(
      (player) => player.status === 'searching',
    ).length;
  }

  /**
   * Get player by ticket ID
   */
  getPlayer(ticketId: string): QueuePlayer | undefined {
    return this.queue.get(ticketId);
  }

  /**
   * Get player by user ID
   */
  getPlayerByUserId(userId: string): QueuePlayer | undefined {
    const ticketId = this.userQueueMap.get(userId);
    if (!ticketId) return undefined;
    return this.queue.get(ticketId);
  }

  /**
   * Pair two players from queue
   * Simple FIFO matching - pair oldest two players
   */
  findAndPairPlayers(): {
    player1: QueuePlayer;
    player2: QueuePlayer;
    sessionId: string;
  } | null {
    // Get all searching players sorted by join time (oldest first)
    const searchingPlayers = Array.from(this.queue.values())
      .filter((p) => p.status === 'searching')
      .sort((a, b) => a.joinedAt - b.joinedAt);

    if (searchingPlayers.length < 2) {
      return null;
    }

    const player1 = searchingPlayers[0]!;
    const player2 = searchingPlayers[1]!;

    // Create match
    const sessionId = randomUUID();
    player1.status = 'matched';
    player1.matchedWith = player2.id;
    player1.sessionId = sessionId;

    player2.status = 'matched';
    player2.matchedWith = player1.id;
    player2.sessionId = sessionId;

    this.logger.debug(
      `Match found: ${player1.userId} vs ${player2.userId} (session: ${sessionId})`,
    );

    this.userQueueMap.delete(player1.userId);
    this.userQueueMap.delete(player2.userId);
    this.queue.delete(player1.id);
    this.queue.delete(player2.id);

    return { player1, player2, sessionId };
  }

  /**
   * Update socket ID when user reconnects
   */
  updateSocketId(userId: string, newSocketId: string): boolean {
    const player = this.getPlayerByUserId(userId);
    if (!player) {
      return false;
    }

    player.socketId = newSocketId;
    return true;
  }

  /**
   * Mark as cancelled
   */
  cancelPlayer(ticketId: string): boolean {
    const player = this.queue.get(ticketId);
    if (!player) {
      return false;
    }

    player.status = 'cancelled';
    this.userQueueMap.delete(player.userId);
    this.queue.delete(ticketId);
    return true;
  }

  /**
   * Clean up stale queue entries
   */
  private cleanupStaleEntries(): void {
    const now = Date.now();
    const staleTickets: string[] = [];

    this.queue.forEach((player, ticketId) => {
      // Remove if expired
      if (now - player.joinedAt > MATCHMAKING_TICKET_EXPIRY_MS) {
        staleTickets.push(ticketId);
      }
    });

    staleTickets.forEach((ticketId) => {
      this.removePlayer(ticketId);
    });

    if (staleTickets.length > 0) {
      this.logger.debug(`Cleaned up ${staleTickets.length} stale entries`);
    }
  }

  /**
   * Start periodic cleanup
   */
  private startCleanupInterval(): void {
    this.cleanupIntervalHandle = setInterval(() => {
      this.cleanupStaleEntries();
    }, CLEANUP_INTERVAL_MS);
  }

  /**
   * Stop cleanup interval (for module destruction)
   */
  stopCleanupInterval(): void {
    if (this.cleanupIntervalHandle) {
      clearInterval(this.cleanupIntervalHandle);
      this.cleanupIntervalHandle = null;
    }
  }

  /**
   * Get all players in queue (for testing/debugging)
   */
  getAllPlayers(): QueuePlayer[] {
    return Array.from(this.queue.values());
  }

  /**
   * Clear all queue (for testing)
   */
  clearQueue(): void {
    this.queue.clear();
    this.userQueueMap.clear();
    this.logger.debug('Queue cleared');
  }
}
