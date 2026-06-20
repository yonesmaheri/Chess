"use client";

import React from "react";
import { Crown, Award } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/shared/contexts/auth-provider";

export default function ProfileCard() {
  const { user } = useAuth();

  const currentLevel = 1200;
  const nextLevel = 1300;
  const currentXP = 12450;
  const maxXP = 20000;
  const xpPercent = (currentXP / maxXP) * 100;

  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[18px] p-8 mb-8 shadow-sm flex items-center gap-8"
    >
      {/* Right Side - Avatar & User Info */}
      <div className="flex items-center gap-6 flex-1">
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#7f9f85] to-[#6b8973] flex items-center justify-center border-4 border-white shadow-md">
            <span className="text-2xl font-bold text-white">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-[#252a2e]">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-[#8a8f94] mt-1">عضو از فروردین ۱۴۰۲</p>

          <p className="text-sm font-semibold text-[#7f9f85] mt-3">
            سطح بعدی: {nextLevel}
          </p>

          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8a8f94]">تجربه</span>
              <span className="text-xs font-semibold text-[#252a2e]">
                {currentXP.toLocaleString()} / {maxXP.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-[#e7e9e8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7f9f85] rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Current Level */}
      <div className="flex flex-col items-center p-6 bg-[#fafafa] rounded-[14px] border border-[#e7e9e8]">
        <div className="w-14 h-14 rounded-full bg-[#7f9f85] flex items-center justify-center mb-3">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <span className="text-3xl font-bold text-[#252a2e]">
          {currentLevel}
        </span>
        <span className="text-xs text-[#8a8f94] mt-2 text-center">
          سطح فعلی
        </span>
      </div>
    </div>
  );
}
