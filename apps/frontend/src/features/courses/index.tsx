"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  coursesService,
  type CourseLevel,
  type CourseListItem,
  type CourseSortOption,
} from "@/shared/api/services/courses";
import { categoryOptions } from "./lib/constants";
import { formatPersianNumber } from "./lib/utils";
import CourseCard from "./components/courseCard";
import CoursesFilters from "./components/coursesFilters";
import CoursesHero from "./components/coursesHero";
import CoursesPagination from "./components/coursesPagination";

export function CoursesPageFeature() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<CourseLevel | "">("");
  const [category, setCategory] = useState<
    (typeof categoryOptions)[number]["value"] | ""
  >("");
  const [sort, setSort] = useState<CourseSortOption>("newest");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", { page, search, level, category, sort }],
    queryFn: () =>
      coursesService.list({
        page,
        limit: 6,
        search: search || undefined,
        level: level || undefined,
        category: category || undefined,
        sort,
      }),
    placeholderData: (previousData) => previousData,
  });

  const courses: CourseListItem[] = data?.courses ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setLevel("");
    setCategory("");
    setSort("newest");
    setPage(1);
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
            setSort(value);
            setPage(1);
          }}
          level={level}
          onLevelChange={(value) => {
            setLevel(value);
            setPage(1);
          }}
          category={category}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
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
              دریافت فهرست دوره‌ها با مشکل روبه‌رو شد.
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
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}
