import Link from "next/link";

import type { CourseDetail } from "@/shared/api/services/courses";
import { Button } from "@/shared/components/ui/button";
import {
  formatPersianNumber,
  formatStudentCount,
  getInitials,
  toPersianLevel,
} from "../../courses/lib/utils";
import {
  countPreviewLessons,
  formatCurrency,
  formatReviewDate,
} from "../lib/utils";
import { SidebarCard } from "./SidebarCard";

type CourseSidebarProps = {
  course: CourseDetail;
};

export function CourseSidebar({ course }: CourseSidebarProps) {
  const instructorInitials = getInitials(course.instructor.name) || "؟";
  const previewLessonsCount = countPreviewLessons(course);

  return (
    <div className="space-y-5">
      <SidebarCard title="ثبت‌نام در دوره">
        <div className="space-y-4">
          <div className="rounded-[16px] bg-[#F5FAF7] px-4 py-5">
            <p className="text-sm text-[#7A7F7C]">هزینه دوره</p>
            <p className="mt-2 text-2xl font-bold text-[#1F2525]">
              {formatCurrency(course.price)}
            </p>
          </div>

          <Button
            asChild
            className="h-11 w-full rounded-[10px] bg-[#2F7D62] text-sm font-semibold text-white hover:bg-[#276A53]"
          >
            <Link href={`/courses/${course.slug}#curriculum`}>
              مشاهده سرفصل‌ها
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-[10px] border-[#2F7D62] text-sm font-semibold text-[#2F7D62] hover:bg-[#F5FAF7] hover:text-[#276A53]"
          >
            <a href={course.previewVideoUrl} target="_blank" rel="noreferrer">
              مشاهده پیش‌نمایش
            </a>
          </Button>
        </div>
      </SidebarCard>

      <SidebarCard title="جزئیات دوره">
        <div className="space-y-3 text-sm text-[#4D5451]">
          <div className="flex items-center justify-between gap-4">
            <span>دسته‌بندی</span>
            <span className="font-semibold text-[#1F2525]">
              {course.category.name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>سطح</span>
            <span className="font-semibold text-[#1F2525]">
              {toPersianLevel(course.level)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>تعداد دانشجو</span>
            <span className="font-semibold text-[#1F2525]">
              {formatStudentCount(course.studentCount)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>درس‌های پیش‌نمایش</span>
            <span className="font-semibold text-[#1F2525]">
              {formatPersianNumber(previewLessonsCount)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>آخرین بروزرسانی</span>
            <span className="font-semibold text-[#1F2525]">
              {formatReviewDate(course.updatedAt)}
            </span>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="مدرس دوره">
        <div className="flex items-center gap-4">
          {course.instructor.avatarImage ? (
            <img
              src={course.instructor.avatarImage}
              alt={course.instructor.name}
              className="h-16 w-16 rounded-full border border-[#DCE8E2] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#DCE8E2] bg-[#F5FAF7] text-lg font-bold text-[#2F7D62]">
              {instructorInitials}
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#1F2525]">
              {course.instructor.name}
            </h4>
            <p className="text-sm text-[#7A7F7C]">{course.category.name}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#4D5451]">
          {course.instructor.bio?.trim() ||
            "اطلاعات بیشتری درباره استاد ثبت نشده است."}
        </p>
      </SidebarCard>
    </div>
  );
}
