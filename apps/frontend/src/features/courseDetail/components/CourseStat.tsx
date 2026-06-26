import type { CourseStatItem } from "../lib/types";
import { cn } from "@/shared/lib/utils";

type CourseStatProps = CourseStatItem;

export function CourseStat({
  title,
  value,
  subtext,
  icon: Icon,
  iconClassName,
}: CourseStatProps) {
  return (
    <div className="rounded-[20px] border border-[#E8E8E3] bg-white p-4 shadow-[0_18px_40px_rgba(31,37,37,0.04)] transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#7A7F7C]">
        <Icon className={cn("h-4 w-4", iconClassName)} />
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-[#1F2525]">{value}</p>
        {subtext ? <p className="text-sm text-[#7A7F7C]">{subtext}</p> : null}
      </div>
    </div>
  );
}
