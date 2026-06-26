"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type CourseLevel,
  type CourseListItem,
  type CourseSortOption,
  type ListCoursesResponse,
} from "@/shared/api/services/courses";
import { categoryOptions } from "./lib/constants";
import { formatPersianNumber } from "./lib/utils";
import CourseCard from "./components/courseCard";
import CoursesFilters from "./components/coursesFilters";
import CoursesHero from "./components/coursesHero";
import CoursesPagination from "./components/coursesPagination";

type CoursesPageFeatureProps = {
  initialFilters: {
    page: number;
    search: string;
    level: CourseLevel | "";
    category: (typeof categoryOptions)[number]["value"] | "";
    sort: CourseSortOption;
  };
  initialData: ListCoursesResponse | null;
  initialErrorMessage?: string | null;
};

export function CoursesPageFeature({
  initialFilters,
  initialData,
  initialErrorMessage,
}: CoursesPageFeatureProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(initialFilters.search);

  useEffect(() => {
    setSearchInput(initialFilters.search);
  }, [initialFilters.search]);

  const updateQuery = (
    updates: Partial<
      Record<"page" | "search" | "level" | "category" | "sort", string>
    >,
  ) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        nextSearchParams.delete(key);
        return;
      }

      if (key === "page" && value === "1") {
        nextSearchParams.delete(key);
        return;
      }

      if (key === "sort" && value === "newest") {
        nextSearchParams.delete(key);
        return;
      }

      nextSearchParams.set(key, value);
    });

    const query = nextSearchParams.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = searchInput.trim();

      if (nextSearch === initialFilters.search) {
        return;
      }

      updateQuery({
        search: nextSearch,
        page: "1",
      });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [initialFilters.search, searchInput, searchParams]);

  const page = initialData?.currentPage ?? initialFilters.page;
  const level = initialFilters.level;
  const category = initialFilters.category;
  const sort = initialFilters.sort;
  const courses: CourseListItem[] = initialData?.courses ?? [];
  const totalItems = initialData?.totalItems ?? 0;
  const totalPages = initialData?.totalPages ?? 1;
  const isError = Boolean(initialErrorMessage);
  const isLoading = isPending;

  const clearFilters = () => {
    setSearchInput("");
    updateQuery({
      page: "",
      search: "",
      level: "",
      category: "",
      sort: "",
    });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 py-8 sm:px-6 lg:gap-10 lg:px-8 lg:py-12">
        <CoursesHero />

        <CoursesFilters
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          sort={sort}
          onSortChange={(value) => {
            updateQuery({
              sort: value,
              page: "1",
            });
          }}
          level={level}
          onLevelChange={(value) => {
            updateQuery({
              level: value,
              page: "1",
            });
          }}
          category={category}
          onCategoryChange={(value) => {
            updateQuery({
              category: value,
              page: "1",
            });
          }}
          onClearFilters={clearFilters}
        />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 text-sm text-[#7A7F7C]">
            <p>{formatPersianNumber(totalItems)} دوره یافت شد</p>
            <p>
              صفحه {formatPersianNumber(page)} از{" "}
              {formatPersianNumber(totalPages)}
            </p>
          </div>
          {isError ? (
            <div className="rounded-[18px] border border-[#F0D7D7] bg-[#FFF8F8] px-5 py-4 text-sm text-[#9B4B4B]">
              {initialErrorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="text-sm text-[#7A7F7C]">
              در حال به‌روزرسانی نتایج...
            </div>
          ) : null}

          {isLoading && !courses.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[14px] border border-[#E8E8E3] bg-white shadow-[0_18px_42px_rgba(31,37,37,0.045)]"
                >
                  <div className="h-[180px] animate-pulse bg-[#F4F6F3]" />
                  <div className="space-y-4 p-5">
                    <div className="h-6 animate-pulse rounded bg-[#F4F6F3]" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#F4F6F3]" />
                    <div className="h-10 animate-pulse rounded bg-[#F4F6F3]" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !courses.length ? (
            <div className="rounded-[18px] border border-[#E8E8E3] bg-[#FCFDFC] px-5 py-10 text-center text-sm text-[#7A7F7C]">
              دوره‌ای با این فیلترها پیدا نشد.
            </div>
          ) : null}

          {!isLoading && courses.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : null}
        </section>

        <CoursesPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) =>
            updateQuery({
              page: String(nextPage),
            })
          }
        />
      </div>
    </main>
  );
}
