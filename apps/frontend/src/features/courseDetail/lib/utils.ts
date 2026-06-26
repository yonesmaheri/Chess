import {
  BadgeCheck,
  BookOpen,
  Clock3,
  Star,
  Tag,
  Users,
  Video,
} from "lucide-react";

import type { CourseDetail } from "@/shared/api/services/courses";
import {
  formatPersianNumber,
  formatStudentCount,
  toPersianLevel,
} from "../../courses/lib/utils";
import type { CourseStatItem, FeatureHighlightItem } from "./types";

export function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
}

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function formatRating(value: number) {
  return value.toFixed(1);
}

export function buildPreviewLesson(course: CourseDetail) {
  return (
    course.curriculum
      .flatMap((chapter) => chapter.lessons)
      .find((lesson) => lesson.isPreview) ??
    course.curriculum[0]?.lessons[0] ??
    null
  );
}

export function countPreviewLessons(course: CourseDetail) {
  return course.curriculum.reduce(
    (total, chapter) =>
      total + chapter.lessons.filter((lesson) => lesson.isPreview).length,
    0,
  );
}

export function getHeroStats(course: CourseDetail): CourseStatItem[] {
  return [
    {
      title: "امتیاز دوره",
      value: formatRating(course.rating),
      subtext: `(${formatPersianNumber(course.reviewCount)} نظر)`,
      icon: Star,
      iconClassName: "text-[#D7A93D] fill-[#D7A93D]",
    },
    {
      title: "مدت دوره",
      value: course.duration,
      icon: Clock3,
      iconClassName: "text-[#2F7D62]",
    },
    {
      title: "سطح دوره",
      value: toPersianLevel(course.level),
      icon: BadgeCheck,
      iconClassName: "text-[#2F7D62]",
    },
    {
      title: "تعداد درس‌ها",
      value: `${formatPersianNumber(course.totalLessons)} درس`,
      icon: BookOpen,
      iconClassName: "text-[#2F7D62]",
    },
  ];
}

export function getFeatureHighlights(course: CourseDetail): FeatureHighlightItem[] {
  const previewLessonsCount = countPreviewLessons(course);

  return [
    {
      title: course.category.name,
      icon: Tag,
    },
    {
      title: `${formatStudentCount(course.studentCount)} دانشجو`,
      icon: Users,
    },
    {
      title: `${formatPersianNumber(course.curriculum.length)} فصل آموزشی`,
      icon: BookOpen,
    },
    {
      title: `${formatPersianNumber(previewLessonsCount)} درس پیش‌نمایش`,
      icon: Video,
    },
  ];
}
