"use client";

import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  Lock,
  Target,
} from "lucide-react";

import DashboardPageHeader from "@/shared/components/dashboardPageHeader";
import { Button } from "@/shared/components/ui/button";

type Course = {
  title: string;
  level: string;
  progress: number;
  artwork: "tactics" | "middlegame" | "endgame";
};

type Training = {
  step: number;
  title: string;
  description: string;
  status: "completed" | "locked";
  artwork: "rook" | "bishop" | "queen";
  timelineState: "completed" | "active" | "locked";
};

const courses: Course[] = [
  {
    title: "مبانی تاکتیک های شطرنج",
    level: "مبتدی تا متوسط",
    progress: 65,
    artwork: "tactics",
  },
  {
    title: "استراتژی در میانه بازی",
    level: "متوسط",
    progress: 42,
    artwork: "middlegame",
  },
  {
    title: "آخر بازی های شطرنج",
    level: "متوسط تا پیشرفته",
    progress: 18,
    artwork: "endgame",
  },
];

const trainings: Training[] = [
  {
    step: 1,
    title: "مات با رخ",
    description: "یادگیری تکنیک های مات با رخ در موقعیت های مختلف",
    status: "completed",
    artwork: "rook",
    timelineState: "completed",
  },
  {
    step: 2,
    title: "مات با فیل",
    description: "تمرین مات با فیل و ترکیب آن با مهره های دیگر",
    status: "completed",
    artwork: "bishop",
    timelineState: "active",
  },
  {
    step: 3,
    title: "مات با وزیر",
    description: "تسلط بر تکنیک های مات با وزیر",
    status: "locked",
    artwork: "queen",
    timelineState: "locked",
  },
];

function HeaderIconButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e6ebe3] bg-white text-[#66706a] shadow-[0_12px_32px_-26px_rgba(36,38,43,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4ddcf] hover:text-[#486554]"
    >
      {children}
    </button>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4eb] text-[#6f8a74]">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#252a2e] sm:text-2xl">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-[#8a8f94] sm:text-[15px]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function CourseArtwork({ variant }: { variant: Course["artwork"] }) {
  const palettes = {
    tactics: {
      primary: "#89a67d",
      secondary: "#dae8d6",
      boardLight: "#f5f1d4",
      boardDark: "#96ad78",
    },
    middlegame: {
      primary: "#7f9572",
      secondary: "#e3ebde",
      boardLight: "#f2efdc",
      boardDark: "#879f73",
    },
    endgame: {
      primary: "#738c6d",
      secondary: "#e6ece3",
      boardLight: "#f4f0d8",
      boardDark: "#90a47a",
    },
  }[variant];

  return (
    <div className="relative h-[124px] w-full overflow-hidden rounded-[24px] border border-[#dce3d9] bg-[#f7faf6] md:w-[224px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,255,255,0)_52%)]" />
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        role="img"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="240" height="140" fill={palettes.secondary} />
        <rect x="0" y="92" width="240" height="48" fill="#edf3ea" />
        <rect x="122" y="24" width="88" height="88" rx="18" fill="#ffffff" />
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={130 + col * 18}
              y={32 + row * 18}
              width="18"
              height="18"
              fill={(row + col) % 2 === 0 ? palettes.boardLight : palettes.boardDark}
            />
          )),
        )}
        <circle cx="58" cy="72" r="34" fill={palettes.primary} opacity="0.16" />
        <path
          d="M38 97h40l-4-10h-8V58c4-3 6-8 6-13 0-10-8-18-18-18S36 35 36 45c0 5 2 10 6 13v29h-8l4 10Zm12-54c0-4 3-7 8-7s8 3 8 7-3 8-8 8-8-4-8-8Z"
          fill={palettes.primary}
        />
        <path
          d="M166 98h26"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M23 112c18-10 34-14 49-14 18 0 29 7 41 7 11 0 20-2 32-10"
          stroke={palettes.primary}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

