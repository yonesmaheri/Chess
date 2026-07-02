import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { LEADERBOARD_MODES, LEADERBOARD_MODE_ORDER } from "../lib/constants";
import type { LeaderboardMode } from "../types";

type LeaderboardModeSwitcherProps = {
  mode: LeaderboardMode;
  onModeChange: (mode: LeaderboardMode) => void;
};

export default function LeaderboardModeSwitcher({
  mode,
  onModeChange,
}: LeaderboardModeSwitcherProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {LEADERBOARD_MODE_ORDER.map((modeKey) => {
        const modeConfig = LEADERBOARD_MODES[modeKey];
        const Icon = modeConfig.icon;
        const isActive = modeKey === mode;

        return (
          <Button
            key={modeKey}
            type="button"
            variant={isActive ? "default" : "outline"}
            onClick={() => onModeChange(modeKey)}
            className={cn(
              "h-auto rounded-[20px] border px-5 py-5",
              isActive
                ? modeConfig.accentClassName
                : "border-[#E8E8E3] bg-white text-[#1F2525] shadow-[0_14px_34px_rgba(31,37,37,0.035)] hover:bg-[#F8FAF8]",
            )}
          >
            <span className="flex w-full items-center justify-between gap-4">
              <span className="flex flex-col items-start text-right">
                <span className="text-lg font-bold">{modeConfig.label}</span>
                <span
                  className={cn(
                    "text-sm",
                    isActive ? "text-white/80" : "text-[#7A7F7C]",
                  )}
                >
                  {modeConfig.subtitle}
                </span>
              </span>
              <Icon className="size-6 shrink-0" />
            </span>
          </Button>
        );
      })}
    </section>
  );
}
