"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { getCalendarApi } from "@/shared/lib/date";
import { cn } from "@/shared/lib/utils";

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface DatePickerProps {
  mode?: "single" | "range";
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  align?: "left" | "right" | "center";
  /** Stack layout and single calendar below lg; desktop popover unchanged. */
  responsive?: boolean;
  renderTrigger?: (props: {
    isOpen: boolean;
    getDisplayText: () => string;
    onClick: () => void;
  }) => React.ReactNode;
}

const alignMap = {
  left: "start",
  center: "center",
  right: "end",
} as const;

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  className,
  placeholder,
  align = "center",
  responsive = false,
  renderTrigger,
}: DatePickerProps) {
  const isRangeMode = mode === "range";
  const calendar = useMemo(() => getCalendarApi(), []);
  const displayPatterns = useMemo(
    () => ({
      single: "d MMMM yyyy",
      dayMonth: "d MMMM",
      rangeEnd: "d MMMM yyyy",
    }),
    [],
  );
  const resolvedPlaceholder = placeholder ?? "انتخاب تاریخ";

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelected, setTempSelected] = useState<
    Date | DateRange | undefined
  >(selected);

  useEffect(() => {
    setTempSelected(selected);
    const nextMonth =
      mode === "single"
        ? (selected as Date | undefined)
        : (selected as DateRange | undefined)?.from;

    if (nextMonth) {
      setCurrentMonth(calendar.startOfMonth(nextMonth));
    }
  }, [calendar, mode, selected]);

  const quickSelectOptions = useMemo(
    () =>
      !isRangeMode
        ? []
        : [
            {
              id: "today",
              label: "امروز",
              getValue: () => ({ from: new Date(), to: new Date() }),
            },
            {
              id: "yesterday",
              label: "دیروز",
              getValue: () => ({
                from: calendar.subDays(new Date(), 1),
                to: calendar.subDays(new Date(), 1),
              }),
            },
            {
              id: "last7Days",
              label: "۷ روز اخیر",
              getValue: () => ({
                from: calendar.subDays(new Date(), 6),
                to: new Date(),
              }),
            },
            {
              id: "last30Days",
              label: "۳۰ روز اخیر",
              getValue: () => ({
                from: calendar.subDays(new Date(), 29),
                to: new Date(),
              }),
            },
            {
              id: "thisMonth",
              label: "این ماه",
              getValue: () => ({
                from: calendar.startOfMonth(new Date()),
                to: new Date(),
              }),
            },
            {
              id: "lastMonth",
              label: "ماه گذشته",
              getValue: () => {
                const lastMonth = calendar.subMonths(new Date(), 1);
                return {
                  from: calendar.startOfMonth(lastMonth),
                  to: calendar.endOfMonth(lastMonth),
                };
              },
            },
            {
              id: "thisYear",
              label: "امسال",
              getValue: () => ({
                from: calendar.startOfYear(new Date()),
                to: calendar.endOfYear(new Date()),
              }),
            },
          ],
    [calendar, isRangeMode],
  );

  const weekDayLabels = useMemo(() => {
    const start = calendar.startOfWeek(new Date(), { locale: calendar.locale });
    return calendar
      .eachDayOfInterval({ start, end: calendar.addDays(start, 6) })
      .map((day) => calendar.format(day, "EEEEEE"));
  }, [calendar]);

  const formatDate = (date: Date, pattern: string) =>
    calendar.format(date, pattern);
  const selectedRange = isRangeMode
    ? (tempSelected as DateRange | undefined)
    : undefined;

  const handleApply = () => {
    onSelect?.(tempSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selected);
    setOpen(false);
  };

  const handleDayClick = (day: Date) => {
    if (!isRangeMode) {
      setTempSelected(day);
    } else {
      const range = selectedRange || {
        from: undefined,
        to: undefined,
      };
      if (!range.from || (range.from && range.to)) {
        setTempSelected({ from: day, to: undefined });
      } else if (range.from && !range.to) {
        if (calendar.isBefore(day, range.from)) {
          setTempSelected({ from: day, to: range.from });
        } else {
          setTempSelected({ from: range.from, to: day });
        }
      }
    }
  };

  const renderCalendar = (month: Date, isSecondCalendar = false) => {
    const start = calendar.startOfWeek(calendar.startOfMonth(month), {
      locale: calendar.locale,
    });
    const end = calendar.endOfWeek(calendar.endOfMonth(month), {
      locale: calendar.locale,
    });
    const days = calendar.eachDayOfInterval({ start, end });

    return (
      <div className={cn("w-full", responsive ? "lg:w-[280px]" : "w-[280px]")}>
        <div className="flex items-center justify-between mb-4 px-2">
          {!isSecondCalendar || mode === "single" ? (
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(calendar.subMonths(currentMonth, 1))
              }
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <div className="w-8" />
          )}

          <span className="text-sm font-semibold text-foreground">
            {formatDate(month, "MMMM yyyy")}
          </span>

          {isSecondCalendar || mode === "single" ? (
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(calendar.addMonths(currentMonth, 1))
              }
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>
        <div className="grid grid-cols-7">
          {weekDayLabels.map((day, index) => (
            <div
              key={index}
              className="py-3 text-center text-[12px] font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = calendar.isSameMonth(day, month);
            const isSelected =
              mode === "single"
                ? calendar.isSameDay(day, tempSelected as Date)
                : (selectedRange?.from &&
                    calendar.isSameDay(day, selectedRange.from)) ||
                  (selectedRange?.to &&
                    calendar.isSameDay(day, selectedRange.to));

            const isInRange =
              isRangeMode &&
              selectedRange?.from &&
              selectedRange?.to &&
              calendar.isWithinInterval(day, {
                start: selectedRange.from,
                end: selectedRange.to,
              });

            const isRangeStart =
              isRangeMode &&
              selectedRange?.from &&
              calendar.isSameDay(day, selectedRange.from);
            const isRangeEnd =
              isRangeMode &&
              selectedRange?.to &&
              calendar.isSameDay(day, selectedRange.to);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative flex h-10 items-center justify-center",
                  !isCurrentMonth && "text-muted-foreground/40",
                  isInRange && "bg-accent/60",
                  isRangeStart && selectedRange?.to && "rounded-l-full",
                  isRangeEnd && "rounded-r-full",
                )}
              >
                <button
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                    isSelected
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "font-medium text-foreground hover:bg-muted",
                    calendar.isToday(day) &&
                      !isSelected &&
                      "text-primary underline underline-offset-4",
                  )}
                >
                  {calendar.format(day, "d")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getDisplayText = () => {
    if (!selected) return resolvedPlaceholder;
    if (mode === "single") {
      return formatDate(selected as Date, displayPatterns.single);
    }
    const range = selected as DateRange;
    if (!range.from) return resolvedPlaceholder;
    if (!range.to) {
      return `${formatDate(range.from, displayPatterns.dayMonth)} – تا`;
    }

    const fromStr = formatDate(range.from, displayPatterns.dayMonth);
    const toStr = formatDate(range.to, displayPatterns.rangeEnd);
    return `${fromStr} – ${toStr}`;
  };

  const isQuickSelectActive = (opt: (typeof quickSelectOptions)[0]) => {
    if (!isRangeMode || !selectedRange) return false;
    const val = opt.getValue();
    if (!val) return false;
    return (
      selectedRange.from &&
      selectedRange.to &&
      val.from &&
      val.to &&
      calendar.isSameDay(selectedRange.from, val.from) &&
      calendar.isSameDay(selectedRange.to, val.to)
    );
  };

  const selectedSummaryText = (() => {
    if (
      tempSelected &&
      isRangeMode &&
      selectedRange?.from &&
      selectedRange?.to
    ) {
      return `${formatDate(selectedRange.from, displayPatterns.dayMonth)} – ${formatDate(selectedRange.to, displayPatterns.rangeEnd)}`;
    }
    if (tempSelected && mode === "single") {
      return formatDate(tempSelected as Date, displayPatterns.single);
    }
    return "انتخاب تاریخ";
  })();

  const selectedDayCount =
    isRangeMode && selectedRange?.from && selectedRange?.to
      ? calendar.eachDayOfInterval({
          start: selectedRange.from,
          end: selectedRange.to,
        }).length
      : null;

  const defaultTrigger = (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer flex-row items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors hover:bg-muted",
        className,
      )}
    >
      <CalendarIcon size={16} className="shrink-0 text-muted-foreground" />
      <span className="font-medium whitespace-nowrap">{getDisplayText()}</span>
    </button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {renderTrigger
          ? renderTrigger({
              isOpen: open,
              getDisplayText,
              onClick: () => setOpen((prev) => !prev),
            })
          : defaultTrigger}
      </PopoverTrigger>

      <PopoverContent
        align={alignMap[align]}
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          "flex gap-0 overflow-hidden rounded-2xl border border-border bg-popover p-0 text-popover-foreground shadow-md ring-0",
          responsive
            ? "w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col lg:max-w-none lg:w-auto lg:flex-row"
            : "w-auto max-w-[calc(100vw-2rem)] flex-row",
        )}
      >
        {isRangeMode ? (
          <div
            className={cn(
              "shrink-0 bg-muted/30 p-3",
              responsive
                ? "w-full border-b border-border lg:w-[180px] lg:border-r lg:border-b-0"
                : "w-[180px] border-r border-border",
            )}
          >
            <div
              className={cn(
                "px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
                responsive && "hidden lg:block",
              )}
            >
              انتخاب سریع
            </div>
            <div
              className={cn(
                responsive
                  ? "flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:pb-0"
                  : "space-y-1",
              )}
            >
              {quickSelectOptions.map((opt) => {
                const value = opt.getValue();

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTempSelected(value);
                      setCurrentMonth(calendar.startOfMonth(value.from));
                    }}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      responsive &&
                        "shrink-0 whitespace-nowrap lg:w-full lg:shrink lg:whitespace-normal",
                      !responsive && "w-full",
                      isQuickSelectActive(opt)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col flex-1">
          <div
            className={cn(
              "flex p-6 gap-10",
              responsive &&
                "max-h-[min(50vh,24rem)] overflow-y-auto p-4 gap-4 flex-col lg:max-h-none lg:overflow-visible lg:flex-row lg:p-6 lg:gap-10",
            )}
          >
            {renderCalendar(currentMonth)}
            {mode === "range" &&
              (responsive ? (
                <div className="hidden lg:block">
                  {renderCalendar(calendar.addMonths(currentMonth, 1), true)}
                </div>
              ) : (
                renderCalendar(calendar.addMonths(currentMonth, 1), true)
              ))}
          </div>

          <div
            className={cn(
              "flex items-center justify-between border-t border-border bg-background p-5",
              responsive &&
                "flex-col items-stretch gap-4 p-4 lg:flex-row lg:items-center lg:gap-0 lg:p-5",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
                <CalendarIcon size={22} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-foreground">
                  {selectedSummaryText}
                </div>
                {selectedDayCount !== null ? (
                  <div className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {`${new Intl.NumberFormat("fa-IR").format(selectedDayCount)} روز`}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={cn("flex gap-3", responsive && "w-full lg:w-auto")}>
              <button
                type="button"
                onClick={handleCancel}
                className={cn(
                  "rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted",
                  responsive && "flex-1 lg:flex-none",
                )}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleApply}
                className={cn(
                  "rounded-xl bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                  responsive && "flex-1 lg:flex-none",
                )}
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
