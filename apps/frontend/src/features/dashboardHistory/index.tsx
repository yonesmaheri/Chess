"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BrainCircuit,
  CalendarDays,
  Clock3,
  Eye,
  History,
  Minus,
  Percent,
  Swords,
  Trophy,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type GameResult = "win" | "draw" | "loss";
type GameCategory = "rapid" | "blitz" | "bullet";

type GameHistoryItem = {
  id: number;
  opponent: string;
  opponentRating: number;
  playerRating: number;
  result: GameResult;
  category: GameCategory;
  moves: number;
  duration: string;
  playedAt: string;
  ratingDiff: number;
  opening: string;
  fen: string;
};

type SummaryMetric = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const games: GameHistoryItem[] = [
  {
    id: 1,
    opponent: "Armin_Chess",
    opponentRating: 1783,
    playerRating: 1812,
    result: "win",
    category: "rapid",
    moves: 38,
    duration: "15:32",
    playedAt: "1403/02/28",
    ratingDiff: 12,
    opening: "گامبی وزیر",
    fen: "r1bq1rk1/pp3ppp/2n2n2/2bp4/2B5/2NP1N2/PPP2PPP/R1BQ1RK1",
  },
  {
    id: 2,
    opponent: "Parsa_1375",
    opponentRating: 1751,
    playerRating: 1800,
    result: "win",
    category: "rapid",
    moves: 44,
    duration: "22:18",
    playedAt: "1403/02/26",
    ratingDiff: 12,
    opening: "سیسیلی",
    fen: "r2q1rk1/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PPQ2PPP/R1B2RK1",
  },
  {
    id: 3,
    opponent: "Mahdi_Chess99",
    opponentRating: 1802,
    playerRating: 1788,
    result: "loss",
    category: "blitz",
    moves: 29,
    duration: "18:47",
    playedAt: "1403/02/24",
    ratingDiff: -9,
    opening: "دفاع اسلاو",
    fen: "2rq1rk1/1p3ppp/p1n1pn2/3p4/3P4/2N1PN2/PPQ2PPP/2RR2K1",
  },
  {
    id: 4,
    opponent: "Pouya_Chess",
    opponentRating: 1728,
    playerRating: 1797,
    result: "win",
    category: "bullet",
    moves: 52,
    duration: "31:05",
    playedAt: "1403/02/22",
    ratingDiff: 12,
    opening: "کاروکان",
    fen: "6k1/5pp1/2p4p/1pP5/1P2P3/3Q1PP1/5K1P/8",
  },
  {
    id: 5,
    opponent: "Sina_Eagle",
    opponentRating: 1770,
    playerRating: 1809,
    result: "win",
    category: "rapid",
    moves: 34,
    duration: "27:14",
    playedAt: "1403/02/20",
    ratingDiff: 12,
    opening: "ایتالیایی",
    fen: "r1b2rk1/ppq2ppp/2n1pn2/2bp4/2P5/2N1PN2/PPQ2PPP/R1B2RK1",
  },
  {
    id: 6,
    opponent: "Alireza_Chess",
    opponentRating: 1689,
    playerRating: 1821,
    result: "win",
    category: "blitz",
    moves: 41,
    duration: "19:33",
    playedAt: "1403/02/18",
    ratingDiff: 12,
    opening: "دفاع فرانسوی",
    fen: "5rk1/pp3pp1/2p4p/3p4/3P4/1P3P2/P4KPP/3R4",
  },
  {
    id: 7,
    opponent: "HamedChess",
    opponentRating: 1744,
    playerRating: 1815,
    result: "draw",
    category: "rapid",
    moves: 47,
    duration: "24:09",
    playedAt: "1403/02/16",
    ratingDiff: 0,
    opening: "دفاع هندی شاه",
    fen: "8/5pk1/2p3p1/1p2p2p/1P2P2P/2P3P1/5PK1/8",
  },
];

const resultOptions = [
  { value: "all", label: "همه نتایج" },
  { value: "win", label: "برد" },
  { value: "draw", label: "مساوی" },
  { value: "loss", label: "باخت" },
] as const;

