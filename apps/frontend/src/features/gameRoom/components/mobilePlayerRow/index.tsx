import { cn } from "@/shared/lib/utils";

type MobilePlayerRowProps = {
  clockValue: string;
  name: string;
  turnLabel?: string;
  isActiveTurn?: boolean;
};

export default function MobilePlayerRow({
  clockValue,
  name,
  turnLabel,
  isActiveTurn = false,
}: MobilePlayerRowProps) {
  return (
    <section className="rounded-[18px] border border-[#E5EAE2] bg-white px-3 py-2 shadow-[0_14px_32px_rgba(31,37,37,0.035)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-black text-[#1F2525]">
            {name}
          </p>
          {turnLabel ? (
            <p
              className={cn(
                "mt-0.5 text-xs font-bold",
                isActiveTurn ? "text-[#2F8A4E]" : "text-[#6E7772]",
              )}
            >
              {turnLabel}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "shrink-0 rounded-[16px] border px-3 py-1.5 text-center shadow-[0_10px_22px_rgba(31,37,37,0.05)]",
            isActiveTurn
              ? "border-[#9FD59D] bg-[#F4FFF2] text-[#2F8A4E]"
              : "border-[#E6EAE3] bg-[#FCFCFB] text-[#1F2525]",
          )}
        >
          <p className="text-[10px] leading-none text-[#6E7772]">زمان</p>
          <p className="mt-1 text-xl font-black tracking-tight">{clockValue}</p>
        </div>
      </div>
    </section>
  );
}
