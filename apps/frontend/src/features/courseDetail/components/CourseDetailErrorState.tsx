"use client";

import { BookOpen } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { getErrorMessage } from "@/shared/lib/http";

type CourseDetailErrorStateProps = {
  error: unknown;
};

export function CourseDetailErrorState({
  error,
}: CourseDetailErrorStateProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-5 px-4 py-20 text-center sm:px-6">
        <div className="rounded-full bg-[#FFF4F4] p-4 text-[#C85C5C]">
          <BookOpen className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">دریافت اطلاعات دوره ممکن نشد</h1>
          <p className="text-sm leading-7 text-[#7A7F7C] sm:text-base">
            {getErrorMessage(
              error,
              "بارگذاری جزئیات این دوره با مشکل روبه‌رو شد.",
            )}
          </p>
        </div>
        <Button
          type="button"
          className="h-11 rounded-[10px] bg-[#2F7D62] px-5 text-sm font-semibold text-white hover:bg-[#276A53]"
          onClick={() => window.location.reload()}
        >
          تلاش دوباره
        </Button>
      </div>
    </main>
  );
}
