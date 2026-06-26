import type { CourseDetail } from "@/shared/api/services/courses";
import { formatPersianNumber, formatStudentCount, getInitials } from "../../courses/lib/utils";
import { formatRating } from "../lib/utils";
import { CourseSidebar } from "./CourseSidebar";

type InstructorContentProps = {
  course: CourseDetail;
};

export function InstructorContent({ course }: InstructorContentProps) {
  const instructorInitials = getInitials(course.instructor.name) || "؟";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-[22px] border border-[#E8E8E3] bg-[#FCFDFC] p-6 shadow-[0_18px_40px_rgba(31,37,37,0.04)]">
        <div className="flex flex-col gap-5 border-b border-[#E8E8E3] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {course.instructor.avatarImage ? (
              <img
                src={course.instructor.avatarImage}
                alt={course.instructor.name}
                className="h-20 w-20 rounded-full border border-[#DCE8E2] object-cover shadow-[0_10px_24px_rgba(47,125,98,0.08)]"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#DCE8E2] bg-white text-2xl font-bold text-[#2F7D62] shadow-[0_10px_24px_rgba(47,125,98,0.08)]">
                {instructorInitials}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1F2525]">
                {course.instructor.name}
              </h3>
              <p className="text-sm text-[#7A7F7C]">
                مدرس دوره {course.category.name}
              </p>
              <div className="inline-flex rounded-full border border-[#DCE8E2] bg-white px-3 py-1 text-xs font-semibold text-[#2F7D62]">
                امتیاز دوره {formatRating(course.rating)}
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E8E8E3] bg-white px-4 py-3 text-sm text-[#4D5451]">
            {formatStudentCount(course.studentCount)} دانشجو در این دوره
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-8 text-[#4D5451] sm:text-base">
          <p>
            {course.instructor.bio?.trim() ||
              "برای این مدرس هنوز توضیحات کاملی ثبت نشده است."}
          </p>
          <p>
            این دوره در حال حاضر شامل {formatPersianNumber(course.totalLessons)}{" "}
            درس در {formatPersianNumber(course.curriculum.length)} فصل است و با
            میانگین امتیاز {formatRating(course.rating)} ارائه می‌شود.
          </p>
        </div>
      </div>

      <CourseSidebar course={course} />
    </div>
  );
}
