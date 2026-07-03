import Link from "next/link";
import { BadgeCheck, Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import {
  buildPlayerProfileHref,
  formatPersianNumber,
  getInitials,
} from "../lib/utils";
import type { LeaderboardPlayer } from "../types";

const topCardStyles = {
  1: {
    containerClassName: "order-2 lg:-mt-5",
    ringClassName:
      "border-[#E0B348] shadow-[0_18px_40px_rgba(198,154,66,0.24)]",
    badgeClassName: "bg-[#E0B348] text-white",
    crownClassName: "text-[#E0B348]",
  },
  2: {
    containerClassName: "order-1",
    ringClassName:
      "border-[#C7CDD5] shadow-[0_16px_36px_rgba(118,125,132,0.18)]",
    badgeClassName: "bg-[#9AA3AD] text-white",
    crownClassName: "text-[#9AA3AD]",
  },
  3: {
    containerClassName: "order-3",
    ringClassName:
      "border-[#D29C63] shadow-[0_16px_36px_rgba(157,104,54,0.18)]",
    badgeClassName: "bg-[#C98348] text-white",
    crownClassName: "text-[#C98348]",
  },
} as const;

type LeaderboardTopCardProps = {
  player: LeaderboardPlayer;
  position: 1 | 2 | 3;
};

export default function LeaderboardTopCard({
  player,
  position,
}: LeaderboardTopCardProps) {
  const style = topCardStyles[position];

  return (
    <Link
      href={buildPlayerProfileHref(player.username)}
      className={cn(
        "relative flex min-h-[252px] flex-col items-center rounded-[24px] border bg-white px-6 py-7 text-center shadow-[0_20px_48px_rgba(31,37,37,0.05)] transition-transform hover:-translate-y-1",
        style.containerClassName,
        style.ringClassName,
      )}
    >
      <Crown className={cn("absolute -top-5 size-9", style.crownClassName)} />
      <Avatar className="size-24 border-[6px] border-white shadow-[0_12px_30px_rgba(31,37,37,0.14)]">
        <AvatarFallback className="bg-[linear-gradient(135deg,#DAD8D2_0%,#BEB7AA_100%)] text-2xl font-bold text-[#34413B]">
          {getInitials(player.name)}
        </AvatarFallback>
      </Avatar>
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="text-2xl font-extrabold text-[#1F2525]">
            {player.name}
          </h3>
          {player.verified ? (
            <BadgeCheck className="size-5 fill-[#6F9D78] text-[#6F9D78]" />
          ) : null}
        </div>
        <p className="text-sm text-[#7A7F7C]">
          ELO{" "}
          <span className="mr-1 text-[2rem] font-black text-[#1F2525]">
            {formatPersianNumber(player.elo)}
          </span>
        </p>
      </div>
      <div
        className={cn(
          "mt-auto inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold",
          style.badgeClassName,
        )}
      >
        {formatPersianNumber(position)}
      </div>
    </Link>
  );
}
