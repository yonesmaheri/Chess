import type { CourseListItem } from "@/shared/api/services/courses";
import { cn } from "@/shared/lib/utils";
import { toPersianLevel } from "../../lib/utils";

type CourseArtworkProps = {
  course: CourseListItem;
};

export default function CourseArtwork({ course }: CourseArtworkProps) {
  const pieceClassName =
    course.level === "intermediate"
      ? "text-[72px]"
      : course.level === "advanced"
        ? "text-[74px]"
        : "text-[78px]";

  const pieceSymbol =
    course.level === "intermediate"
      ? "♞"
      : course.level === "advanced"
        ? "♝"
        : "♟";

  return (
    <div className="relative h-[180px] overflow-hidden border-b border-[#E8E8E3]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${course.thumbnailImage})`,
        }}
      />
      <div className="absolute inset-0 bg-[rgba(18,24,22,0.62)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(84,124,95,0.30),transparent_42%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,#FFFFFF_1px,transparent_1.2px)] [background-size:18px_18px]" />

      <div className="absolute -right-10 top-5 h-28 w-28 rounded-full bg-[#D8E0DA]/40 blur-3xl" />
      <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-[#547C5F]/40 blur-3xl" />

      <div className="absolute inset-x-6 bottom-5 rotate-[-8deg] overflow-hidden rounded-[18px] border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.28)]">
        <div className="grid grid-cols-8">
          {Array.from({ length: 32 }, (_, index) => {
            const row = Math.floor(index / 8);
            const column = index % 8;
            const isDark = (row + column) % 2 === 0;

            return (
              <div
                key={`${course.slug}-${index}`}
                className={cn(
                  "aspect-square",
                  isDark ? "bg-[#CED5D1]" : "bg-[#32403C]",
                )}
              />
            );
          })}
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
        aria-hidden="true"
      >
        <span
          className={cn(
            "leading-none text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
            pieceClassName,
          )}
        >
          {pieceSymbol}
        </span>
        <span className="mt-[-8px] h-3 w-16 rounded-full bg-black/35 blur-md" />
      </div>

      <div className="absolute left-4 top-4 rounded-full border border-[#DCE8E2] bg-[#F3F6F1] px-3 py-1 text-xs font-semibold text-[#547C5F] shadow-sm">
        {toPersianLevel(course.level)}
      </div>
    </div>
  );
}
