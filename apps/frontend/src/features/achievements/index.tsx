"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Clock3,
  Flame,
  Goal,
  GraduationCap,
  Crown,
  Lock,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";

const summaryCards = [
  {
    title: "زمان کل بازی",
    value: "240:15:42",
    subtitle: "معادل 10 روز و 12 ساعت",
    icon: Clock3,
    accent: "text-[#8aae93]",
    iconBg: "bg-[#edf5ef]",
  },
  {
    title: "تاکتیک های حل شده",
    value: "1,248",
    subtitle: "میانگین روزانه: 18.7",
    icon: Target,
    accent: "text-[#8aae93]",
    iconBg: "bg-[#edf5ef]",
  },
  {
    title: "زنجیره برد",
    value: "12",
    subtitle: "بهترین: 18",
    icon: Flame,
    accent: "text-[#f2a53b]",
    iconBg: "bg-[#fff6e7]",
  },
  {
    title: "بیشترین رتبه",
    value: "1897",
    subtitle: "28 اردیبهشت 1403",
    icon: TrendingUp,
    accent: "text-[#8aae93]",
    iconBg: "bg-[#edf5ef]",
  },
];

const ratingRanges = ["7 روز", "1 ماه", "6 ماه", "1 سال", "همه"];

const ratingHistory = [
  { label: "خرداد 1402", value: 920 },
  { label: "تیر 1402", value: 1005 },
  { label: "مرداد 1402", value: 1060 },
  { label: "شهریور 1402", value: 1145 },
  { label: "مهر 1402", value: 1260 },
  { label: "آبان 1402", value: 1325 },
  { label: "آذر 1402", value: 1460 },
  { label: "دی 1402", value: 1515 },
  { label: "بهمن 1402", value: 1600 },
  { label: "اسفند 1402", value: 1655 },
  { label: "فروردین 1403", value: 1742 },
  { label: "اردیبهشت 1403", value: 1810 },
  { label: "خرداد 1403", value: 1897 },
];

const achievements = [
  {
    title: "استاد تاکتیک",
    subtitle: "حل 1000 پازل",
    date: "1403/02/10",
    icon: Target,
    unlocked: true,
    tone: "from-[#698459] to-[#8fa56f]",
    ring: "border-[#d8c68b]",
  },
  {
    title: "سری برنده",
    subtitle: "10 برد پیاپی",
    date: "1403/01/25",
    icon: Trophy,
    unlocked: true,
    tone: "from-[#c19012] to-[#e5b93d]",
    ring: "border-[#e7cc74]",
  },
  {
    title: "تیرانداز دقیق",
    subtitle: "دقت بالای 85%",
    date: "1402/12/05",
    icon: Goal,
    unlocked: true,
    tone: "from-[#698459] to-[#8fa56f]",
    ring: "border-[#d8c68b]",
  },
  {
    title: "سلطان مات",
    subtitle: "50 مات سریع",
    date: "1402/11/18",
    icon: Crown,
    unlocked: true,
    tone: "from-[#c19012] to-[#e5b93d]",
    ring: "border-[#e7cc74]",
  },
  {
    title: "پیشرفت مداوم",
    subtitle: "افزایش 300 امتیاز",
    date: "1402/10/22",
    icon: TrendingUp,
    unlocked: true,
    tone: "from-[#698459] to-[#8fa56f]",
    ring: "border-[#d8c68b]",
  },
  {
    title: "بازیکن اجتماعی",
    subtitle: "50 بازی دوستانه",
    date: "قفل",
    icon: ShieldCheck,
    unlocked: false,
    tone: "from-[#a4a8ad] to-[#d2d5d9]",
    ring: "border-[#d8dbe0]",
  },
  {
    title: "دانشجو",
    subtitle: "اتمام 10 درس",
    date: "قفل",
    icon: GraduationCap,
    unlocked: false,
    tone: "from-[#a4a8ad] to-[#d2d5d9]",
    ring: "border-[#d8dbe0]",
  },
  {
    title: "استاد استراتژی",
    subtitle: "500 مسئله استراتژی",
    date: "قفل",
    icon: Swords,
    unlocked: false,
    tone: "from-[#a4a8ad] to-[#d2d5d9]",
    ring: "border-[#d8dbe0]",
  },
  {
    title: "فاتح تورنمنت",
    subtitle: "قهرمانی در 3 تورنمنت",
    date: "قفل",
    icon: Trophy,
    unlocked: false,
    tone: "from-[#a4a8ad] to-[#d2d5d9]",
    ring: "border-[#d8dbe0]",
  },
  {
    title: "افسانه شطرنج",
    subtitle: "رسیدن به رتبه 2200",
    date: "قفل",
    icon: Crown,
    unlocked: false,
    tone: "from-[#a4a8ad] to-[#d2d5d9]",
    ring: "border-[#d8dbe0]",
  },
];

