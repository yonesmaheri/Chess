import { Search, SlidersHorizontal } from "lucide-react";
import type { CourseLevel, CourseSortOption } from "@/shared/api/services/courses";
import { categoryOptions, levelOptions, sortOptions } from "../../lib/constants";
import FilterSelect from "../filterSelect";

type CoursesFiltersProps = {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  sort: CourseSortOption;
  onSortChange: (value: CourseSortOption) => void;
  level: CourseLevel | "";
  onLevelChange: (value: CourseLevel | "") => void;
  category: (typeof categoryOptions)[number]["value"] | "";
  onCategoryChange: (
    value: (typeof categoryOptions)[number]["value"] | "",
  ) => void;
  onClearFilters: () => void;
};

export default function CoursesFilters({
  searchInput,
  onSearchInputChange,
  sort,
  onSortChange,
  level,
  onLevelChange,
  category,
  onCategoryChange,
  onClearFilters,
}: CoursesFiltersProps) {
  return (
    <section className="rounded-[22px] border border-[#E8E8E3] bg-white p-4 shadow-[0_18px_46px_rgba(31,37,37,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-[330px]">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7F7C]" />
          <input
            type="search"
            placeholder="جستجوی دوره‌ها..."
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            className="h-[46px] w-full rounded-[10px] border border-[#E6E6E0] bg-white pr-11 pl-4 text-sm text-[#1F2525] outline-none transition-colors duration-300 placeholder:text-[#9AA09B] focus:border-[#6F9278]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            value={sort}
            onChange={(value) => onSortChange((value as CourseSortOption) || "newest")}
            placeholder="مرتب سازی"
            options={sortOptions}
          />
          <FilterSelect
            value={level}
            onChange={(value) => onLevelChange(value as CourseLevel | "")}
            placeholder="سطح"
            options={levelOptions}
          />
          <FilterSelect
            value={category}
            onChange={(value) =>
              onCategoryChange(
                value as (typeof categoryOptions)[number]["value"] | "",
              )
            }
            placeholder="موضوع"
            options={categoryOptions}
          />

          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-[46px] items-center gap-2 rounded-[10px] border border-[#E6E6E0] bg-white px-4 text-sm font-medium text-[#547C5F] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8D5CC] hover:bg-[#F8FBF8]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>پاک کردن فیلترها</span>
          </button>
        </div>
      </div>
    </section>
  );
}
