import type { ReactNode } from "react";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type AuthInputProps = {
  id: string;
  label: string;
  placeholder: string;
  icon: ReactNode;
  type?: string;
};

export default function CustomInput({
  id,
  label,
  placeholder,
  icon,
  type = "text",
}: AuthInputProps) {
  return (
    <div className="space-y-1">
      <Label
        htmlFor={id}
        className="text-[13px] font-medium text-[var(--landing-text)]"
      >
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--landing-muted)]">
          {icon}
        </span>
        <Input
          id={id}
          type={type}
          dir={type === "email" ? "ltr" : "rtl"}
          placeholder={placeholder}
          className={cn(
            "h-12 rounded-[10px] border-[color:var(--landing-border)] bg-transparent pr-11 pl-3.5 text-sm text-[var(--landing-text)] shadow-none placeholder:text-[color:rgba(119,119,119,0.7)] focus-visible:border-[color:var(--landing-text)] focus-visible:ring-[rgba(36,38,43,0.08)]",
            type === "email" && "text-left",
          )}
        />
      </div>
    </div>
  );
}
