"use client";

import React from "react";

const skills = [
  { label: "تاکتیک", value: 72 },
  { label: "استراتژی", value: 68 },
  { label: "پایان بازی", value: 55 },
  { label: "محاسبه", value: 65 },
  { label: "گشودن‌ها", value: 60 },
  { label: "مدیریت زمان", value: 70 },
];

const averageValue = 65; // Average for peers

export default function SkillRadar() {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const levels = 5;

  const getAngle = (index: number) => {
    return (index * (360 / skills.length) - 90) * (Math.PI / 180);
  };

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Create polygon points for user skill
  const userPoints = skills
    .map((skill, i) => {
      const angle = getAngle(i);
      const coords = getCoordinates(skill.value, angle);
      return `${coords.x},${coords.y}`;
    })
    .join(" ");

  // Create polygon points for average (comparison)
  const avgPoints = skills
    .map((skill, i) => {
      const angle = getAngle(i);
      const coords = getCoordinates(averageValue, angle);
      return `${coords.x},${coords.y}`;
    })
    .join(" ");

  return (
    <div
      dir="rtl"
      className="bg-white border border-[#e7e9e8] rounded-[16px] p-6 shadow-sm"
    >
      {/* Header */}
      <h3 className="text-lg font-bold text-[#252a2e] mb-6">تحلیل مهارت‌ها</h3>

      {/* Radar Chart */}
      <div className="flex justify-center mb-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Grid circles */}
          {Array.from({ length: levels }).map((_, i) => {
            const r = ((i + 1) / levels) * radius;
            return (
              <circle
                key={`circle-${i}`}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#e7e9e8"
                strokeWidth="1"
              />
            );
          })}

          {/* Grid lines (radial) */}
          {skills.map((_, i) => {
            const angle = getAngle(i);
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={`line-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#e7e9e8"
                strokeWidth="1"
              />
            );
          })}

          {/* Average polygon (dotted comparison line) */}
          <polygon
            points={avgPoints}
            fill="none"
            stroke="#8a8f94"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />

          {/* User skill polygon */}
          <polygon
            points={userPoints}
            fill="#7f9f85"
            fillOpacity="0.2"
            stroke="#7f9f85"
            strokeWidth="2"
          />

          {/* Skill labels and values */}
          {skills.map((skill, i) => {
            const angle = getAngle(i);
            const labelRadius = radius + 25;
            const labelX = center + labelRadius * Math.cos(angle);
            const labelY = center + labelRadius * Math.sin(angle);

            const coords = getCoordinates(skill.value, angle);

            return (
              <g key={`skill-${i}`}>
                {/* Skill label */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#252a2e"
                >
                  {skill.label}
                </text>

                {/* Value dot */}
                <circle cx={coords.x} cy={coords.y} r="4" fill="#7f9f85" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#7f9f85]" />
          <span className="text-xs text-[#252a2e] font-medium">شما</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 border-2 border-[#8a8f94]"
            style={{ borderStyle: "dashed" }}
          />
          <span className="text-xs text-[#252a2e] font-medium">
            میانگین بازیکنان هم‌سطح
          </span>
        </div>
      </div>
    </div>
  );
}
