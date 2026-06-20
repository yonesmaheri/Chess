import type { Locale } from "date-fns";
import {
  addDays as addDaysJalali,
  addMonths as addMonthsJalali,
  eachDayOfInterval as eachDayOfIntervalJalali,
  endOfMonth as endOfMonthJalali,
  endOfWeek as endOfWeekJalali,
  endOfYear as endOfYearJalali,
  format as formatJalali,
  isBefore as isBeforeJalali,
  isSameDay as isSameDayJalali,
  isSameMonth as isSameMonthJalali,
  isToday as isTodayJalali,
  isWithinInterval as isWithinIntervalJalali,
  startOfMonth as startOfMonthJalali,
  startOfWeek as startOfWeekJalali,
  startOfYear as startOfYearJalali,
  subDays as subDaysJalali,
  subMonths as subMonthsJalali,
} from "date-fns-jalali";
import { faIR as faIRJalali } from "date-fns-jalali/locale";

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(text: string): string {
  return text.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export type CalendarApi = {
  format: (date: Date, pattern: string) => string;
  addMonths: (date: Date, amount: number) => Date;
  subMonths: (date: Date, amount: number) => Date;
  startOfMonth: (date: Date) => Date;
  endOfMonth: (date: Date) => Date;
  startOfWeek: (date: Date, options?: { locale?: Locale }) => Date;
  endOfWeek: (date: Date, options?: { locale?: Locale }) => Date;
  eachDayOfInterval: (interval: { start: Date; end: Date }) => Date[];
  isSameDay: (left: Date, right: Date) => boolean;
  isSameMonth: (left: Date, right: Date) => boolean;
  isToday: (date: Date) => boolean;
  isWithinInterval: (
    date: Date,
    interval: { start: Date; end: Date },
  ) => boolean;
  subDays: (date: Date, amount: number) => Date;
  startOfYear: (date: Date) => Date;
  endOfYear: (date: Date) => Date;
  isBefore: (left: Date, right: Date) => boolean;
  addDays: (date: Date, amount: number) => Date;
  locale: Locale;
};

export function getCalendarApi(): CalendarApi {
  return {
    format: (date, pattern) =>
      toPersianDigits(formatJalali(date, pattern, { locale: faIRJalali })),
    addMonths: addMonthsJalali,
    subMonths: subMonthsJalali,
    startOfMonth: startOfMonthJalali,
    endOfMonth: endOfMonthJalali,
    startOfWeek: (date, options) =>
      startOfWeekJalali(date, { locale: options?.locale ?? faIRJalali }),
    endOfWeek: (date, options) =>
      endOfWeekJalali(date, { locale: options?.locale ?? faIRJalali }),
    eachDayOfInterval: eachDayOfIntervalJalali,
    isSameDay: isSameDayJalali,
    isSameMonth: isSameMonthJalali,
    isToday: isTodayJalali,
    isWithinInterval: isWithinIntervalJalali,
    subDays: subDaysJalali,
    startOfYear: startOfYearJalali,
    endOfYear: endOfYearJalali,
    isBefore: isBeforeJalali,
    addDays: addDaysJalali,
    locale: faIRJalali,
  };
}
