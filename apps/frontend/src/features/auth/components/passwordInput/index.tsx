"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, dir = "ltr", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
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
          ref={ref}
          type={visible ? "text" : "password"}
          dir={dir}
          className={cn(
            "h-12 rounded-[10px] border-[color:var(--landing-border)] bg-transparent pr-11 pl-11 text-left text-sm text-[var(--landing-text)] shadow-none placeholder:text-[color:rgba(119,119,119,0.7)] focus-visible:border-[color:var(--landing-text)] focus-visible:ring-[rgba(36,38,43,0.08)]",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
