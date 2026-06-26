import Link from "next/link";
import { Play } from "lucide-react";

import type {
  CourseCurriculumLesson,
  CourseDetail,
} from "@/shared/api/services/courses";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "../lib/utils";
import { CourseStat } from "./CourseStat";

type CourseHeroProps = {
  course: CourseDetail;
  heroStats: React.ComponentProps<typeof CourseStat>[];
  previewLesson: CourseCurriculumLesson | null;
};

export function CourseHero({
  course,
  heroStats,
  previewLesson,
}: CourseHeroProps) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
      <div className="space-y-7">
        <div className="inline-flex rounded-full border border-[#DCE8E2] bg-[#F5FAF7] px-4 py-2 text-sm font-medium text-[#2F7D62]">
          {course.category.name}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1F2525] sm:text-5xl">
            {course.title}
          </h1>
          <p className="max-w-[44rem] text-base leading-8 text-[#7A7F7C] sm:text-lg">
            {course.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((item) => (
            <CourseStat key={item.title} {...item} />
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-16 flex-1 rounded-[12px] bg-[#2F7D62] text-base font-bold text-white shadow-[0_20px_40px_rgba(47,125,98,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#276A53]"
          >
            <Link href={`/courses/${course.slug}#curriculum`}>
              مشاهده سرفصل‌های دوره
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-16 rounded-[12px] border-[#E8E8E3] bg-white px-6 text-sm font-semibold text-[#1F2525] shadow-[0_14px_28px_rgba(31,37,37,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F9FBFA]"
          >
            <a href={course.previewVideoUrl} target="_blank" rel="noreferrer">
              پیش‌نمایش دوره
            </a>
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-[#E8E8E3] bg-[#171C1B] p-6 shadow-[0_30px_80px_rgba(23,28,27,0.16)]">
        <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          پیش‌نمایش دوره
        </div>

        <div className="relative flex h-[330px] overflow-hidden rounded-[20px] border border-white/8 bg-[#171C1B]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${course.thumbnailImage})` }}
          />
          <div className="absolute inset-0 bg-[rgba(18,24,22,0.55)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_34%),linear-gradient(180deg,rgba(12,18,16,0.08)_0%,rgba(12,18,16,0.75)_100%)]" />

          <div className="relative z-10 mt-auto w-full rounded-[18px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/70">درس پیشنهادی برای شروع</p>
                <p className="mt-2 text-lg font-semibold">
                  {previewLesson?.title || "پیش‌نمایش دوره"}
                </p>
              </div>

              <Button
                asChild
                size="icon-lg"
                className="h-14 w-14 rounded-full bg-[#2F7D62] text-white hover:bg-[#276A53]"
              >
                <a
                  href={previewLesson?.videoUrl || course.previewVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="پخش پیش‌نمایش"
                >
                  <Play className="h-5 w-5 fill-current" />
                </a>
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-white/80">
              <span>{previewLesson?.duration || course.duration} زمان مشاهده</span>
              <span>{formatCurrency(course.price)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
