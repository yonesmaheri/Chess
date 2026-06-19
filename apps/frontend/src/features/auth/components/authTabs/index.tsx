"use client";

import { cn } from "@/shared/lib/utils";

type AuthTabsProps = {
  value: "register" | "login";
  onValueChange: (value: "register" | "login") => void;
};

const authTabs = [
  {
    value: "login",
    label: "ورود",
  },
  {
    value: "register",
    label: "ثبت نام",
  },
];

export default function AuthTabs({ value, onValueChange }: AuthTabsProps) {
  return (
    <div className="grid h-[60px] grid-cols-2 border-b border-[var(--landing-border)]">
      {authTabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onValueChange(tab.value as "register" | "login")}
          className={cn(
            "relative flex items-center justify-center text-lg font-semibold transition-colors",
            value === tab.value
              ? "text-[var(--landing-text)]"
              : "text-[var(--landing-muted)] hover:text-[var(--landing-text)]",
          )}
        >
          {tab.label}
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 mx-auto h-[3px] w-full rounded-full bg-[var(--landing-text)] transition-opacity",
              value === tab.value ? "opacity-100" : "opacity-0",
            )}
          />
        </button>
      ))}
    </div>
  );
}
