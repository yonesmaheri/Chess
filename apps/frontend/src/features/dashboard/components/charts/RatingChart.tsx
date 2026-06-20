"use client";

import React from "react";
import { BarChart3, ChevronDown } from "lucide-react";

export default function RatingChart() {
  // Simplified SVG chart since recharts might not be installed
  const data = [
    { date: "۳۰ فروردین", value: 1050 },
    { date: "۶ اردیبهشت", value: 1100 },
    { date: "۱۳ اردیبهشت", value: 1120 },
    { date: "۲۰ اردیبهشت", value: 1180 },
    { date: "۲۷ اردیبهشت", value: 1200 },
  ];

  const minValue = 600;
  const maxValue = 1400;
  const yAxisLabels = [600, 800, 1000, 1200, 1400];
  const chartHeight = 280;
  const chartWidth = 500;
  const padding = { top: 20, right: 40, bottom: 40, left: 50 };

  const getY = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    return (
      padding.top + (1 - ratio) * (chartHeight - padding.top - padding.bottom)
    );
  };

  const getX = (index: number) => {
    const interval =
      (chartWidth - padding.left - padding.right) / (data.length - 1);
    return padding.left + index * interval;
  };

  // Create path for line chart
  const pathPoints = data
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(" L ");
  const path = `M ${pathPoints}`;

  // Create area path for gradient
  const areaPath =
    `M ${padding.left},${chartHeight - padding.bottom} ` +
    `L ${data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" L ")} ` +
    `L ${getX(data.length - 1)},${chartHeight - padding.bottom}`;

  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[16px] p-6 shadow-sm h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[#252a2e]">رشد ریتینگ (ELO)</h3>
          <BarChart3 className="w-5 h-5 text-[#8a8f94]" />
        </div>
        <button className="flex items-center gap-2 text-sm text-[#8a8f94] hover:text-[#252a2e]">
          نمودار خطی
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="bg-[#fafafa] rounded-[12px] p-4 mb-4 overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="min-w-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          {yAxisLabels.map((label, i) => {
            const y = getY(label);
            return (
              <g key={`grid-${i}`}>
                {/* Horizontal grid line */}
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e7e9e8"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                {/* Y axis label */}
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#8a8f94"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {data.map((d, i) => (
            <text
              key={`label-${i}`}
              x={getX(i)}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#8a8f94"
            >
              {d.date}
            </text>
          ))}

          {/* Area under line */}
          <path d={areaPath} fill="url(#areaGradient)" opacity="0.6" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7f9f85" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7f9f85" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Line chart */}
          <path
            d={path}
            stroke="#7f9f85"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={`point-${i}`}
              cx={getX(i)}
              cy={getY(d.value)}
              r="5"
              fill="#7f9f85"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Current value tooltip */}
          <g>
            <rect
              x={getX(data.length - 1) - 50}
              y={getY(data[data.length - 1].value) - 30}
              width="100"
              height="25"
              rx="6"
              fill="#7f9f85"
            />
            <text
              x={getX(data.length - 1)}
              y={getY(data[data.length - 1].value) - 12}
              textAnchor="middle"
              fontSize="13"
              fill="white"
              fontWeight="bold"
            >
              {data[data.length - 1].value} امروز
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
