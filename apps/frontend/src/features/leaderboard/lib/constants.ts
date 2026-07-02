import { Clock3, Puzzle, Zap } from "lucide-react";
import type { LeaderboardMode, LeaderboardModeConfig } from "../types";

export const LEADERBOARD_PAGE_SIZE = 7;

export const LEADERBOARD_MODES: Record<LeaderboardMode, LeaderboardModeConfig> = {
  blitz: {
    label: "بلیتس",
    subtitle: "۵ دقیقه",
    description: "رقابت سریع با بیشترین حجم بازی در هفته جاری",
    icon: Zap,
    accentClassName:
      "border-[#CFE0D2] bg-[linear-gradient(135deg,#5C8167_0%,#7E9E85_100%)] text-white shadow-[0_24px_52px_rgba(72,101,84,0.24)]",
    chipClassName: "border-[#DCE8E0] bg-[#F7FAF7] text-[#486554]",
  },
  rapid: {
    label: "رپید",
    subtitle: "۱۰ دقیقه",
    description: "جایگاه بازیکنان برتر در مسابقات زمان متوسط",
    icon: Clock3,
    accentClassName:
      "border-[#D7DFEA] bg-[linear-gradient(135deg,#5B6D8A_0%,#7E91B0_100%)] text-white shadow-[0_24px_52px_rgba(91,109,138,0.24)]",
    chipClassName: "border-[#E3E8F2] bg-[#F8FAFE] text-[#5B6D8A]",
  },
  puzzle: {
    label: "پازل",
    subtitle: "همه زمان‌ها",
    description: "برترین حل‌کنندگان تمرین‌ها و معماهای تاکتیکی",
    icon: Puzzle,
    accentClassName:
      "border-[#E6DCC7] bg-[linear-gradient(135deg,#7D6844_0%,#A48A5D_100%)] text-white shadow-[0_24px_52px_rgba(125,104,68,0.24)]",
    chipClassName: "border-[#EFE6D7] bg-[#FCFAF6] text-[#7D6844]",
  },
};

export const LEADERBOARD_MODE_ORDER: LeaderboardMode[] = [
  "blitz",
  "rapid",
  "puzzle",
];
