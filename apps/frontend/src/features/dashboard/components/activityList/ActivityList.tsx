"use client";

import React from "react";
import { Trophy, Award, BookOpen } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "win" | "loss" | "lesson";
  title: string;
  subtitle: string;
  date: string;
  icon: React.ReactNode;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "win",
    title: "بازی مقابل مهران کاظمی",
    subtitle: "برد",
    date: "امروز",
    icon: <Trophy className="w-5 h-5 text-[#7f9f85]" />,
  },
  {
    id: "2",
    type: "lesson",
    title: "تکمیل درس تاکتیک‌های بین",
    subtitle: "+150 XP",
    date: "دیروز",
    icon: <Award className="w-5 h-5 text-[#7f9f85]" />,
  },
  {
    id: "3",
    type: "loss",
    title: "بازی مقابل سارا محمدی",
    subtitle: "باخت",
    date: "۲ روز پیش",
    icon: <Trophy className="w-5 h-5 text-[#8a8f94]" />,
  },
  {
    id: "4",
    type: "lesson",
    title: "تکمیل درس ترکیب‌های مات",
    subtitle: "+200 XP",
    date: "۳ روز پیش",
    icon: <Award className="w-5 h-5 text-[#7f9f85]" />,
  },
  {
    id: "5",
    type: "win",
    title: "بازی مقابل رضا یوسفی",
    subtitle: "برد",
    date: "۴ روز پیش",
    icon: <Trophy className="w-5 h-5 text-[#7f9f85]" />,
  },
];

export default function ActivityList() {
  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[16px] p-6 shadow-sm h-full flex flex-col"
    >
      {/* Header */}
      <h3 className="text-lg font-bold text-[#252a2e] mb-6">فعالیت‌های اخیر</h3>

      {/* Activities List */}
      <div className="flex-1 space-y-4 mb-6">
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <div className="flex items-center gap-4 pb-4">
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f0f4f2] flex items-center justify-center">
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#252a2e] truncate">
                  {activity.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#8a8f94]">
                    {activity.subtitle}
                  </span>
                  <span className="text-xs text-[#8a8f94]">
                    {activity.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            {index < activities.length - 1 && (
              <div className="h-px bg-[#e7e9e8]" />
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[#e7e9e8] text-sm font-medium text-[#7f9f85] hover:bg-[#f0f4f2] transition-colors">
        مشاهده همه فعالیت‌ها
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
