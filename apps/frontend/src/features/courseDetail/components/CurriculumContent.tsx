import { ChevronDown, Video } from "lucide-react";

import type { CourseDetail } from "@/shared/api/services/courses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { cn } from "@/shared/lib/utils";
import { formatPersianNumber } from "../../courses/lib/utils";
import { CourseSidebar } from "./CourseSidebar";

type CurriculumContentProps = {
  course: CourseDetail;
  expandedChapters: string[];
  allChaptersExpanded: boolean;
  onToggleChapter: (chapterIds: string[]) => void;
  onToggleAllChapters: () => void;
};

export function CurriculumContent({
  course,
  expandedChapters,
  allChaptersExpanded,
  onToggleChapter,
  onToggleAllChapters,
}: CurriculumContentProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-[18px] border border-[#E8E8E3] bg-[#FCFDFC] p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-[#1F2525]">
            مجموع {formatPersianNumber(course.totalLessons)} درس در{" "}
            {formatPersianNumber(course.curriculum.length)} فصل
          </h2>

          <button
            type="button"
            onClick={onToggleAllChapters}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F7D62] transition-colors duration-300 hover:text-[#276A53]"
          >
            {allChaptersExpanded
              ? "همه فصل‌ها را ببندید"
              : "همه فصل‌ها را باز کنید"}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                allChaptersExpanded && "rotate-180",
              )}
            />
          </button>
        </div>

        {course.curriculum.length ? (
          <Accordion
            type="multiple"
            value={expandedChapters}
            onValueChange={onToggleChapter}
            className="space-y-4"
          >
            {course.curriculum.map((chapter) => {
              return (
                <AccordionItem
                  key={chapter.id}
                  value={chapter.id}
                  className="overflow-hidden rounded-[14px] border border-[#E8E8E3] bg-white shadow-[0_14px_30px_rgba(31,37,37,0.03)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <AccordionTrigger className="min-h-[55px] flex w-full items-center px-5 py-4 text-right hover:no-underline focus-visible:ring-0 [&>[data-slot=accordion-trigger-icon]]:ml-0 [&>[data-slot=accordion-trigger-icon]]:mr-auto [&>[data-slot=accordion-trigger-icon]]:h-5 [&>[data-slot=accordion-trigger-icon]]:w-5 [&>[data-slot=accordion-trigger-icon]]:text-[#7A7F7C] data-[state=open]:[&>[data-slot=accordion-trigger-icon]]:text-[#2F7D62]">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-[#1F2525]">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-[#7A7F7C]">
                        {formatPersianNumber(chapter.lessons.length)} درس
                      </p>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-t border-[#E8E8E3] bg-[#FCFDFC] px-5 pb-0">
                    {chapter.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          "flex min-h-[45px] items-center justify-between gap-4 py-3",
                          index !== chapter.lessons.length - 1 &&
                            "border-b border-[#E8E8E3]",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Video className="h-4 w-4 text-[#2F7D62]" />
                          <span className="text-sm font-medium text-[#7A7F7C]">
                            {formatPersianNumber(lesson.order)}
                          </span>
                          <p className="text-sm text-[#1F2525] sm:text-base">
                            {lesson.title}
                          </p>
                          {lesson.isPreview ? (
                            <span className="rounded-full bg-[#E8F4EE] px-2 py-1 text-xs font-semibold text-[#2F7D62]">
                              پیش‌نمایش
                            </span>
                          ) : null}
                        </div>

                        <span className="text-sm font-medium text-[#7A7F7C]">
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="rounded-[18px] border border-[#E8E8E3] bg-[#FCFDFC] px-5 py-10 text-center text-sm text-[#7A7F7C]">
            هنوز سرفصل‌های این دوره منتشر نشده‌اند.
          </div>
        )}
      </div>

      <CourseSidebar course={course} />
    </div>
  );
}
