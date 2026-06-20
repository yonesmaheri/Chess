"use client";

import React from "react";
import { Zap, Trophy, Target, BookOpen } from "lucide-react";
import StatCard from "./StatCard";

export default function StatisticsSection() {
  const stats = [
    {
      title: "بازی‌های انجام شده",
      value: 86,
      icon: Zap,
      trend: "up",
      trendText: "12% نسبت به قبل",
      bgColor: "bg-[#fef3e7]",
    },
    {
      title: "بردها",
      value: 54,
      icon: Trophy,
      subtitle: "62% نرخ برد",
      bgColor: "bg-[#fff4e7]",
    },
    {
      title: "دقت تاکتیکی",
      value: "72%",
      icon: Target,
      trend: "up",
      trendText: "نسبت به قبل ↑",
      bgColor: "bg-[#e7f3f1]",
    },
    {
      title: "درس‌های تکمیل شده",
      value: 28,
      icon: BookOpen,
      trend: "up",
      trendText: "نسبت به قبل ↑",
      bgColor: "bg-[#e8f1f9]",
    },
  ];

  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          subtitle={stat.subtitle}
          trend={stat.trend}
          trendText={stat.trendText}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
}
