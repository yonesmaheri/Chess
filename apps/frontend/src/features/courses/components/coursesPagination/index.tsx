import { cn } from "@/shared/lib/utils";
import { formatPersianNumber } from "../../lib/utils";

type CoursesPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CoursesPagination({
  page,
  totalPages,
  onPageChange,
}: CoursesPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="flex flex-wrap items-center justify-center gap-2 pt-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-10 items-center rounded-[10px] border border-[#E8E8E3] bg-white px-4 text-sm font-medium text-[#1F2525] transition-colors duration-300 hover:bg-[#F8FAF8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        قبلی
      </button>

      {pages.map((pageItem) => {
        const isActive = pageItem === page;

        return (
          <button
            key={pageItem}
            type="button"
            onClick={() => onPageChange(pageItem)}
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] border text-sm font-medium transition-all duration-300",
              isActive
                ? "border-[#547C5F] bg-[#547C5F] text-white"
                : "border-[#E8E8E3] bg-white text-[#1F2525] hover:bg-[#F8FAF8]",
            )}
          >
            {formatPersianNumber(pageItem)}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex h-10 items-center rounded-[10px] border border-[#E8E8E3] bg-white px-4 text-sm font-medium text-[#1F2525] transition-colors duration-300 hover:bg-[#F8FAF8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        بعدی
      </button>
    </section>
  );
}
