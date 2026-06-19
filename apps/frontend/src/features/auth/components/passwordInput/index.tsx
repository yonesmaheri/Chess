"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type PasswordInputProps = {
  id: string;
  label: string;
  placeholder: string;
};

export default function PasswordInput({
  id,
  label,
  placeholder,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

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
          <Lock className="size-[22px]" />
        </span>
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-text)]"
          aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
        >
          {visible ? (
            <EyeOff className="size-[22px]" />
          ) : (
            <Eye className="size-[22px]" />
          )}
        </button>
        <Input
          id={id}
          type={visible ? "text" : "password"}
          dir="ltr"
          placeholder={placeholder}
          className={cn(
            "h-12 rounded-[10px] border-[var(--landing-border)] bg-transparent pr-11 pl-11 text-left text-sm text-[var(--landing-text)] shadow-none placeholder:text-[color:rgba(119,119,119,0.7)] focus-visible:border-[var(--landing-text)] focus-visible:ring-[rgba(36,38,43,0.08)]",
          )}
        />
      </div>
    </div>
  );
}
