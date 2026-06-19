import * as React from "react";

import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

type AuthInputProps = React.ComponentProps<typeof Input> & {
  icon?: React.ReactNode;
};

const CustomInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, dir, icon, type = "text", ...props }, ref) => {
    const resolvedDir =
      dir ??
      (type === "email" || type === "password" || type === "tel"
        ? "ltr"
        : "rtl");

    return (
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--landing-muted)]">
            {icon}
          </span>
        ) : null}
        <Input
          ref={ref}
          type={type}
          dir={resolvedDir}
          className={cn(
            "h-12 rounded-[10px] border-[color:var(--landing-border)] bg-transparent pl-3.5 text-sm text-[var(--landing-text)] shadow-none placeholder:text-[color:rgba(119,119,119,0.7)] focus-visible:border-[color:var(--landing-text)] focus-visible:ring-[rgba(36,38,43,0.08)]",
            icon ? "pr-11" : "pr-3.5",
            resolvedDir === "ltr" && "text-left",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
