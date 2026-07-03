import { TrendingUp } from "lucide-react";
import type { PlayerProfileHistoryPoint } from "@/shared/api/services/players";
import { getCalendarApi } from "@/shared/lib/date";

type PlayerProfileRatingChartProps = {
  points: PlayerProfileHistoryPoint[];
  currentElo: number;
};

const calendar = getCalendarApi();

function formatMonthLabel(value: string) {
  return calendar.format(new Date(value), "MMM yyyy");
}

function formatPersianNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export default function PlayerProfileRatingChart({
  points,
  currentElo,
}: PlayerProfileRatingChartProps) {
  const values = points.map((point) => point.elo);
  const minValue = Math.min(...values) - 40;
  const maxValue = Math.max(...values) + 40;
  const chartWidth = 760;
  const chartHeight = 320;
  const padding = { top: 24, right: 42, bottom: 52, left: 52 };
  const yAxisLabels = Array.from({ length: 5 }, (_, index) =>
    Math.round(minValue + ((maxValue - minValue) / 4) * index),
  );

  const getY = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue || 1);

    return (
      padding.top + (1 - ratio) * (chartHeight - padding.top - padding.bottom)
    );
  };

  const getX = (index: number) => {
    const interval =
      (chartWidth - padding.left - padding.right) / Math.max(points.length - 1, 1);

    return padding.left + index * interval;
  };

  const linePath = `M ${points
    .map((point, index) => `${getX(index)},${getY(point.elo)}`)
    .join(" L ")}`;
  const areaPath =
    `M ${padding.left},${chartHeight - padding.bottom} ` +
    `L ${points
      .map((point, index) => `${getX(index)},${getY(point.elo)}`)
      .join(" L ")} ` +
    `L ${getX(points.length - 1)},${chartHeight - padding.bottom}`;

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#E8ECE7] bg-white py-6 shadow-[0_24px_60px_rgba(31,37,37,0.05)] lg:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1F2525]">
            <h2 className="text-lg font-bold">نمودار پیشرفت امتیاز</h2>
            <TrendingUp className="size-5 text-[#6F9D78]" />
          </div>
          <p className="text-sm text-[#7A7F7C]">
            روند تغییرات ریتینگ در ماه های اخیر
          </p>
        </div>
        <div className="inline-flex items-center rounded-full bg-[#F5F8F4] px-4 py-2 text-sm font-semibold text-[#3D6D49]">
          ELO فعلی: {formatPersianNumber(currentElo)}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[22px] border border-[#EEF1ED] bg-[#FCFDFC]">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="min-w-[450px]"
        >
          <defs>
            <linearGradient id="player-profile-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6F9D78" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#6F9D78" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {yAxisLabels.map((label) => {
            const y = getY(label);

            return (
              <g key={label}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E6EBE5"
                  strokeDasharray="5 5"
                />
                <text
                  x={chartWidth - padding.right + 10}
                  y={y + 4}
                  fill="#8C938F"
                  fontSize="12"
                  textAnchor="start"
                >
                  {formatPersianNumber(label)}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#player-profile-area)" />
          <path
            d={linePath}
            fill="none"
            stroke="#6F9D78"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={point.date}>
              <circle
                cx={getX(index)}
                cy={getY(point.elo)}
                r="4.5"
                fill="#6F9D78"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x={getX(index)}
                y={chartHeight - 18}
                fill="#8C938F"
                fontSize="12"
                textAnchor="middle"
              >
                {formatMonthLabel(point.date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
