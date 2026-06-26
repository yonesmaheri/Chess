import type { CourseLevel, CourseSortOption } from "@/shared/api/services/courses";

export const levelOptions: Array<{ value: CourseLevel; label: string }> = [
  { value: "beginner", label: "مقدماتی" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "پیشرفته" },
];

export const categoryOptions = [
  { value: "fundamentals", label: "مبانی" },
  { value: "strategy", label: "استراتژی" },
  { value: "tactics", label: "تاکتیک" },
] as const;

export const sortOptions: Array<{ value: CourseSortOption; label: string }> = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "rating", label: "بالاترین امتیاز" },
];
