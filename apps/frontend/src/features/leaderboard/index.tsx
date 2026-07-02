"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  Crown,
  Puzzle,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import { useAuth } from "@/shared/contexts/auth-provider";
import { cn } from "@/shared/lib/utils";
import { formatPersianNumber } from "@/features/courses/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

type LeaderboardMode = "blitz" | "rapid" | "puzzle";

type LeaderboardPlayer = {
  rank: number;
  name: string;
  elo: number;
  winRate: number;
  trend: number;
  verified?: boolean;
};

type LeaderboardModeConfig = {
  label: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
  chipClassName: string;
  topThree: Array<
    Omit<LeaderboardPlayer, "rank"> & {
      ringClassName: string;
      badgeClassName: string;
    }
  >;
  currentUser: {
    rank: number;
    elo: number;
    winRate: number;
    trend: number;
  };
};

const PAGE_SIZE = 7;

const NAME_POOL = [
  "مهرداد علیزاده",
  "رضا محمدی",
  "بردیا منصوری",
  "امیرحسین بهرامی",
  "نیما رضایی",
  "علیرضا کریمی",
  "علی صادقی",
  "آرین نیکو",
  "امیررضا شریفی",
  "پارسا حیدری",
  "مهدی کریمی",
  "محمدطاها حسینی",
  "نیما امیری",
  "حسام موسوی",
  "امیرعلی شفیعی",
  "یاسین امیدی",
  "فربد رستمی",
  "آراد زمانی",
  "امیرمحمد کاوه",
  "محمدمهدی قاسمی",
  "عرفان شجاعی",
  "طاها باقری",
  "سامیار رفیعی",
  "سینا صفری",
  "آبتین مرادی",
  "یونس عطایی",
  "پویا هدایت",
  "بنیامین درویشی",
  "احسان کیانی",
  "عرفان جمشیدی",
];

