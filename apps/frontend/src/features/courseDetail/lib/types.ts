import type { LucideIcon } from "lucide-react";

export type TabKey = "overview" | "curriculum" | "instructor";

export type CourseStatItem = {
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  iconClassName?: string;
};

export type FeatureHighlightItem = {
  title: string;
  icon: LucideIcon;
};