const skillMetrics = [
  { label: "گشایش", value: 72 },
  { label: "مهارتهای میانی", value: 68 },
  { label: "آخر بازی", value: 75 },
  { label: "استراتژی", value: 80 },
  { label: "تاکتیک", value: 88 },
  { label: "سرعت", value: 65 },
];

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  iconBg,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e7e9e8] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="text-sm font-medium text-[#3d4348]">{title}</h3>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${accent}`} />
        </div>
      </div>

      <div className="text-4xl font-bold tracking-tight text-[#252a2e]">
        {value}
      </div>
      <p className="mt-3 text-xs text-[#8a8f94]">{subtitle}</p>
    </div>
  );
}

export default function AchievementsPage() {
  const chartHeight = 360;
  const chartWidth = 960;
  const padding = { top: 28, right: 54, bottom: 56, left: 52 };
  const minValue = 900;
  const maxValue = 1900;
  const yAxisLabels = [900, 1100, 1300, 1500, 1700, 1900];

  const getX = (index: number) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    return padding.left + (usableWidth / (ratingHistory.length - 1)) * index;
  };

  const getY = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    return (
      padding.top + (1 - ratio) * (chartHeight - padding.top - padding.bottom)
    );
  };

  const linePath = ratingHistory
    .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point.value)}`)
    .join(" ");

  const areaPath = [
    `M ${getX(0)} ${chartHeight - padding.bottom}`,
    ...ratingHistory.map((point, index) => `L ${getX(index)} ${getY(point.value)}`),
    `L ${getX(ratingHistory.length - 1)} ${chartHeight - padding.bottom}`,
    "Z",
  ].join(" ");

  const latestPoint = ratingHistory[ratingHistory.length - 1];
  const latestX = getX(ratingHistory.length - 1);
  const latestY = getY(latestPoint.value);

  const radarSize = 340;
  const radarCenter = radarSize / 2;
  const radarRadius = 108;
  const radarLevels = 4;

  const getRadarAngle = (index: number) =>
    ((Math.PI * 2) / skillMetrics.length) * index - Math.PI / 2;

  const getRadarPoint = (value: number, index: number, scale = 1) => {
    const angle = getRadarAngle(index);
    const radius = (value / 100) * radarRadius * scale;
    return {
      x: radarCenter + radius * Math.cos(angle),
      y: radarCenter + radius * Math.sin(angle),
    };
  };

  const radarPolygon = skillMetrics
    .map((metric, index) => {
      const point = getRadarPoint(metric.value, index);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div dir="rtl" className=" w-full">
      <section className="py-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ef] text-[#7f9f85]">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#252a2e] sm:text-3xl">
                  آمار و دستاوردها
                </h1>
                <p className="mt-1 text-sm text-[#8a8f94]">
                  عملکرد خود را بررسی کنید و پیشرفتتان را دنبال کنید.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {ratingRanges.map((range, index) => (
              <button
                key={range}
                type="button"
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  index === 0
                    ? "border-[#d5e4d8] bg-[#eef5ef] text-[#55715d]"
                    : "border-[#e7e9e8] bg-white text-[#6b7176] hover:bg-[#fafafa]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-4 md:grid-cols-2">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              accent={card.accent}
              iconBg={card.iconBg}
            />
          ))}
        </div>

        <div className="mt-6 rounded-[22px] border border-[#e7e9e8] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5ef] text-[#7f9f85]">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#252a2e]">
                  نمودار رتبه (ELO)
                </h2>
                <p className="text-xs text-[#8a8f94]">
                  روند رشد ریتینگ شما در ماه‌های اخیر
                </p>
              </div>
            </div>

            <div className="rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-semibold text-[#55715d]">
              +977 امتیاز از ابتدای مسیر
            </div>
          </div>

          <div className="overflow-x-auto rounded-[18px] bg-[#fbfcfb] p-3 sm:p-4">
            <svg
              width={chartWidth}
              height={chartHeight}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="min-w-[860px]"
            >
              <defs>
                <linearGradient
                  id="achievement-chart-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#7f9f85" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#7f9f85" stopOpacity="0.04" />
                </linearGradient>
              </defs>

              {yAxisLabels.map((value) => {
                const y = getY(value);

                return (
                  <g key={value}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#dfe4df"
                      strokeDasharray="4 6"
                    />
                    <text
                      x={padding.left - 14}
                      y={y + 5}
                      textAnchor="end"
                      fontSize="12"
                      fill="#8a8f94"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {ratingHistory.map((point, index) => (
                <text
                  key={point.label}
                  x={getX(index)}
                  y={chartHeight - padding.bottom + 24}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#8a8f94"
                >
                  {point.label}
                </text>
              ))}

              <path d={areaPath} fill="url(#achievement-chart-gradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#7f9f85"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {ratingHistory.map((point, index) => (
                <circle
                  key={`${point.label}-${point.value}`}
                  cx={getX(index)}
                  cy={getY(point.value)}
                  r={index === ratingHistory.length - 1 ? 7 : 4}
                  fill="#7f9f85"
                  stroke="#ffffff"
                  strokeWidth={index === ratingHistory.length - 1 ? 4 : 2}
                />
              ))}

              <line
                x1={latestX}
                y1={latestY}
                x2={latestX}
                y2={chartHeight - padding.bottom}
                stroke="#cfd9d1"
                strokeDasharray="5 5"
              />

              <g>
                <rect
                  x={latestX - 48}
                  y={latestY - 60}
                  width="96"
                  height="40"
                  rx="10"
                  fill="#7f9f85"
                />
                <text
                  x={latestX}
                  y={latestY - 36}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  {latestPoint.value}
                </text>
                <text
                  x={latestX}
                  y={latestY - 22}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#f2f7f3"
                >
                  Rank Progress +7.2%
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]">
          <section className="rounded-[22px] border border-[#e7e9e8] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5ef] text-[#7f9f85]">
                  <Trophy className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-[#252a2e]">دستاوردها</h2>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-[#6f8f76] transition-colors hover:text-[#55715d]"
              >
                مشاهده همه
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;

                return (
                  <article
                    key={achievement.title}
                    className={`group relative flex flex-col items-center text-center ${
                      achievement.unlocked ? "" : "opacity-70"
                    }`}
                  >
                    <div
                      className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 bg-gradient-to-br shadow-[0_10px_30px_rgba(37,42,46,0.08)] ${achievement.tone} ${achievement.ring}`}
                    >
                      <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/50 bg-white/12 backdrop-blur-sm">
                        <Icon className="h-10 w-10 text-white" />
                      </div>

                      {!achievement.unlocked && (
                        <div className="absolute -bottom-1 -left-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#d8dbe0] bg-white text-[#8a8f94]">
                          <Lock className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-[#252a2e]">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#8a8f94]">
                      {achievement.subtitle}
                    </p>
                    <p className="mt-1 text-xs text-[#8a8f94]">
                      {achievement.date}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[22px] border border-[#e7e9e8] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5ef] text-[#7f9f85]">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#252a2e]">
                  نمودار مهارت‌ها
                </h2>
                <p className="text-xs text-[#8a8f94]">
                  نمایی از توانایی‌های کلیدی شما
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <svg
                width={radarSize}
                height={radarSize}
                viewBox={`0 0 ${radarSize} ${radarSize}`}
                className="max-w-full"
              >
                {Array.from({ length: radarLevels }).map((_, levelIndex) => {
                  const scale = (levelIndex + 1) / radarLevels;
                  const gridPoints = skillMetrics
                    .map((_, index) => {
                      const point = getRadarPoint(100, index, scale);
                      return `${point.x},${point.y}`;
                    })
                    .join(" ");

                  return (
                    <polygon
                      key={`grid-${levelIndex}`}
                      points={gridPoints}
                      fill="none"
                      stroke="#dfe4df"
                      strokeWidth="1"
                    />
                  );
                })}

                {skillMetrics.map((_, index) => {
                  const edgePoint = getRadarPoint(100, index);

                  return (
                    <line
                      key={`axis-${index}`}
                      x1={radarCenter}
                      y1={radarCenter}
                      x2={edgePoint.x}
                      y2={edgePoint.y}
                      stroke="#dfe4df"
                      strokeWidth="1"
                    />
                  );
                })}

                <polygon
                  points={radarPolygon}
                  fill="#7f9f85"
                  fillOpacity="0.18"
                  stroke="#7f9f85"
                  strokeWidth="3"
                />

                {skillMetrics.map((metric, index) => {
                  const point = getRadarPoint(metric.value, index);
                  const labelPoint = getRadarPoint(120, index);

                  return (
                    <g key={metric.label}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        fill="#7f9f85"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y - 8}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="#252a2e"
                      >
                        {metric.label}
                      </text>
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y + 10}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#7b8085"
                      >
                        {metric.value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
