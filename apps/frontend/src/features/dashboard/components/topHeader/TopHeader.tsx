"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function TopHeader() {
  const [timeRange] = useState("۳۰ روز گذشته");

  return (
    <div
      dir="rtl"
      className="flex items-center justify-between mb-8 pt-8 border-b border-[#e7e9e8] pb-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-[#252a2e]">پیشرفت و تحلیل</h1>
        <p className="text-sm text-[#8a8f94] mt-2">
          عملکرد خود را بررسی کنید و نقاط قوت خود را تقویت کنید.
        </p>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e7e9e8] bg-white hover:bg-[#fafafa] transition-all shrink-0">
        <span className="text-sm text-[#252a2e]">{timeRange}</span>
        <Calendar className="w-4 h-4 text-[#8a8f94]" />
        <ChevronDown className="w-4 h-4 text-[#8a8f94]" />
      </button>
    </div>
  );
}
