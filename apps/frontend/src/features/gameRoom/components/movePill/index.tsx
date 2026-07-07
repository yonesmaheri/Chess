import { cn } from "@/shared/lib/utils";

type MovePillProps = {
  active: boolean;
  label: string | null;
};

export default function MovePill({ active, label }: MovePillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-sm",
        active
          ? "bg-[#E8F2E7] font-bold text-[#35553D]"
          : "bg-[#F3F5F1] text-[#5D675E]",
      )}
    >
      {label ?? "-"}
    </span>
  );
}
