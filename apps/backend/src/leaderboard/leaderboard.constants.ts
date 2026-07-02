import { LeaderboardMode } from '../generated/prisma/client';

export const LEADERBOARD_PAGE_SIZE = 7;
export const LEADERBOARD_TOP_PLAYERS_COUNT = 3;

export const leaderboardCurrentUserByMode: Record<
  LeaderboardMode,
  {
    rank: number;
    elo: number;
    winRate: number;
    trend: number;
  }
> = {
  [LeaderboardMode.blitz]: {
    rank: 542,
    elo: 1823,
    winRate: 48.6,
    trend: 1.4,
  },
  [LeaderboardMode.rapid]: {
    rank: 318,
    elo: 1962,
    winRate: 51.3,
    trend: 1.1,
  },
  [LeaderboardMode.puzzle]: {
    rank: 184,
    elo: 2148,
    winRate: 57.9,
    trend: 1.8,
  },
};
