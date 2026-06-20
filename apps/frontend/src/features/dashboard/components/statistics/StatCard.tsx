"use client";

import React from "react";
import { ArrowUp, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendText?: string;
  bgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend = "neutral",
  trendText,
  bgColor = "bg-[#f0f4f2]",
}: StatCardProps) {
  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-6">
        <div
          className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-[#7f9f85]" />
        </div>
        <h3 className="text-sm font-medium text-[#8a8f94]">{title}</h3>
      </div>

      {/* Value */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-[#252a2e]">{value}</span>
      </div>

      {/* Subtitle or Trend */}
      <div className="flex items-center gap-2">
        {trend === "up" && (
          <>
            <ArrowUp className="w-4 h-4 text-[#7f9f85]" />
            <span className="text-xs font-semibold text-[#7f9f85]">
              {trendText}
            </span>
          </>
        )}
        {trend === "neutral" && (
          <span className="text-xs text-[#8a8f94]">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
