import { Swords, Trophy } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { LeaderboardModeConfig } from "../types";

type LeaderboardHeaderProps = {
  config: LeaderboardModeConfig;
};

export default function LeaderboardHeader({
  config,
}: LeaderboardHeaderProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#E8E8E3] bg-white px-6 py-7 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
              config.chipClassName,
            )}
          >
            <Trophy className="size-4" />
            جدول رده‌بندی
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-[#1F2525] sm:text-4xl">
              بهترین بازیکنان شطرنج.ir
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#6C726E] sm:text-base">
              رتبه‌بندی بازیکنان برتر را در بخش‌های مختلف دنبال کنید، تغییرات
              ELO را ببینید و جایگاه خودتان را با رقبا مقایسه کنید.
            </p>
          </div>
        </div>
        <div className="rounded-[20px] border border-[#E8E8E3] bg-[#F8FAF8] px-5 py-4 text-sm text-[#6C726E]">
          <div className="flex items-center gap-2 font-semibold text-[#1F2525]">
            <Swords className="size-4 text-[#486554]" />
            {config.description}
          </div>
        </div>
      </div>
    </section>
  );
}
