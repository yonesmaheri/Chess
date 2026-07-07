import type { ComponentType } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type SidebarActionButtonProps = {
  danger?: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
};

export default function SidebarActionButton({
  danger = false,
  icon: Icon,
  label,
  onClick,
}: SidebarActionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-12 rounded-[16px] border px-3",
        danger
          ? "border-[#F0D0CF] bg-[#FFF7F7] text-[#B24B46] hover:bg-[#FFF1F1]"
          : "border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]",
      )}
      onClick={onClick}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}
