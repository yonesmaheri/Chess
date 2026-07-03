import type { LobbyInviteStatus } from "@/shared/api/services/lobby";

const relativeTimeFormatter = new Intl.RelativeTimeFormat("fa-IR", {
  numeric: "auto",
});

export function getSingleQueryValue(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function getDifficultyDescription(level: number) {
  if (level <= 3) {
    return "آسان";
  }

  if (level <= 6) {
    return "متوسط";
  }

  if (level <= 8) {
    return "سخت";
  }

  return "حرفه‌ای";
}

export function getDifficultySupportingText(level: number) {
  if (level <= 3) {
    return "برای شروع، تمرین افتتاحیه‌ها و بازی‌های آرام مناسب است.";
  }

  if (level <= 6) {
    return "چالشی متعادل برای بازیکنانی که تجربه بازی آنلاین دارند.";
  }

  if (level <= 8) {
    return "برای تمرین دقیق‌تر تاکتیک‌ها و محاسبه در میانه بازی مناسب است.";
  }

  return "فشار بالاتر و تصمیم‌گیری سخت‌تر برای بازیکنان جدی و باتجربه.";
}

export function getInviteStatusLabel(status: LobbyInviteStatus) {
  switch (status) {
    case "accepted":
      return "پذیرفته شده";
    case "rejected":
      return "رد شده";
    case "expired":
      return "منقضی شده";
    default:
      return "فعال";
  }
}

export function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMs / (60 * 60 * 1000));
  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
  return relativeTimeFormatter.format(diffDays, "day");
}
