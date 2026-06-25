"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Headset,
  Infinity as InfinityIcon,
  Maximize2,
  Play,
  Settings2,
  Star,
  Target,
  Video,
  Volume2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type CourseDetailViewProps = {
  slug: string;
};

type TabKey = "overview" | "curriculum" | "instructor";

type Lesson = {
  id: number;
  title: string;
  duration: string;
};

type Chapter = {
  id: string;
  title: string;
  lessonsCount: string;
  lessons?: Lesson[];
};

const boardSquares = Array.from({ length: 64 }, (_, index) => index);

const heroStats: Array<{
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  iconClassName?: string;
}> = [
  {
    title: "امتیاز دوره",
    value: "۴.۸",
    subtext: "(۳۵۶ نظر)",
    icon: Star,
    iconClassName: "text-[#D7A93D] fill-[#D7A93D]",
  },
  {
    title: "مدت دوره",
    value: "۶ ساعت",
    icon: Clock3,
    iconClassName: "text-[#2F7D62]",
  },
  {
    title: "سطح دوره",
    value: "سطح متوسط تا پیشرفته",
    icon: BadgeCheck,
    iconClassName: "text-[#2F7D62]",
  },
  {
    title: "تعداد درس‌ها",
    value: "۴۵ درس",
    icon: BookOpen,
    iconClassName: "text-[#2F7D62]",
  },
];

const featureHighlights: Array<{
  title: string;
  icon: LucideIcon;
}> = [
  {
    title: "دسترسی دائمی",
    icon: InfinityIcon,
  },
  {
    title: "تمرین‌های عملی",
    icon: Target,
  },
  {
    title: "پشتیبانی اختصاصی",
    icon: Headset,
  },
  {
    title: "گواهی پایان دوره",
    icon: BadgeCheck,
  },
];

const curriculumChapters: Chapter[] = [
  {
    id: "chapter-1",
    title: "فصل ۱: مبانی تاکتیک",
    lessonsCount: "۸ درس",
    lessons: [
      {
        id: 1,
        title: "مقدمه‌ای بر تاکتیک در شطرنج",
        duration: "15:30",
      },
      {
        id: 2,
        title: "حمله دوگانه",
        duration: "18:45",
      },
      {
        id: 3,
        title: "پین و کشف مهره",
        duration: "20:10",
      },
      {
        id: 4,
        title: "انگیزه فداکاری",
        duration: "22:30",
      },
    ],
  },
  {
    id: "chapter-2",
    title: "فصل ۲: تاکتیک‌های ترکیبی",
    lessonsCount: "۸ درس",
  },
  {
    id: "chapter-3",
    title: "فصل ۳: فداکاری‌ها",
    lessonsCount: "۷ درس",
  },
  {
    id: "chapter-4",
    title: "فصل ۴: مات در چند حرکت",
    lessonsCount: "۱۰ درس",
  },
  {
    id: "chapter-5",
    title: "فصل ۵: تاکتیک در میان‌بازی",
    lessonsCount: "۹ درس",
  },
  {
    id: "chapter-6",
    title: "فصل ۶: تمرینات پیشرفته",
    lessonsCount: "۶ درس",
  },
];

const learningOutcomes = [
  "شناسایی الگوهای تاکتیکی پرکاربرد",
  "محاسبه دقیق و پیدا کردن بهترین حرکت",
  "ترکیب تاکتیک‌ها در بازی‌های واقعی",
  "افزایش قدرت حل مسئله در شطرنج",
];

const prerequisites = ["آشنایی با قوانین پایه شطرنج", "دانستن حرکت مهره‌ها"];

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "توضیحات دوره" },
  { key: "curriculum", label: "سرفصل‌های دوره" },
  { key: "instructor", label: "درباره استاد" },
];

