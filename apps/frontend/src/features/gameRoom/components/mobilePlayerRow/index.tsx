import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import type { GameRoomPlayerStatus } from "../../types";

type MobilePlayerRowProps = {
  clockValue: string;
  highlightClock?: boolean;
  isOnline: boolean;
  name: string;
  rating: string;
  status: GameRoomPlayerStatus;
};

export default function MobilePlayerRow({
  clockValue,
  highlightClock = false,
  isOnline,
  name,
  rating,
  status,
}: MobilePlayerRowProps) {
  const statusText =
    status === "winner"
      ? "برنده"
      : status === "loser"
        ? "بازنده"
        : status === "active"
          ? "نوبت حرکت"
          : "در انتظار";

  return (
    <section className="rounded-[22px] border border-[#E5EAE2] bg-white px-3 py-3 shadow-[0_18px_40px_rgba(31,37,37,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback className="bg-[#EDF3EB] text-sm font-bold text-[#5B7A62]">
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-base font-black text-[#1F2525]">
              {name}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-sm text-[#6E7772]">
              <span className="font-semibold text-[#5D675E]">{rating}</span>
              <span>●</span>
              <span className={cn(isOnline ? "text-[#2F8A4E]" : "text-[#C9524B]")}>
                {isOnline ? "آنلاین" : "آفلاین"}
              </span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">{statusText}</span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-[18px] border px-3 py-2 text-center shadow-[0_10px_22px_rgba(31,37,37,0.05)]",
            highlightClock || status === "active"
              ? "border-[#9FD59D] bg-[#F4FFF2] text-[#2F8A4E]"
              : "border-[#E6EAE3] bg-[#FCFCFB] text-[#1F2525]",
          )}
        >
          <p className="text-[11px] leading-none text-[#6E7772]">زمان</p>
          <p className="mt-1 text-2xl font-black tracking-tight">
            {clockValue}
          </p>
        </div>
      </div>
    </section>
  );
}
