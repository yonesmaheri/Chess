"use client";

import React from "react";
import { Target } from "lucide-react";

export default function GoalCard() {
  const completedLessons = 6;
  const totalLessons = 12;
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[16px] p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-[#7f9f85]" />
        <h3 className="text-lg font-bold text-[#252a2e]">هدف بعدی</h3>
      </div>

      {/* Goal Title */}
      <p className="text-sm font-medium text-[#252a2e] mb-4">
        تکمیل درس‌های ترکیب‌های پیشرفته
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#8a8f94]">پیشرفت</span>
          <span className="text-xs font-semibold text-[#252a2e]">
            {completedLessons} از {totalLessons} درس
          </span>
        </div>
        <div className="w-full h-2 bg-[#e7e9e8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7f9f85] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
