import { Crown, Globe2, Target } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export default function HeroIllustration() {
  return (
    <div className="relative isolate mx-auto flex w-full max-w-[560px] items-center justify-center">
      <div className="absolute left-10 top-8 size-40 rounded-full bg-[rgba(128,151,131,0.28)] blur-3xl" />
      <div className="absolute right-8 bottom-10 size-32 rounded-full bg-[rgba(198,154,66,0.22)] blur-3xl" />
      <div className="absolute top-12 right-6 h-24 w-24 rounded-full border border-[rgba(198,154,66,0.25)]" />

      <div className="relative w-full rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,248,245,0.88))] p-6 shadow-[0_30px_80px_rgba(36,38,43,0.08)] sm:p-8">
        <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(255,255,255,0.15)_60%,transparent_100%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid grid-cols-4 gap-2 rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/75 p-3">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-lg",
                  index % 2 === Math.floor(index / 4) % 2
                    ? "bg-[rgba(72,101,84,0.11)]"
                    : "bg-white",
                )}
              />
            ))}
          </div>
          <div className="flex flex-col justify-between gap-4">
            <div className="rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/85 p-5">
              <div className="mb-3 flex items-center justify-between text-[var(--landing-muted)]">
                <span className="text-xs font-semibold">پیشرفت این هفته</span>
                <span className="text-xs">+18%</span>
              </div>
              <div className="h-3 rounded-full bg-[var(--landing-soft)]">
                <div className="h-3 w-[72%] rounded-full bg-[linear-gradient(90deg,#486554,#c69a42)]" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/85 p-5 text-center">
                <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-[var(--landing-soft)] text-[var(--landing-primary)]">
                  <Crown className="size-7" />
                </span>
                <p className="text-sm font-bold text-[var(--landing-text)]">
                  درس های حرفه ای
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/85 p-5 text-center">
                <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-[rgba(198,154,66,0.12)] text-[var(--landing-accent)]">
                  <Globe2 className="size-7" />
                </span>
                <p className="text-sm font-bold text-[var(--landing-text)]">
                  بازی زنده
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex items-end justify-between gap-4 rounded-[28px] border border-[rgba(230,230,230,0.9)] bg-white/90 p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--landing-accent)]">
              تحلیل هوشمند
            </p>
            <h3 className="text-lg font-bold text-[var(--landing-text)]">
              مسیر یادگیری متناسب با سطح شما
            </h3>
            <p className="max-w-xs text-sm leading-7 text-[var(--landing-muted)]">
              تمرین، بازی و بازخوردها کنار هم قرار می گیرند تا پیشرفت شما پیوسته
              و قابل اندازه گیری باشد.
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl bg-[var(--landing-soft)] px-4 py-3 sm:flex">
            <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--landing-primary)] text-white">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-[var(--landing-text)]">
                93%
              </p>
              <p className="text-xs text-[var(--landing-muted)]">
                دقت در تمرین ها
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
