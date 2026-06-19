import { Crown } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        centered && "mx-auto max-w-2xl items-center text-center",
      )}
    >
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--landing-border)] bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--landing-accent)] shadow-[0_12px_30px_rgba(36,38,43,0.04)] backdrop-blur-sm">
          <Crown className="size-4" />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <div
        className={cn(
          "space-y-4",
          centered && "flex flex-col items-center justify-center",
        )}
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--landing-text)] sm:text-4xl">
          {title}
        </h2>
        <span className="block h-1 w-14 rounded-full bg-[var(--landing-accent)]" />
        {description ? (
          <p className="max-w-2xl text-sm leading-8 text-[var(--landing-muted)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
