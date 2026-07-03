import type { LeaderboardMode } from "../types";

export function parseLeaderboardMode(value: string | null): LeaderboardMode {
  if (value === "rapid" || value === "puzzle") {
    return value;
  }

  return "blitz";
}

export function parseLeaderboardPage(value: string | null) {
  const page = Number(value);

  if (Number.isInteger(page) && page > 0) {
    return page;
  }

  return 1;
}

export function buildLeaderboardUrl(
  pathname: string,
  search: string,
  mode: LeaderboardMode,
  page: number,
) {
  const params = new URLSearchParams(search);

  if (mode === "blitz") {
    params.delete("mode");
  } else {
    params.set("mode", mode);
  }

  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2);
}

export function formatPersianNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}٪`;
}

export function formatSignedPercent(value: number) {
  return `${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}٪+`;
}

export function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export function buildPlayerProfileHref(username: string) {
  return `/players/${username}`;
}
