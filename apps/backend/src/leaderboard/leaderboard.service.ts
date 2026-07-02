import { Injectable } from '@nestjs/common';
import { LeaderboardMode } from '../generated/prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { ListLeaderboardQueryDto } from './dto/list-leaderboard-query.dto';
import {
  LEADERBOARD_TOP_PLAYERS_COUNT,
  leaderboardCurrentUserByMode,
} from './leaderboard.constants';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListLeaderboardQueryDto) {
    const mode = query.mode ?? LeaderboardMode.blitz;
    const requestedPage = query.page ?? 1;
    const limit = query.limit ?? 7;

    const [topThree, totalItems] = await Promise.all([
      this.prisma.leaderboardEntry.findMany({
        where: { mode },
        orderBy: { rank: 'asc' },
        take: LEADERBOARD_TOP_PLAYERS_COUNT,
      }),
      this.prisma.leaderboardEntry.count({
        where: { mode },
      }),
    ]);

    const paginatedItemsCount = Math.max(
      0,
      totalItems - LEADERBOARD_TOP_PLAYERS_COUNT,
    );
    const totalPages = Math.max(1, Math.ceil(paginatedItemsCount / limit));
    const currentPage = Math.min(requestedPage, totalPages);
    const skip = LEADERBOARD_TOP_PLAYERS_COUNT + (currentPage - 1) * limit;
    const players = await this.prisma.leaderboardEntry.findMany({
      where: { mode },
      orderBy: { rank: 'asc' },
      skip,
      take: limit,
    });
    const startRank = players[0]?.rank ?? 0;
    const endRank = players[players.length - 1]?.rank ?? 0;

    return {
      mode,
      topThree: topThree.map((entry) => this.mapEntry(entry)),
      players: players.map((entry) => this.mapEntry(entry)),
      totalItems,
      currentPage,
      totalPages,
      pageSize: limit,
      startRank,
      endRank,
      currentUser: leaderboardCurrentUserByMode[mode],
    };
  }

  private mapEntry(entry: {
    id: string;
    rank: number;
    name: string;
    countryCode: string;
    countryName: string;
    elo: number;
    winRate: number;
    trend: number;
    verified: boolean;
  }) {
    return {
      id: entry.id,
      rank: entry.rank,
      name: entry.name,
      countryCode: entry.countryCode,
      countryName: entry.countryName,
      elo: entry.elo,
      winRate: entry.winRate,
      trend: entry.trend,
      verified: entry.verified,
    };
  }
}