const categoryOptions = [
  { value: "all", label: "همه انواع" },
  { value: "rapid", label: "رپید" },
  { value: "blitz", label: "بلیتز" },
  { value: "bullet", label: "بولت" },
] as const;

type ResultFilter = (typeof resultOptions)[number]["value"];
type CategoryFilter = (typeof categoryOptions)[number]["value"];

const pieceMap: Record<string, string> = {
  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
};

function parseBoard(fen: string) {
  return fen
    .split(" ")[0]
    .split("/")
    .flatMap((row) =>
      row.split("").flatMap((cell) => {
        if (/\d/.test(cell)) {
          return Array.from({ length: Number(cell) }, () => "");
        }

        return pieceMap[cell] ?? "";
      }),
    );
}

function getInitials(name: string) {
  return (
    name
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "CH"
  );
}

function parseDurationToSeconds(value: string) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function formatSeconds(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part, index) =>
      index === 0 ? String(part) : String(part).padStart(2, "0"),
    )
    .join(":");
}

function getResultMeta(result: GameResult) {
  if (result === "win") {
    return {
      label: "برد",
      description: "برد با بازی خوب",
      textClass: "text-[#6f8f76]",
      badgeClass: "bg-[#eef5ef] text-[#55715d]",
    };
  }

  if (result === "draw") {
    return {
      label: "مساوی",
      description: "بازی متعادل",
      textClass: "text-[#8a8f94]",
      badgeClass: "bg-[#f4f5f5] text-[#6b7176]",
    };
  }

  return {
    label: "باخت",
    description: "نیاز به تحلیل بیشتر",
    textClass: "text-[#d25555]",
    badgeClass: "bg-[#fff1f1] text-[#c44b4b]",
  };
}

function getCategoryLabel(category: GameCategory) {
  const labels: Record<GameCategory, string> = {
    rapid: "رپید",
    blitz: "بلیتز",
    bullet: "بولت",
  };

  return labels[category];
}