function TrainingArtwork({ variant }: { variant: Training["artwork"] }) {
  const pieceLabel = {
    rook: "R",
    bishop: "B",
    queen: "Q",
  }[variant];

  return (
    <div className="flex h-[76px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-[#dbe1d6] bg-[#f7faf6]">
      <div className="grid grid-cols-4 overflow-hidden rounded-[16px] border border-[#d5ddd1] shadow-inner">
        {Array.from({ length: 16 }).map((_, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const isDark = (row + col) % 2 === 1;

          return (
            <div
              key={index}
              className={`relative flex h-4.5 w-4.5 items-center justify-center ${
                isDark ? "bg-[#95ab79]" : "bg-[#f2edd2]"
              }`}
            >
              {index === 5 ? (
                <span className="text-[10px] font-bold text-[#355142]">
                  {pieceLabel}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group rounded-[28px] border border-[#e6ebe3] bg-white p-5 shadow-[0_18px_60px_-42px_rgba(36,38,43,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-46px_rgba(72,101,84,0.4)] sm:p-6">
      <div className="flex flex-col gap-5 md:min-h-[150px] md:flex-row md:items-center md:justify-between">
        <CourseArtwork variant={course.artwork} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-full bg-[#f3f6f1] px-3 py-1 text-xs font-medium text-[#748278]">
              {course.level}
            </div>
            <span className="text-sm font-semibold text-[#6f8a74]">
              {course.progress}%
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold leading-8 text-[#252a2e] sm:text-2xl">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-[#8a8f94]">{course.level}</p>

          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-[#ecefea]">
              <div
                className="h-full rounded-full bg-[#7f9f85] transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="md:w-[140px] md:shrink-0">
          <Button
            type="button"
            className="h-12 w-full rounded-2xl bg-[#eaf3ea] text-[#486554] shadow-none hover:bg-[#dceadf]"
          >
            <ArrowLeft className="h-4 w-4" />
            ادامه دوره
          </Button>
        </div>
      </div>
    </article>
  );
}

function TimelineIndicator({ training }: { training: Training }) {
  if (training.timelineState === "completed") {
    return (
      <div className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#7f9f85] bg-white text-[#7f9f85] shadow-[0_8px_24px_-18px_rgba(72,101,84,0.65)]">
        <Check className="h-4 w-4" />
      </div>
    );
  }

  if (training.timelineState === "active") {
    return (
      <div className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#7f9f85] text-sm font-bold text-white shadow-[0_10px_28px_-18px_rgba(72,101,84,0.8)]">
        {training.step}
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#e5e8e5] text-sm font-bold text-[#8a8f94]">
      {training.step}
    </div>
  );
}

function TrainingCard({ training }: { training: Training }) {
  const isLocked = training.status === "locked";

  return (
    <div className="relative pr-16">
      <TimelineIndicator training={training} />

      <article
        className={`rounded-[26px] border border-[#e6ebe3] bg-white p-4 shadow-[0_16px_48px_-40px_rgba(36,38,43,0.42)] transition-all duration-300 sm:p-5 ${
          isLocked
            ? "opacity-75"
            : "hover:-translate-y-1 hover:shadow-[0_26px_60px_-42px_rgba(72,101,84,0.38)]"
        }`}
      >
        <div className="flex flex-col gap-4 sm:min-h-[100px] sm:flex-row sm:items-center">
          <TrainingArtwork variant={training.artwork} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-[#252a2e]">{training.title}</h3>
              {training.status === "completed" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#edf6ed] px-2.5 py-1 text-xs font-medium text-[#5f7b66]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7f9f85] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  تکمیل شده
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f2] px-2.5 py-1 text-xs font-medium text-[#8a8f94]">
                  <Lock className="h-3.5 w-3.5" />
                  قفل
                </span>
              )}
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#7e858c]">
              {training.description}
            </p>
          </div>

          <div className="sm:w-[142px] sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              disabled={isLocked}
              className={`h-11 w-full rounded-2xl border-[#dbe2d8] bg-white text-[#486554] shadow-none transition-all ${
                isLocked
                  ? "cursor-not-allowed border-[#e2e5e2] bg-[#f5f6f5] text-[#a3a8ad]"
                  : "hover:border-[#cad5c6] hover:bg-[#f6faf5]"
              }`}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : null}
              شروع تمرین
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <div dir="rtl" className="min-h-full bg-[#fbfcfa]">
      <div className="py-8 sm:py-10">
        <DashboardPageHeader
          title="یادگیری من"
          subtitle="مسیر یادگیری خود را ادامه دهید و مهارت هایتان را ارتقا دهید."
          actions={
            <>
              <HeaderIconButton label="اعلان ها">
                <Bell className="h-5 w-5" />
              </HeaderIconButton>
              <HeaderIconButton label="تقویم">
                <CalendarDays className="h-5 w-5" />
              </HeaderIconButton>
            </>
          }
        />

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <SectionHeading
              icon={<BookOpen className="h-5 w-5" />}
              title="دوره های من"
            />
          </div>

          <div className="mt-6 space-y-5">
            {courses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[32px] border border-[#edf0ea] bg-[#f8faf7] p-6 shadow-[0_24px_80px_-62px_rgba(36,38,43,0.45)] sm:p-8">
          <SectionHeading
            icon={<Target className="h-5 w-5" />}
            title="مسیر تمرینات عملی"
            subtitle="مهارت های خود را با تمرین های هدفمند تقویت کنید."
          />

          <div className="relative mt-8 space-y-4">
            <div className="absolute bottom-10 right-5 top-10 w-px bg-[#dfe5dd]" />
            {trainings.map((training) => (
              <TrainingCard key={training.step} training={training} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