const LEADERBOARD_MODES: Record<LeaderboardMode, LeaderboardModeConfig> = {
  blitz: {
    label: "بلیتس",
    subtitle: "۵ دقیقه",
    description: "رقابت سریع با بیشترین حجم بازی در هفته جاری",
    icon: Zap,
    accentClassName:
      "border-[#CFE0D2] bg-[linear-gradient(135deg,#5C8167_0%,#7E9E85_100%)] text-white shadow-[0_24px_52px_rgba(72,101,84,0.24)]",
    chipClassName: "border-[#DCE8E0] bg-[#F7FAF7] text-[#486554]",
    topThree: [
      {
        name: "پارسا فرید",
        elo: 2876,
        winRate: 68.4,
        trend: 2.1,
        verified: true,
        ringClassName:
          "border-[#E0B348] shadow-[0_18px_40px_rgba(198,154,66,0.24)]",
        badgeClassName: "bg-[#E0B348] text-white",
      },
      {
        name: "آرمان نیکو",
        elo: 2741,
        winRate: 65.2,
        trend: 1.8,
        verified: true,
        ringClassName:
          "border-[#C7CDD5] shadow-[0_16px_36px_rgba(118,125,132,0.18)]",
        badgeClassName: "bg-[#9AA3AD] text-white",
      },
      {
        name: "سینا رستگار",
        elo: 2689,
        winRate: 63.9,
        trend: 1.5,
        verified: true,
        ringClassName:
          "border-[#D29C63] shadow-[0_16px_36px_rgba(157,104,54,0.18)]",
        badgeClassName: "bg-[#C98348] text-white",
      },
    ],
    currentUser: {
      rank: 542,
      elo: 1823,
      winRate: 48.6,
      trend: 1.4,
    },
  },
  rapid: {
    label: "رپید",
    subtitle: "۱۰ دقیقه",
    description: "جایگاه بازیکنان برتر در مسابقات زمان متوسط",
    icon: Clock3,
    accentClassName:
      "border-[#D7DFEA] bg-[linear-gradient(135deg,#5B6D8A_0%,#7E91B0_100%)] text-white shadow-[0_24px_52px_rgba(91,109,138,0.24)]",
    chipClassName: "border-[#E3E8F2] bg-[#F8FAFE] text-[#5B6D8A]",
    topThree: [
      {
        name: "شایان دادگر",
        elo: 2812,
        winRate: 67.1,
        trend: 1.9,
        verified: true,
        ringClassName:
          "border-[#E0B348] shadow-[0_18px_40px_rgba(198,154,66,0.24)]",
        badgeClassName: "bg-[#E0B348] text-white",
      },
      {
        name: "امیرسام مهرجو",
        elo: 2764,
        winRate: 65.8,
        trend: 1.5,
        verified: true,
        ringClassName:
          "border-[#C7CDD5] shadow-[0_16px_36px_rgba(118,125,132,0.18)]",
        badgeClassName: "bg-[#9AA3AD] text-white",
      },
      {
        name: "بردیا زمانی",
        elo: 2718,
        winRate: 64.6,
        trend: 1.4,
        verified: true,
        ringClassName:
          "border-[#D29C63] shadow-[0_16px_36px_rgba(157,104,54,0.18)]",
        badgeClassName: "bg-[#C98348] text-white",
      },
    ],
    currentUser: {
      rank: 318,
      elo: 1962,
      winRate: 51.3,
      trend: 1.1,
    },
  },
  puzzle: {
    label: "پازل",
    subtitle: "همه زمان‌ها",
    description: "برترین حل‌کنندگان تمرین‌ها و معماهای تاکتیکی",
    icon: Puzzle,
    accentClassName:
      "border-[#E6DCC7] bg-[linear-gradient(135deg,#7D6844_0%,#A48A5D_100%)] text-white shadow-[0_24px_52px_rgba(125,104,68,0.24)]",
    chipClassName: "border-[#EFE6D7] bg-[#FCFAF6] text-[#7D6844]",
    topThree: [
      {
        name: "پوریا فرهی",
        elo: 3016,
        winRate: 72.2,
        trend: 2.5,
        verified: true,
        ringClassName:
          "border-[#E0B348] shadow-[0_18px_40px_rgba(198,154,66,0.24)]",
        badgeClassName: "bg-[#E0B348] text-white",
      },
      {
        name: "مهراد فرشاد",
        elo: 2968,
        winRate: 70.8,
        trend: 2.1,
        verified: true,
        ringClassName:
          "border-[#C7CDD5] shadow-[0_16px_36px_rgba(118,125,132,0.18)]",
        badgeClassName: "bg-[#9AA3AD] text-white",
      },
      {
        name: "مانی نظری",
        elo: 2910,
        winRate: 69.1,
        trend: 1.7,
        verified: true,
        ringClassName:
          "border-[#D29C63] shadow-[0_16px_36px_rgba(157,104,54,0.18)]",
        badgeClassName: "bg-[#C98348] text-white",
      },
    ],
    currentUser: {
      rank: 184,
      elo: 2148,
      winRate: 57.9,
      trend: 1.8,
    },
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}٪`;
}

function formatSignedPercent(value: number) {
  return `${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}٪+`;
}

function buildLeaderboardEntries(mode: LeaderboardMode): LeaderboardPlayer[] {
  const config = LEADERBOARD_MODES[mode];
  const modeOffset = mode === "blitz" ? 0 : mode === "rapid" ? 28 : 64;

  const generatedPlayers = Array.from({ length: 70 }, (_, index) => {
    const rank = index + 4;
    const name = NAME_POOL[index % NAME_POOL.length];
    const falloff = (rank - 4) * (mode === "puzzle" ? 9 : 7);
    const elo =
      config.topThree[2].elo - 91 - falloff - (index % 3) * 5 + modeOffset;
    const winRateBase =
      mode === "puzzle" ? 62.8 : mode === "rapid" ? 61.1 : 60.2;
    const winRate = Math.max(45.2, winRateBase - index * 0.23);
    const trend = Math.max(
      0.2,
      1.3 - index * 0.015 + (mode === "puzzle" ? 0.35 : 0),
    );

    return {
      rank,
      name,
      elo,
      winRate,
      trend,
      verified: index % 4 === 0,
    };
  });

  return [
    ...config.topThree.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      elo: player.elo,
      winRate: player.winRate,
      trend: player.trend,
      verified: player.verified,
    })),
    ...generatedPlayers,
  ];
}

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

function IranFlag() {
  return (
    <span className="inline-flex h-5 w-7 overflow-hidden rounded-[4px] border border-[#DCDCDC]">
      <span className="flex-1 bg-[#249F58]" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-[#DA0000]" />
    </span>
  );
}

function LeaderboardTopCard({
  player,
  position,
}: {
  player: LeaderboardModeConfig["topThree"][number];
  position: number;
}) {
  const isFirst = position === 1;

  return (
    <article
      className={cn(
        "relative flex min-h-[252px] flex-col items-center rounded-[24px] border bg-white px-6 py-7 text-center shadow-[0_20px_48px_rgba(31,37,37,0.05)]",
        isFirst ? "order-2 lg:-mt-5" : position === 2 ? "order-1" : "order-3",
        player.ringClassName,
      )}
    >
      <Crown
        className={cn(
          "absolute -top-5 size-9",
          position === 1
            ? "text-[#E0B348]"
            : position === 2
              ? "text-[#9AA3AD]"
              : "text-[#C98348]",
        )}
      />
      <Avatar className="size-24 border-[6px] border-white shadow-[0_12px_30px_rgba(31,37,37,0.14)]">
        <AvatarFallback className="bg-[linear-gradient(135deg,#DAD8D2_0%,#BEB7AA_100%)] text-2xl font-bold text-[#34413B]">
          {getInitials(player.name)}
        </AvatarFallback>
      </Avatar>
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="text-2xl font-extrabold text-[#1F2525]">
            {player.name}
          </h3>
          {player.verified ? (
            <BadgeCheck className="size-5 fill-[#6F9D78] text-[#6F9D78]" />
          ) : null}
        </div>
        <p className="text-sm text-[#7A7F7C]">
          ELO{" "}
          <span className="mr-1 text-[2rem] font-black text-[#1F2525]">
            {formatPersianNumber(player.elo)}
          </span>
        </p>
      </div>
      <div
        className={cn(
          "mt-auto inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold",
          player.badgeClassName,
        )}
      >
        {formatPersianNumber(position)}
      </div>
    </article>
  );
}

export function LeaderboardPageFeature() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const rawMode = searchParams.get("mode");
  const rawPage = searchParams.get("page");
  const mode: LeaderboardMode =
    rawMode === "rapid" || rawMode === "puzzle" ? rawMode : "blitz";
  const config = LEADERBOARD_MODES[mode];
  const entries = buildLeaderboardEntries(mode);
  const totalPages = Math.max(1, Math.ceil((entries.length - 3) / PAGE_SIZE));
  const pageValue = Number(rawPage);
  const currentPage =
    Number.isInteger(pageValue) && pageValue > 0
      ? Math.min(pageValue, totalPages)
      : 1;
  const rows = entries.slice(
    3 + (currentPage - 1) * PAGE_SIZE,
    3 + currentPage * PAGE_SIZE,
  );
  const pageItems = getPageItems(currentPage, totalPages);
  const startRank = rows[0]?.rank ?? 0;
  const endRank = rows[rows.length - 1]?.rank ?? 0;
  const visibleCount = rows.length;

  const buildHref = (nextMode: LeaderboardMode, nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextMode === "blitz") {
      params.delete("mode");
    } else {
      params.set("mode", nextMode);
    }

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 py-8 sm:px-6 lg:gap-10 lg:px-8 lg:py-12">
        <section className="overflow-hidden rounded-[28px] border border-[#E8E8E3] bg-white px-6 py-7 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                  config.chipClassName,
                )}
              >
                <Trophy className="size-4" />
                جدول رده‌بندی
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1F2525] sm:text-4xl">
                  بهترین بازیکنان شطرنج.ir
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#6C726E] sm:text-base">
                  رتبه‌بندی بازیکنان برتر را در بخش‌های مختلف دنبال کنید،
                  تغییرات ELO را ببینید و جایگاه خودتان را با رقبا مقایسه کنید.
                </p>
              </div>
            </div>
            <div className="rounded-[20px] border border-[#E8E8E3] bg-[#F8FAF8] px-5 py-4 text-sm text-[#6C726E]">
              <div className="flex items-center gap-2 font-semibold text-[#1F2525]">
                <Swords className="size-4 text-[#486554]" />
                {config.description}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {(
            Object.entries(LEADERBOARD_MODES) as Array<
              [LeaderboardMode, LeaderboardModeConfig]
            >
          ).map(([modeKey, modeConfig]) => {
            const Icon = modeConfig.icon;
            const isActive = modeKey === mode;

            return (
              <Button
                key={modeKey}
                asChild
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "h-auto rounded-[20px] border px-5 py-5",
                  isActive
                    ? modeConfig.accentClassName
                    : "border-[#E8E8E3] bg-white text-[#1F2525] shadow-[0_14px_34px_rgba(31,37,37,0.035)] hover:bg-[#F8FAF8]",
                )}
              >
                <Link href={buildHref(modeKey, 1)}>
                  <span className="flex w-full items-center justify-between gap-4">
                    <span className="flex flex-col items-start text-right">
                      <span className="text-lg font-bold">
                        {modeConfig.label}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          isActive ? "text-white/80" : "text-[#7A7F7C]",
                        )}
                      >
                        {modeConfig.subtitle}
                      </span>
                    </span>
                    <Icon className="size-6 shrink-0" />
                  </span>
                </Link>
              </Button>
            );
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-3 lg:items-end">
          <LeaderboardTopCard player={config.topThree[1]} position={2} />
          <LeaderboardTopCard player={config.topThree[0]} position={1} />
          <LeaderboardTopCard player={config.topThree[2]} position={3} />
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#E8E8E3] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FCFDFC] hover:bg-[#FCFDFC]">
                <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
                  رتبه
                </TableHead>
                <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
                  بازیکن
                </TableHead>
                <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
                  کشور
                </TableHead>
                <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
                  ELO
                </TableHead>
                <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
                  درصد برد
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((player) => (
                <TableRow key={player.rank} className="hover:bg-[#FAFCFA]">
                  <TableCell className="px-6 py-4 text-right text-lg font-bold text-[#2D3231]">
                    {formatPersianNumber(player.rank)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Avatar className="size-11 border-[3px] border-white shadow-[0_10px_24px_rgba(31,37,37,0.12)]">
                        <AvatarFallback className="bg-[linear-gradient(135deg,#DCD9D1_0%,#BBB2A4_100%)] text-sm font-bold text-[#34413B]">
                          {getInitials(player.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-semibold text-[#1F2525]">
                            {player.name}
                          </span>
                          {player.verified ? (
                            <BadgeCheck className="size-4 fill-[#6F9D78] text-[#6F9D78]" />
                          ) : null}
                        </div>
                        <p className="text-xs text-[#7A7F7C]">
                          بازیکن فعال این بخش
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#E9ECE8] bg-[#FAFCFA] px-3 py-1.5 text-sm text-[#4F5553]">
                      <IranFlag />
                      ایران
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-base font-bold text-[#2D3231]">
                    {formatPersianNumber(player.elo)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="space-y-1">
                      <p className="font-semibold text-[#2D3231]">
                        {formatPercent(player.winRate)}
                      </p>
                      <p className="text-sm font-medium text-[#5E946A]">
                        {formatSignedPercent(player.trend)}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-4 border-t border-[#EEF1ED] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-[#7A7F7C]">
              نمایش {formatPersianNumber(startRank)} تا{" "}
              {formatPersianNumber(endRank)} از{" "}
              {formatPersianNumber(entries.length)} نفر
            </p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    href={buildHref(mode, 1)}
                    aria-label="صفحه اول"
                    className={cn(
                      "border border-transparent",
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  >
                    <ChevronsRight className="size-4" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    href={buildHref(mode, Math.max(1, currentPage - 1))}
                    text="قبلی"
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                {pageItems.map((item, index) => (
                  <PaginationItem key={`${item}-${index}`}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={buildHref(mode, item)}
                        isActive={item === currentPage}
                      >
                        {formatPersianNumber(item)}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={buildHref(
                      mode,
                      Math.min(totalPages, currentPage + 1),
                    )}
                    text="بعدی"
                    className={cn(
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={buildHref(mode, totalPages)}
                    aria-label="صفحه آخر"
                    className={cn(
                      "border border-transparent",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                    )}
                  >
                    <ChevronsLeft className="size-4" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-sm text-[#7A7F7C]">
              {formatPersianNumber(visibleCount)} بازیکن در این صفحه
            </p>
          </div>
        </section>

        {isAuthenticated && user ? (
          <section className="overflow-hidden rounded-[24px] border border-[#D0DDD3] bg-[linear-gradient(135deg,#6F8F78_0%,#8EAD96_100%)] px-6 py-5 text-white shadow-[0_26px_60px_rgba(72,101,84,0.24)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full border border-white/20 bg-white/10 p-3">
                  <Trophy className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">
                    جایگاه شما در {config.label}
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    رتبه شما: #{formatPersianNumber(config.currentUser.rank)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                <div className="text-right">
                  <p className="text-xs text-white/75">درصد برد</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatPercent(config.currentUser.winRate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/75">رشد این دوره</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatSignedPercent(config.currentUser.trend)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/75">ELO</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatPersianNumber(config.currentUser.elo)}
                  </p>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div className="flex items-center gap-3">
                  <IranFlag />
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="size-5 fill-[#BDE3C6] text-[#BDE3C6]" />
                    <span className="font-semibold">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <Avatar className="size-12 border-[3px] border-white/75">
                    <AvatarFallback className="bg-white/15 text-base font-bold text-white">
                      {getInitials(`${user.firstName} ${user.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
