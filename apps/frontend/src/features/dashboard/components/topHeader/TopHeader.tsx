"use client";

import React, { useEffect, useMemo } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DashboardPageHeader from "@/shared/components/dashboardPageHeader";
import { DatePicker, type DateRange } from "@/shared/components/datePicker";

function formatQueryDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseQueryDate(value: string | null): Date | undefined {
  if (!value) return undefined;

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedRange = useMemo<DateRange | undefined>(() => {
    const from = parseQueryDate(searchParams.get("from"));
    const to = parseQueryDate(searchParams.get("to"));

    if (!from || !to) return undefined;

    return { from, to };
  }, [searchParams]);

  useEffect(() => {
    if (selectedRange) return;

    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 29);

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", formatQueryDate(from));
    params.set("to", formatQueryDate(today));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, selectedRange]);

  const handleDateChange = (value: Date | DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    const range = value as DateRange | undefined;

    if (!range?.from || !range.to) {
      params.delete("from");
      params.delete("to");
    } else {
      params.set("from", formatQueryDate(range.from));
      params.set("to", formatQueryDate(range.to));
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div dir="rtl" className="mb-8 pt-8">
      <DashboardPageHeader
        title="پیشرفت و تحلیل"
        subtitle="عملکرد خود را بررسی کنید و نقاط قوت خود را تقویت کنید."
        titleClassName="text-3xl"
        subtitleClassName="mt-2 text-sm text-[#8a8f94]"
        actionsClassName="self-start lg:self-center"
        className="rounded-[28px] border-[#e7e9e8] shadow-[0_18px_60px_-46px_rgba(36,38,43,0.35)]"
        actions={
          <DatePicker
            mode="range"
            selected={selectedRange}
            onSelect={handleDateChange}
            align="right"
            renderTrigger={({ getDisplayText, onClick }) => (
              <button
                type="button"
                onClick={onClick}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-[#e7e9e8] bg-white px-4 py-2 transition-all hover:bg-[#fafafa]"
              >
                <span className="text-sm text-[#252a2e]">
                  {getDisplayText()}
                </span>
                <Calendar className="w-4 h-4 text-[#8a8f94]" />
                <ChevronDown className="w-4 h-4 text-[#8a8f94]" />
              </button>
            )}
          />
        }
      />
    </div>
  );
}
