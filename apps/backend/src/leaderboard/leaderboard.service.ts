import { Injectable, NotFoundException } from '@nestjs/common';
import { LeaderboardMode, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { ListLeaderboardQueryDto } from './dto/list-leaderboard-query.dto';
import {
  LEADERBOARD_TOP_PLAYERS_COUNT,
  leaderboardCurrentUserByMode,
} from './leaderboard.constants';

type LeaderboardEntryRecord = {
  id: string;
  mode: LeaderboardMode;
  rank: number;
  name: string;
  username: string;
  countryCode: string;
  countryName: string;
  elo: number;
  winRate: number;
  trend: number;
  verified: boolean;
};

const PLAYER_ACHIEVEMENT_ICONS = [
  'target',
  'zap',
  'crown',
  'flame',
  'shield',
] as const;

const RECENT_OPPONENTS = [
  'پارسا احمدی',
  'مهدی افشاری',
  'سپهر قاسمی',
  'کاوه نادری',
  'امیرحسین طالبی',
  'محمد قربانی',
  'بردیا زمانی',
  'ماهان رضوی',
];

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

  async findPlayerProfile(usernameOrLegacyIdentifier: string) {
    const entry = await this.findEntryByIdentifier(usernameOrLegacyIdentifier);

    if (!entry) {
      throw new NotFoundException('Player profile not found.');
    }

    const totalItems = await this.prisma.leaderboardEntry.count({
      where: { mode: entry.mode },
    });

    return this.mapPlayerProfile(entry, totalItems);
  }

  private findEntryByIdentifier(identifier: string) {
    const orConditions: Prisma.LeaderboardEntryWhereInput[] = [
      { username: identifier },
    ];
    const legacyWhere = this.buildLegacyIdentifierWhere(identifier);

    if (legacyWhere) {
      orConditions.push(legacyWhere);
    }

    return this.prisma.leaderboardEntry.findFirst({
      where: {
        OR: orConditions,
      },
    });
  }

  private buildLegacyIdentifierWhere(identifier: string) {
    const rankedIdentifier = this.parseRankedIdentifier(identifier);

    if (rankedIdentifier) {
      return {
        mode: rankedIdentifier.mode,
        rank: rankedIdentifier.rank,
      };
    }

    if (this.looksLikeUuid(identifier)) {
      return {
        id: identifier,
      };
    }

    return null;
  }

  private mapEntry(entry: LeaderboardEntryRecord) {
    return {
      id: entry.id,
      username: entry.username,
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

  private mapPlayerProfile(entry: LeaderboardEntryRecord, totalItems: number) {
    const worldRank = entry.rank;
    const countryRank = Math.max(1, Math.round(entry.rank * 0.34));
    const totalGames = 920 + Math.max(totalItems - entry.rank, 0) * 9;
    const winRate = this.round(entry.winRate);
    const drawRate = this.round(Math.min(18, 8.4 + (entry.rank % 6) * 1.25));
    const lossRate = this.round(Math.max(4, 100 - winRate - drawRate));
    const adjustedDrawRate = this.round(100 - winRate - lossRate);
    const peakElo =
      entry.elo + 28 + Math.round(entry.trend * 18) + (entry.rank % 4) * 6;
    const eloChange = Math.max(4, Math.round(entry.trend * 12));
    const joinedAt = this.buildJoinedAt(entry);

    return {
      id: entry.id,
      username: entry.username,
      mode: entry.mode,
      name: entry.name,
      countryCode: entry.countryCode,
      countryName: entry.countryName,
      verified: entry.verified,
      avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(entry.name)}`,
      title: this.getPlayerTitle(entry.rank, entry.mode),
      joinedAt: joinedAt.toISOString(),
      worldRank,
      countryRank,
      currentElo: entry.elo,
      peakElo,
      eloChange,
      totalGames,
      winRate,
      lossRate,
      drawRate: adjustedDrawRate,
      about: this.buildAbout(entry),
      achievements: this.buildAchievements(entry, peakElo),
      ratingHistory: this.buildRatingHistory(entry),
      recentGames: this.buildRecentGames(entry),
    };
  }

  private buildJoinedAt(entry: LeaderboardEntryRecord) {
    const modeOffset =
      entry.mode === LeaderboardMode.blitz
        ? 0
        : entry.mode === LeaderboardMode.rapid
          ? 90
          : 180;
    const joinedAt = new Date();

    joinedAt.setDate(joinedAt.getDate() - (420 + entry.rank * 13 + modeOffset));

    return joinedAt;
  }

  private buildAbout(entry: LeaderboardEntryRecord) {
    const modeLabel = this.getModeLabel(entry.mode);

    return `${entry.name} از بازیکنان برتر ${modeLabel} در ${entry.countryName} است که با ریتینگ ${entry.elo} و روند رو به رشد ${this.round(entry.trend)} درصدی، به شکل مداوم در جدول رده بندی حضور دارد. این بازیکن با سبک بازی فعال و دقت بالا در موقعیت های حساس، یکی از چهره های قابل توجه این بخش محسوب می شود.`;
  }

  private buildAchievements(entry: LeaderboardEntryRecord, peakElo: number) {
    const winStreak = 4 + (entry.rank % 5);
    const modeLabel = this.getModeLabel(entry.mode);

    return [
      {
        id: `${entry.id}-accuracy`,
        label: 'دقت تاکتیکی',
        value: `${this.round(84 + entry.trend * 4)}٪`,
        description: 'میانگین دقت در تصمیم های تهاجمی',
        icon: PLAYER_ACHIEVEMENT_ICONS[0],
      },
      {
        id: `${entry.id}-streak`,
        label: 'بیشترین برد پیاپی',
        value: `${winStreak} بازی`,
        description: 'بهترین عملکرد متوالی در مسابقات اخیر',
        icon: PLAYER_ACHIEVEMENT_ICONS[1],
      },
      {
        id: `${entry.id}-peak`,
        label: 'بالاترین ریتینگ',
        value: `${peakElo}`,
        description: `بیشترین ELO ثبت شده در بخش ${modeLabel}`,
        icon: PLAYER_ACHIEVEMENT_ICONS[2],
      },
      {
        id: `${entry.id}-form`,
        label: 'فرم اخیر',
        value: `+${Math.max(7, Math.round(entry.trend * 9))}`,
        description: 'تغییر ریتینگ در چند هفته اخیر',
        icon: PLAYER_ACHIEVEMENT_ICONS[3],
      },
      {
        id: `${entry.id}-defense`,
        label: 'بازی های بدون باخت',
        value: `${18 + (entry.rank % 7)}`,
        description: 'تعداد مسابقات اخیر بدون شکست',
        icon: PLAYER_ACHIEVEMENT_ICONS[4],
      },
    ];
  }

  private buildRatingHistory(entry: LeaderboardEntryRecord) {
    const monthOffsets = [7, 6, 5, 4, 3, 2, 1, 0];
    const baseDrop = 140 + entry.rank * 2;

    return monthOffsets.map((offset, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - offset);
      const progressFactor = index / (monthOffsets.length - 1);
      const wobble = ((entry.rank + index) % 3) * 7 - 7;
      const elo = Math.round(
        entry.elo - baseDrop + progressFactor * baseDrop + wobble,
      );

      return {
        date: date.toISOString(),
        elo,
      };
    });
  }

  private buildRecentGames(entry: LeaderboardEntryRecord) {
    const baseTimestamp = Date.now();
    const outcomes = this.buildRecentOutcomes(entry.winRate);

    return Array.from({ length: 5 }, (_, index) => {
      const opponentName =
        RECENT_OPPONENTS[(entry.rank + index) % RECENT_OPPONENTS.length];
      const playedAt = new Date(baseTimestamp - (index + 1) * 86400000 * 2);
      const ratingShift = [22, -16, 31, -12, 18][index] ?? 10;

      return {
        id: `${entry.id}-game-${index + 1}`,
        opponentName,
        opponentElo: Math.max(900, entry.elo + ratingShift),
        result: outcomes[index] ?? 'draw',
        color: index % 2 === 0 ? 'black' : 'white',
        mode: entry.mode,
        playedAt: playedAt.toISOString(),
      };
    });
  }

  private buildRecentOutcomes(winRate: number) {
    if (winRate >= 65) {
      return ['win', 'loss', 'draw', 'win', 'win'] as const;
    }

    if (winRate >= 58) {
      return ['win', 'draw', 'loss', 'win', 'win'] as const;
    }

    return ['draw', 'loss', 'win', 'draw', 'win'] as const;
  }

  private getPlayerTitle(rank: number, mode: LeaderboardMode) {
    if (rank <= 3) {
      return `مدعی قهرمانی ${this.getModeLabel(mode)}`;
    }

    if (rank <= 10) {
      return `استاد برتر ${this.getModeLabel(mode)}`;
    }

    return `بازیکن آماده ${this.getModeLabel(mode)}`;
  }

  private getModeLabel(mode: LeaderboardMode) {
    switch (mode) {
      case LeaderboardMode.rapid:
        return 'رپید';
      case LeaderboardMode.puzzle:
        return 'پازل';
      case LeaderboardMode.blitz:
      default:
        return 'بلیتز';
    }
  }

  private round(value: number) {
    return Number(value.toFixed(1));
  }

  private parseRankedIdentifier(identifier: string) {
    const match = /^(blitz|rapid|puzzle)-(\d+)$/.exec(identifier);

    if (!match) {
      return null;
    }

    const rank = Number(match[2]);

    if (!Number.isInteger(rank) || rank <= 0) {
      return null;
    }

    return {
      mode: match[1] as LeaderboardMode,
      rank,
    };
  }

  private looksLikeUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }
}