function MiniBoard({ fen }: { fen: string }) {
  const squares = parseBoard(fen);

  return (
    <div className="grid h-24 w-24 grid-cols-8 overflow-hidden rounded-2xl border border-[#d7dccc] shadow-inner sm:h-28 sm:w-28">
      {squares.map((piece, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const isDark = (row + col) % 2 === 1;

        return (
          <div
            key={`${index}-${piece || "empty"}`}
            className={`flex items-center justify-center text-[10px] leading-none sm:text-xs ${
              isDark
                ? "bg-[#91ab70] text-[#1f2a18]"
                : "bg-[#f4f0d1] text-[#6b5d40]"
            }`}
          >
            {piece}
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[18px] border border-[#e7e9e8] bg-[#fbfcfb] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[#8a8f94]">{title}</p>
          <p className="mt-2 text-xl font-bold text-[#252a2e]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf5ef] text-[#7f9f85]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-xs text-[#8a8f94]">{subtitle}</p>
    </div>
  );
}

function MetricRow({ label, value, icon: Icon }: SummaryMetric) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#eef0ef] py-3 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm text-[#5f666b]">
        <Icon className="h-4 w-4 text-[#8a8f94]" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#252a2e]">{value}</span>
    </div>
  );
}

function GameCard({ game }: { game: GameHistoryItem }) {
  const resultMeta = getResultMeta(game.result);
  const ratingDiffClass =
    game.ratingDiff > 0
      ? "text-[#6f8f76]"
      : game.ratingDiff < 0
        ? "text-[#d25555]"
        : "text-[#8a8f94]";

  const ratingDiffLabel =
    game.ratingDiff > 0 ? `+${game.ratingDiff}` : String(game.ratingDiff);

  return (
    <article className="rounded-[22px] border border-[#e7e9e8] bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 md:grid-cols-[132px_minmax(0,1fr)_112px] md:items-center">
        <div className="order-3 flex flex-col gap-2 md:order-1">
          <Button
            type="button"
            className="h-10 rounded-xl bg-[#86a98f] text-white hover:bg-[#769880]"
          >
            <Eye className="h-4 w-4" />
            بررسی بازی
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-[#d9ddda] bg-white text-[#3d4348] hover:bg-[#f8f8f8]"
          >
            <BrainCircuit className="h-4 w-4" />
            تحلیل با موتور
          </Button>
        </div>

        <div className="order-2 min-w-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7176]">
              <div className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-[#8a8f94]" />
                <span>{game.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-[#8a8f94]" />
                <span>{game.playedAt}</span>
              </div>
              <div
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resultMeta.badgeClass}`}
              >
                {getCategoryLabel(game.category)}
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <Avatar size="lg" className="h-12 w-12 border border-[#dfe4df]">
                <AvatarFallback className="bg-[#eef2ef] text-[#536a5a]">
                  {getInitials(game.opponent)}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-base font-bold text-[#252a2e]">
                    {game.opponent}
                  </span>
                  <span className="text-sm text-[#8a8f94]">
                    {game.opponentRating}
                  </span>
                </div>

                <p
                  className={`mt-1 text-sm font-medium ${resultMeta.textClass}`}
                >
                  {resultMeta.label} در {game.moves} حرکت
                </p>

                <div className="mt-1 flex items-center justify-end gap-2 text-xs">
                  <span className="text-[#8a8f94]">{game.opening}</span>
                  <span className={ratingDiffClass}>{ratingDiffLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 flex justify-start md:order-3 md:justify-end">
          <MiniBoard fen={game.fen} />
        </div>
      </div>
    </article>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedResult = useMemo<ResultFilter>(() => {
    const value = searchParams.get("result");

    if (resultOptions.some((option) => option.value === value)) {
      return value as ResultFilter;
    }

    return "all";
  }, [searchParams]);

  const selectedCategory = useMemo<CategoryFilter>(() => {
    const value = searchParams.get("gameType");

    if (categoryOptions.some((option) => option.value === value)) {
      return value as CategoryFilter;
    }

    return "all";
  }, [searchParams]);

  const updateFilters = (next: {
    result?: ResultFilter;
    gameType?: CategoryFilter;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextResult = next.result ?? selectedResult;
    const nextGameType = next.gameType ?? selectedCategory;

    if (nextResult === "all") {
      params.delete("result");
    } else {
      params.set("result", nextResult);
    }

    if (nextGameType === "all") {
      params.delete("gameType");
    } else {
      params.set("gameType", nextGameType);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesResult =
        selectedResult === "all" ? true : game.result === selectedResult;
      const matchesCategory =
        selectedCategory === "all" ? true : game.category === selectedCategory;

      return matchesResult && matchesCategory;
    });
  }, [selectedCategory, selectedResult]);

  const totals = useMemo(() => {
    const winCount = filteredGames.filter(
      (game) => game.result === "win",
    ).length;
    const drawCount = filteredGames.filter(
      (game) => game.result === "draw",
    ).length;
    const lossCount = filteredGames.filter(
      (game) => game.result === "loss",
    ).length;
    const totalSeconds = filteredGames.reduce(
      (sum, game) => sum + parseDurationToSeconds(game.duration),
      0,
    );
    const highestRating = filteredGames.reduce(
      (max, game) => Math.max(max, game.playerRating),
      0,
    );
    const averageMoves = filteredGames.length
      ? Math.round(
          filteredGames.reduce((sum, game) => sum + game.moves, 0) /
            filteredGames.length,
        )
      : 0;
    const ratingDelta = filteredGames.reduce(
      (sum, game) => sum + game.ratingDiff,
      0,
    );
    const winRate = filteredGames.length
      ? Math.round((winCount / filteredGames.length) * 100)
      : 0;

    return {
      winCount,
      drawCount,
      lossCount,
      totalSeconds,
      highestRating,
      averageMoves,
      ratingDelta,
      winRate,
    };
  }, [filteredGames]);

  const summaryMetrics: SummaryMetric[] = [
    {
      label: "بالاترین ریتینگ",
      value: String(totals.highestRating || 0),
      icon: Trophy,
    },
    {
      label: "میانگین طول بازی",
      value: `${totals.averageMoves} حرکت`,
      icon: Swords,
    },
    {
      label: "مجموع زمان بازی",
      value: formatSeconds(totals.totalSeconds),
      icon: Clock3,
    },
    {
      label: "تغییر ریتینگ",
      value:
        totals.ratingDelta > 0
          ? `+${totals.ratingDelta}`
          : String(totals.ratingDelta),
      icon: History,
    },
  ];

  const progressSegments = [
    {
      key: "wins",
      count: totals.winCount,
      className: "bg-[#79a07d]",
      label: "برد",
    },
    {
      key: "draws",
      count: totals.drawCount,
      className: "bg-[#bfc4c9]",
      label: "مساوی",
    },
    {
      key: "losses",
      count: totals.lossCount,
      className: "bg-[#e06767]",
      label: "باخت",
    },
  ];

  return (
    <div dir="rtl" className="w-full py-8">
      <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-8 xl:self-start">
          <div className="rounded-[24px] border border-[#e7e9e8] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#252a2e]">
                  عملکرد بازی‌ها
                </h2>
                <p className="mt-1 text-sm text-[#8a8f94]">
                  خلاصه بازی‌های فیلتر شده شما
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ef] text-[#7f9f85]">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-full bg-[#eef0ee]">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                {progressSegments.map((segment) => {
                  const width = filteredGames.length
                    ? (segment.count / filteredGames.length) * 100
                    : 0;

                  return (
                    <div
                      key={segment.key}
                      className={segment.className}
                      style={{ width: `${width}%` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-[#79a07d]">
                  {totals.winCount}
                </p>
                <p className="mt-1 text-xs text-[#8a8f94]">برد</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8a8f94]">
                  {totals.drawCount}
                </p>
                <p className="mt-1 text-xs text-[#8a8f94]">مساوی</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#e06767]">
                  {totals.lossCount}
                </p>
                <p className="mt-1 text-xs text-[#8a8f94]">باخت</p>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] bg-[#f7faf8] p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-[#6f8f76]">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">نرخ برد</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-[#252a2e]">
                {totals.winRate}%
              </p>
            </div>

            <div className="mt-6">
              {summaryMetrics.map((metric) => (
                <MetricRow key={metric.label} {...metric} />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-6 h-11 w-full rounded-xl border-[#dadfdb] bg-[#f8f9f8] text-[#3d4348] hover:bg-white"
            >
              مشاهده آمار کامل
            </Button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="rounded-[24px] border border-[#e7e9e8] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ef] text-[#7f9f85]">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#252a2e] sm:text-3xl">
                      بازی‌های من
                    </h1>
                    <p className="mt-1 text-sm text-[#8a8f94]">
                      روند بازی‌های اخیر و نتایج خود را یکجا مرور کنید.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-[420px]">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#8a8f94]">
                    نتیجه
                  </label>
                  <Select
                    value={selectedResult}
                    onValueChange={(value) =>
                      updateFilters({ result: value as ResultFilter })
                    }
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border-[#dde2de] bg-white px-4 text-right text-sm text-[#252a2e]">
                      <SelectValue placeholder="همه نتایج" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="p-1">
                      {resultOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#8a8f94]">
                    نوع بازی
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) =>
                      updateFilters({ gameType: value as CategoryFilter })
                    }
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border-[#dde2de] bg-white px-4 text-right text-sm text-[#252a2e]">
                      <SelectValue placeholder="همه انواع" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="p-1">
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                title="تعداد بازی"
                value={String(filteredGames.length)}
                subtitle="بازی ثبت شده در بازه فعلی"
                icon={History}
              />
              <SummaryCard
                title="بردهای ثبت شده"
                value={String(totals.winCount)}
                subtitle="عملکرد مثبت در فهرست فعلی"
                icon={Trophy}
              />
              <SummaryCard
                title="بازی‌های مساوی"
                value={String(totals.drawCount)}
                subtitle="بازی‌هایی با نتیجه متعادل"
                icon={Minus}
              />
              <SummaryCard
                title="تحلیل‌های پیشنهادی"
                value={String(
                  filteredGames.filter((game) => game.result !== "win").length,
                )}
                subtitle="بازی مناسب برای بررسی بیشتر"
                icon={BrainCircuit}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#d9ddda] bg-white p-10 text-center text-sm text-[#8a8f94] shadow-sm">
                نتیجه‌ای با این فیلترها پیدا نشد.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
