import type { CourseLevel } from "@/shared/api/services/courses";
import { levelOptions } from "./constants";

export function getInitials(name: string) {
  return name
    .replace("استاد", "")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");
}

export function toPersianLevel(level: CourseLevel) {
  return levelOptions.find((item) => item.value === level)?.label ?? level;
}

export function formatStudentCount(count: number) {
  return new Intl.NumberFormat("fa-IR").format(count);
}

export function formatPersianNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
