export type LeaderboardMode = "blitz" | "rapid" | "puzzle";

export type LeaderboardPlayer = {
  id: string;
  rank: number;
  name: string;
  countryCode: string;
  countryName: string;
  elo: number;
  winRate: number;
  trend: number;
  verified: boolean;
};

export type LeaderboardCurrentUser = {
  rank: number;
  elo: number;
  winRate: number;
  trend: number;
};

export type GetLeaderboardParams = {
  mode?: LeaderboardMode;
  page?: number;
  limit?: number;
};

export type GetLeaderboardResponse = {
  mode: LeaderboardMode;
  topThree: LeaderboardPlayer[];
  players: LeaderboardPlayer[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startRank: number;
  endRank: number;
  currentUser: LeaderboardCurrentUser;
};
