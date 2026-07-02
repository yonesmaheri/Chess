import { BadgeCheck, Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { formatPercent, formatPersianNumber, formatSignedPercent, getInitials } from "../lib/utils";
import type { LeaderboardCurrentUser, LeaderboardModeConfig } from "../types";
import IranFlag from "./IranFlag";

type LeaderboardCurrentUserCardProps = {
  config: LeaderboardModeConfig;
  currentUser: LeaderboardCurrentUser;
  userName: string;
};

export default function LeaderboardCurrentUserCard({
  config,
  currentUser,
  userName,
}: LeaderboardCurrentUserCardProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#D0DDD3] bg-[linear-gradient(135deg,#6F8F78_0%,#8EAD96_100%)] px-6 py-5 text-white shadow-[0_26px_60px_rgba(72,101,84,0.24)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full border border-white/20 bg-white/10 p-3">
            <Trophy className="size-6" />
          </div>
          <div>
            <p className="text-sm text-white/80">جایگاه شما در {config.label}</p>
            <p className="mt-1 text-3xl font-black">
              رتبه شما: #{formatPersianNumber(currentUser.rank)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <div className="text-right">
            <p className="text-xs text-white/75">درصد برد</p>
            <p className="mt-1 text-xl font-bold">
              {formatPercent(currentUser.winRate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/75">رشد این دوره</p>
            <p className="mt-1 text-xl font-bold">
              {formatSignedPercent(currentUser.trend)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/75">ELO</p>
            <p className="mt-1 text-xl font-bold">
              {formatPersianNumber(currentUser.elo)}
            </p>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div className="flex items-center gap-3">
            <IranFlag />
            <div className="flex items-center gap-3">
              <BadgeCheck className="size-5 fill-[#BDE3C6] text-[#BDE3C6]" />
              <span className="font-semibold">{userName}</span>
            </div>
            <Avatar className="size-12 border-[3px] border-white/75">
              <AvatarFallback className="bg-white/15 text-base font-bold text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </section>
  );
}
