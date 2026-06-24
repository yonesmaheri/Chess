import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type DashboardPageHeaderProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  leadingElement?: ReactNode;
  className?: string;
  contentClassName?: string;
  actionsClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function DashboardPageHeader({
  title,
  subtitle,
  actions,
  leadingElement,
  className,
  contentClassName,
  actionsClassName,
  titleClassName,
  subtitleClassName,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 rounded-[32px] border border-[#edf0ea] bg-white p-6 shadow-[0_20px_80px_-58px_rgba(36,38,43,0.45)] sm:p-8 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
    >
      <div className={cn("flex items-start gap-4", contentClassName)}>
        {leadingElement ?? (
          <div className="mt-1 h-16 w-1.5 shrink-0 rounded-full bg-[#7f9f85]" />
        )}

        <div>
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight text-[#252a2e] sm:text-4xl",
              titleClassName,
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "mt-3 max-w-2xl text-sm leading-7 text-[#9aa0a6] sm:text-[15px]",
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {actions ? (
        <div
          className={cn(
            "flex items-center gap-3 self-start lg:self-center",
            actionsClassName,
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
