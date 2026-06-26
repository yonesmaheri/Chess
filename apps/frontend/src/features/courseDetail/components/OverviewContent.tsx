import { BookOpen, Star, Tag, Users } from "lucide-react";

import type { CourseDetail } from "@/shared/api/services/courses";
import { formatPersianNumber, formatStudentCount } from "../../courses/lib/utils";
import { formatReviewDate } from "../lib/utils";
import { CourseSidebar } from "./CourseSidebar";

type OverviewContentProps = {
  course: CourseDetail;
};

export function OverviewContent({ course }: OverviewContentProps) {
  const overviewHighlights = [
    {
      title: `دسته‌بندی ${course.category.name}`,
      icon: Tag,
    },
    {
      title: `${formatStudentCount(course.studentCount)} دانشجو`,
      icon: Users,
    },
    {
      title: `${formatPersianNumber(course.curriculum.length)} فصل`,
      icon: BookOpen,
    },
    {
      title: `${formatPersianNumber(course.reviews.length)} نظر`,
      icon: Star,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <div className="rounded-[18px] border border-[#E8E8E3] bg-[#FCFDFC] p-6">
          <h3 className="text-xl font-bold text-[#1F2525]">درباره این دوره</h3>
          <p className="mt-4 text-sm leading-8 text-[#4D5451] sm:text-base">
            {course.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {overviewHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[16px] border border-[#E8E8E3] bg-white p-5 shadow-[0_14px_30px_rgba(31,37,37,0.03)]"
            >
              <item.icon className="mb-3 h-5 w-5 text-[#2F7D62]" />
              <p className="text-sm leading-7 text-[#36403D]">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[18px] border border-[#E8E8E3] bg-white p-6 shadow-[0_14px_30px_rgba(31,37,37,0.03)]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-[#1F2525]">نظر دانشجویان</h3>
            <span className="text-sm text-[#7A7F7C]">
              {formatPersianNumber(course.reviewCount)} نظر ثبت شده
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {course.reviews.length ? (
              course.reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="rounded-[14px] border border-[#E8E8E3] bg-[#FCFDFC] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1F2525]">
                        {review.authorName}
                      </p>
                      <p className="text-sm text-[#7A7F7C]">
                        {formatReviewDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[#D7A93D]">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold text-[#1F2525]">
                        {formatPersianNumber(review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#4D5451]">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#7A7F7C]">
                هنوز نظری برای این دوره ثبت نشده است.
              </p>
            )}
          </div>
        </div>
      </div>

      <CourseSidebar course={course} />
    </div>
  );
}
