"use client";

import React from "react";
import { Map, Check, Lock, Zap } from "lucide-react";

interface LearningStep {
  id: string;
  title: string;
  subtitle: string;
  status: "completed" | "active" | "locked";
}

const learningSteps: LearningStep[] = [
  {
    id: "1",
    title: "مبتدی",
    subtitle: "مفاهیم پایه شطرنج",
    status: "completed",
  },
  {
    id: "2",
    title: "سباز",
    subtitle: "حرکت‌های پایه",
    status: "completed",
  },
  {
    id: "3",
    title: "اسب",
    subtitle: "تاکتیک‌های ابتدایی",
    status: "completed",
  },
  {
    id: "4",
    title: "فیل",
    subtitle: "استراتژی‌های پایه",
    status: "completed",
  },
  {
    id: "5",
    title: "رخ",
    subtitle: "ترکیب‌های پیشرفته",
    status: "active",
  },
  {
    id: "6",
    title: "وزیر",
    subtitle: "تکنیک‌های پیشرفته",
    status: "locked",
  },
  {
    id: "7",
    title: "شاه",
    subtitle: "تئوری عمیق",
    status: "locked",
  },
];

export default function LearningPath() {
  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[16px] p-6 shadow-sm h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Map className="w-5 h-5 text-[#7f9f85]" />
        <h3 className="text-lg font-bold text-[#252a2e]">مسیر یادگیری</h3>
      </div>

      {/* Learning Steps */}
      <div className="flex-1 space-y-0 mb-6">
        {learningSteps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isLocked = step.status === "locked";
          const isLast = index === learningSteps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute right-3.75 top-12.5 w-px h-12 border-r border-dashed border-[#e7e9e8]" />
              )}

              {/* Step Item */}
              <div className="flex items-start gap-4 pb-6 relative z-10">
                {/* Node */}
                <div className="shrink-0 mt-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      isCompleted
                        ? "bg-[#7f9f85] border-[#7f9f85] text-white"
                        : isActive
                          ? "bg-white border-[#7f9f85] text-[#7f9f85]"
                          : "bg-[#f0f4f2] border-[#8a8f94] text-[#8a8f94]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isActive ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isCompleted || isActive
                        ? "text-[#252a2e]"
                        : "text-[#8a8f94]"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#8a8f94] mt-1">{step.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
