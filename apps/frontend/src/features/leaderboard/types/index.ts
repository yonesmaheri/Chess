import type { LucideIcon } from "lucide-react";
import type {
  LeaderboardCurrentUser,
  LeaderboardMode,
  LeaderboardPlayer,
} from "@/shared/api/services/leaderboard";

export type { LeaderboardCurrentUser, LeaderboardMode, LeaderboardPlayer };

export type LeaderboardModeConfig = {
  label: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
  chipClassName: string;
};
