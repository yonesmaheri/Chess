import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { GameRoomPlayerStatus } from "../../types";

type PlayerPanelProps = {
  clockValue: string;
  compact?: boolean;
  isOnline: boolean;
  isOpponent: boolean;
  name: string;
  rating: string;
  status: GameRoomPlayerStatus;
};

export default function PlayerPanel({
  clockValue,
  compact = false,
  isOnline,
  name,
  rating,
  status,
}: PlayerPanelProps) {
  const statusText =
    status === "winner"
      ? "برنده"
      : status === "loser"
        ? "بازنده"
        : status === "active"
          ? "نوبت حرکت"
          : "در انتظار";

  return (
    <section
      className={cn(
        "rounded-[28px] border border-[#E5EAE2] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]",
        compact ? "px-4 py-3" : "px-5 py-4",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={cn("min-w-0", compact && "order-2")}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-lg font-black text-[#1F2525]">{name}</p>
            <span
              className={cn(
                "inline-flex size-2.5 rounded-full",
                isOnline ? "bg-[#3EAE5B]" : "bg-[#D46861]",
              )}
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#6E7772]">
            <span>{rating}</span>
            <span>امتیاز</span>
            <Badge
              className={cn(
                "h-7 px-3 text-xs",
                status === "winner"
                  ? "bg-[#E8F4EB] text-[#2F8A4E]"
                  : status === "loser"
                    ? "bg-[#FDECEC] text-[#C9524B]"
                    : status === "active"
                      ? "bg-[#FFF4E5] text-[#B46D1D]"
                      : "bg-[#F0F4ED] text-[#6E7772]",
              )}
            >
              {statusText}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-[20px] border px-4 py-3 text-center shadow-[0_12px_24px_rgba(31,37,37,0.05)]",
              status === "active"
                ? "border-[#9FD59D] bg-[#F2FFF1] text-[#2F8A4E]"
                : "border-[#E6EAE3] bg-[#FCFCFB] text-[#1F2525]",
            )}
          >
            <p className="text-[11px] text-[#6E7772]">ساعت</p>
            <p className="mt-1 text-2xl font-black tracking-tight">
              {clockValue}
            </p>
          </div>
          <Avatar className="size-16" size="lg">
            <AvatarFallback className="bg-[#EDF3EB] text-base font-bold text-[#5B7A62]">
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </section>
  );
}
