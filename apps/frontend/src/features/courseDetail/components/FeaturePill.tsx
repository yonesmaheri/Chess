import type { FeatureHighlightItem } from "../lib/types";

type FeaturePillProps = FeatureHighlightItem;

export function FeaturePill({ title, icon: Icon }: FeaturePillProps) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5FAF7] text-[#2F7D62]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-[#1F2525] sm:text-base">
        {title}
      </p>
    </div>
  );
}
