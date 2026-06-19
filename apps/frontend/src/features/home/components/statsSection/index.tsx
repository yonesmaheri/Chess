import { cn } from "@/shared/lib/utils";
import { BookOpen, LucideIcon, Target, Trophy, Users } from "lucide-react";
import { containerClassName } from "../../constants";

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

const stats: Stat[] = [
  { icon: Users, value: "+150K", label: "کاربر فعال" },
  { icon: BookOpen, value: "+10K", label: "درس و محتوای آموزشی" },
  { icon: Target, value: "+500", label: "تمرین و پازل روزانه" },
  { icon: Trophy, value: "+100K", label: "بازی انجام شده" },
];

export default function StatsSection() {
  return (
    <section id="stats" className="pb-6 sm:pb-8 lg:pb-10">
      <div className={containerClassName}>
        <div className="grid rounded-[20px] border border-[var(--landing-border)] bg-white p-4 shadow-[0_12px_32px_rgba(36,38,43,0.04)] sm:grid-cols-2 sm:gap-2 sm:p-5 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-4",
                  index !== stats.length - 1 &&
                    "border-b border-[var(--landing-border)] sm:border-b-0 lg:border-l",
                  index === 1 &&
                    "sm:border-b border-[var(--landing-border)] lg:border-b-0",
                  index === 0 && "sm:border-l lg:border-l",
                  index === 2 && "lg:border-l",
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--landing-soft)] text-[var(--landing-primary)]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--landing-text)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--landing-muted)]">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