function CourseStat({
  title,
  value,
  subtext,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#E8E8E3] bg-white p-4 shadow-[0_18px_40px_rgba(31,37,37,0.04)] transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#7A7F7C]">
        <Icon className={cn("h-4 w-4", iconClassName)} />
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-[#1F2525]">{value}</p>
        {subtext ? <p className="text-sm text-[#7A7F7C]">{subtext}</p> : null}
      </div>
    </div>
  );
}

function FeaturePill({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5FAF7] text-[#2F7D62]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-[#1F2525] sm:text-base">
        {title}
      </p>
    </div>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-[#E8E8E3] bg-white p-5 shadow-[0_18px_36px_rgba(31,37,37,0.04)] transition-transform duration-300 hover:-translate-y-1">
      <h3 className="mb-4 text-base font-bold text-[#1F2525]">{title}</h3>
      {children}
    </div>
  );
}

function CurriculumSidebar() {
  return (
    <div className="space-y-5">
      <SidebarCard title="آنچه یاد خواهید گرفت">
        <ul className="space-y-3">
          {learningOutcomes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-7 text-[#4D5451]"
            >
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#2F7D62]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="پیش‌نیازها">
        <ul className="space-y-3 text-sm leading-7 text-[#4D5451]">
          {prerequisites.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2F7D62]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="استاد دوره">
        <div className="flex items-center gap-4">
          <div className="flex h-18 w-18 items-center justify-center rounded-full border border-[#DCE8E2] bg-[#F5FAF7] text-xl font-bold text-[#2F7D62]">
            م
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#1F2525]">میلاد محمدی</h4>
            <p className="text-sm text-[#7A7F7C]">استاد بین‌المللی شطرنج</p>
          </div>
        </div>

        <div className="mt-5 inline-flex rounded-full border border-[#DCE8E2] bg-[#F5FAF7] px-3 py-1.5 text-xs font-semibold text-[#2F7D62]">
          دارای درجه FIDE Trainer
        </div>

        <p className="mt-4 text-sm leading-7 text-[#4D5451]">
          بیش از ۱۰ سال سابقه تدریس
        </p>

        <Button
          variant="outline"
          className="mt-5 h-11 w-full rounded-[10px] border-[#2F7D62] text-sm font-semibold text-[#2F7D62] hover:bg-[#F5FAF7] hover:text-[#276A53]"
        >
          مشاهده پروفایل استاد
        </Button>
      </SidebarCard>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <div className="rounded-[18px] border border-[#E8E8E3] bg-[#FCFDFC] p-6">
          <h3 className="text-xl font-bold text-[#1F2525]">درباره این دوره</h3>
          <p className="mt-4 text-sm leading-8 text-[#4D5451] sm:text-base">
            این دوره برای بازیکنانی طراحی شده که می‌خواهند نگاه تاکتیکی خود را
            عمیق‌تر کنند و در موقعیت‌های واقعی سریع‌تر الگوها را تشخیص دهند.
            ساختار دوره از مفاهیم پایه شروع می‌شود و به ترکیب تاکتیک‌ها، الگوهای
            مات و تصمیم‌گیری در میان‌بازی می‌رسد.
          </p>
          <p className="mt-4 text-sm leading-8 text-[#4D5451] sm:text-base">
            تمرین‌های عملی، تحلیل نمونه بازی‌ها و مثال‌های هدفمند باعث می‌شود
            مفاهیم صرفا تئوری باقی نمانند و بتوانید آن‌ها را در بازی‌های رسمی و
            روزمره به کار ببرید.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {learningOutcomes.map((item) => (
            <div
              key={item}
              className="rounded-[16px] border border-[#E8E8E3] bg-white p-5 shadow-[0_14px_30px_rgba(31,37,37,0.03)]"
            >
              <CheckCircle2 className="mb-3 h-5 w-5 text-[#2F7D62]" />
              <p className="text-sm leading-7 text-[#36403D]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <CurriculumSidebar />
    </div>
  );
}

function InstructorContent() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-[22px] border border-[#E8E8E3] bg-[#FCFDFC] p-6 shadow-[0_18px_40px_rgba(31,37,37,0.04)]">
        <div className="flex flex-col gap-5 border-b border-[#E8E8E3] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#DCE8E2] bg-white text-2xl font-bold text-[#2F7D62] shadow-[0_10px_24px_rgba(47,125,98,0.08)]">
              م
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1F2525]">میلاد محمدی</h3>
              <p className="text-sm text-[#7A7F7C]">استاد بین‌المللی شطرنج</p>
              <div className="inline-flex rounded-full border border-[#DCE8E2] bg-white px-3 py-1 text-xs font-semibold text-[#2F7D62]">
                دارای درجه FIDE Trainer
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="h-11 rounded-[10px] border-[#2F7D62] px-5 text-sm font-semibold text-[#2F7D62] hover:bg-[#F5FAF7] hover:text-[#276A53]"
          >
            مشاهده پروفایل استاد
          </Button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-8 text-[#4D5451] sm:text-base">
          <p>
            میلاد محمدی با بیش از ۱۰ سال تجربه آموزشی، روی آموزش تاکتیک‌های
            قابل‌استفاده در بازی واقعی تمرکز دارد و مسیر یادگیری را با مثال‌های
            ساده، دقیق و مرحله‌به‌مرحله پیش می‌برد.
          </p>
          <p>
            شیوه تدریس این دوره بر تشخیص سریع الگوها، محاسبه درست و انتخاب
            بهترین حرکت در زمان محدود بنا شده است؛ رویکردی که برای بازیکنان
            باشگاهی و رقابتی ارزش عملی بالایی دارد.
          </p>
        </div>
      </div>

      <CurriculumSidebar />
    </div>
  );
}

export function CourseDetailView({ slug }: CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("curriculum");
  const [expandedChapters, setExpandedChapters] = useState<string[]>([
    "chapter-1",
  ]);

  const allChaptersExpanded =
    expandedChapters.length === curriculumChapters.length;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((current) =>
      current.includes(chapterId)
        ? current.filter((item) => item !== chapterId)
        : [...current, chapterId],
    );
  };

  const toggleAllChapters = () => {
    setExpandedChapters(
      allChaptersExpanded
        ? []
        : curriculumChapters.map((chapter) => chapter.id),
    );
  };

  return (
    <main className="min-h-screen bg-white text-[#1F2525]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-[#DCE8E2] bg-[#F5FAF7] px-4 py-2 text-sm font-medium text-[#2F7D62]">
              دوره جامع
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#1F2525] sm:text-5xl">
                استاد تاکتیک در شطرنج
              </h1>
              <p className="max-w-[44rem] text-base leading-8 text-[#7A7F7C] sm:text-lg">
                در این دوره جامع، تاکتیک‌های کاربردی شطرنج را از سطح مبتدی تا
                پیشرفته یاد می‌گیرید و در بازی‌های واقعی به کار می‌برید.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((item) => (
                <CourseStat key={item.title} {...item} />
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-16 flex-1 rounded-[12px] bg-[#2F7D62] text-base font-bold text-white shadow-[0_20px_40px_rgba(47,125,98,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#276A53]"
              >
                <Link href={`/courses/${slug}#curriculum`}>
                  همین حالا ثبت‌نام کنید
                </Link>
              </Button>

              <Button
                variant="outline"
                size="icon-lg"
                aria-label="ذخیره دوره"
                className="h-16 w-16 rounded-[12px] border-[#E8E8E3] bg-white text-[#1F2525] shadow-[0_14px_28px_rgba(31,37,37,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F9FBFA]"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-[#E8E8E3] bg-[#171C1B] p-6 shadow-[0_30px_80px_rgba(23,28,27,0.16)]">
            <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              پیش‌نمایش دوره
            </div>

            <div className="relative h-[330px] overflow-hidden rounded-[20px] border border-white/8 bg-[#171C1B]">
              <div className="absolute inset-0 bg-[rgba(255,255,255,0.02)]" />

              <div className="absolute left-10 top-14 h-16 w-36 rotate-[-18deg] rounded-full bg-[#E4CDB7]/90 shadow-[0_24px_48px_rgba(0,0,0,0.28)]" />
              <div className="absolute left-24 top-[76px] h-14 w-16 rotate-[-12deg] rounded-[28px] bg-[#EAD6C3] shadow-[0_18px_36px_rgba(0,0,0,0.24)]" />

              <div className="absolute bottom-9 left-9 right-9 rotate-[-9deg] overflow-hidden rounded-[22px] border border-white/10 shadow-[0_28px_60px_rgba(0,0,0,0.38)]">
                <div className="grid grid-cols-8">
                  {boardSquares.map((square) => {
                    const row = Math.floor(square / 8);
                    const column = square % 8;
                    const isDark = (row + column) % 2 === 1;

                    return (
                      <div
                        key={square}
                        className={cn(
                          "aspect-square",
                          isDark ? "bg-[#2C3533]" : "bg-[#DDE5E1]",
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="absolute bottom-[86px] left-[44%] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#2F7D62] text-white shadow-[0_16px_30px_rgba(47,125,98,0.35)]">
                <span className="text-lg">♟</span>
              </div>
              <div className="absolute bottom-[64px] left-[39%] h-4 w-14 rounded-full bg-black/30 blur-md" />

              <button
                type="button"
                aria-label="پخش پیش‌نمایش"
                className="absolute left-1/2 top-1/2 flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#2F7D62] text-white shadow-[0_18px_42px_rgba(47,125,98,0.35)] transition-transform duration-300 hover:scale-105"
              >
                <Play className="mr-1 h-7 w-7 fill-current" />
              </button>

              <div className="absolute inset-x-4 bottom-4 rounded-[18px] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                    <div className="absolute inset-y-0 right-0 w-[58%] rounded-full bg-[#2F7D62]" />
                    <div className="absolute right-[58%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-white" />
                  </div>
                  <span className="text-xs font-medium tracking-wide text-white/90">
                    02:15 / 01:42
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-white/85">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4" />
                    <Settings2 className="h-4 w-4" />
                    <Maximize2 className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-medium text-white/70">
                    پیش‌نمایش تاکتیک‌های عملی
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[22px] border border-[#E8E8E3] bg-white shadow-[0_16px_44px_rgba(31,37,37,0.04)]">
          <div className="grid divide-y divide-[#E8E8E3] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {featureHighlights.map((item) => (
              <FeaturePill key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section
          id="curriculum"
          className="mt-8 rounded-[22px] border border-[#E8E8E3] bg-white p-5 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:p-7"
        >
          <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-[#E8E8E3] pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative pb-3 text-sm font-medium text-[#7A7F7C] transition-colors duration-300 hover:text-[#2F7D62]",
                  activeTab === tab.key &&
                    "font-semibold text-[#2F7D62] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-[#2F7D62]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" ? <OverviewContent /> : null}

          {activeTab === "curriculum" ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-[18px] border border-[#E8E8E3] bg-[#FCFDFC] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-[#1F2525]">
                    مجموع ۴۵ درس در ۶ فصل
                  </h2>

                  <button
                    type="button"
                    onClick={toggleAllChapters}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F7D62] transition-colors duration-300 hover:text-[#276A53]"
                  >
                    همه فصل‌ها را باز کنید
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        allChaptersExpanded && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                {curriculumChapters.map((chapter) => {
                  const isExpanded = expandedChapters.includes(chapter.id);

                  return (
                    <div
                      key={chapter.id}
                      className="overflow-hidden rounded-[14px] border border-[#E8E8E3] bg-white shadow-[0_14px_30px_rgba(31,37,37,0.03)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleChapter(chapter.id)}
                        className="flex min-h-[55px] w-full items-center justify-between gap-4 px-5 py-4 text-right"
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold text-[#1F2525]">
                            {chapter.title}
                          </h3>
                          <p className="text-sm text-[#7A7F7C]">
                            {chapter.lessonsCount}
                          </p>
                        </div>

                        <ChevronDown
                          className={cn(
                            "h-5 w-5 shrink-0 text-[#7A7F7C] transition-transform duration-300",
                            isExpanded && "rotate-180 text-[#2F7D62]",
                          )}
                        />
                      </button>

                      {isExpanded && chapter.lessons ? (
                        <div className="border-t border-[#E8E8E3] bg-[#FCFDFC] px-5">
                          {chapter.lessons.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex min-h-[45px] items-center justify-between gap-4 py-3",
                                index !== chapter.lessons!.length - 1 &&
                                  "border-b border-[#E8E8E3]",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Video className="h-4 w-4 text-[#2F7D62]" />
                                <span className="text-sm font-medium text-[#7A7F7C]">
                                  {lesson.id}
                                </span>
                                <p className="text-sm text-[#1F2525] sm:text-base">
                                  {lesson.title}
                                </p>
                              </div>

                              <span className="text-sm font-medium text-[#7A7F7C]">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <CurriculumSidebar />
            </div>
          ) : null}

          {activeTab === "instructor" ? <InstructorContent /> : null}
        </section>
      </div>
    </main>
  );
}
