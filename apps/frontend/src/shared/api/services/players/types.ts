export type PlayerProfileMode = "blitz" | "rapid" | "puzzle";

export type PlayerProfileAchievementIcon =
  | "target"
  | "zap"
  | "crown"
  | "flame"
  | "shield";

export type PlayerProfileAchievement = {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: PlayerProfileAchievementIcon;
};

export type PlayerProfileHistoryPoint = {
  date: string;
  elo: number;
};

export type PlayerProfileRecentGameResult = "win" | "loss" | "draw";

export type PlayerProfileRecentGameColor = "white" | "black";

export type PlayerProfileRecentGame = {
  id: string;
  opponentName: string;
  opponentElo: number;
  result: PlayerProfileRecentGameResult;
  color: PlayerProfileRecentGameColor;
  mode: PlayerProfileMode;
  playedAt: string;
};

export type PlayerProfile = {
  id: string;
  username: string;
  mode: PlayerProfileMode;
  name: string;
  countryCode: string;
  countryName: string;
  verified: boolean;
  avatarUrl: string;
  title: string;
  joinedAt: string;
  worldRank: number;
  countryRank: number;
  currentElo: number;
  peakElo: number;
  eloChange: number;
  totalGames: number;
  winRate: number;
  lossRate: number;
  drawRate: number;
  about: string;
  achievements: PlayerProfileAchievement[];
  ratingHistory: PlayerProfileHistoryPoint[];
  recentGames: PlayerProfileRecentGame[];
};
