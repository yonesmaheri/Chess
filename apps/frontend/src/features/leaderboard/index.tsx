"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuth } from "@/shared/contexts/auth-provider";
import { LEADERBOARD_MODES } from "./lib/constants";
import { useLeaderboard } from "./lib/useLeaderboard";
import {
  buildLeaderboardUrl,
  formatPersianNumber,
  parseLeaderboardMode,
  parseLeaderboardPage,
} from "./lib/utils";
import LeaderboardCurrentUserCard from "./components/LeaderboardCurrentUserCard";
import LeaderboardHeader from "./components/LeaderboardHeader";
import LeaderboardModeSwitcher from "./components/LeaderboardModeSwitcher";
import LeaderboardPagination from "./components/LeaderboardPagination";
import LeaderboardTable from "./components/LeaderboardTable";
import LeaderboardTopCard from "./components/LeaderboardTopCard";
import type { LeaderboardMode } from "./types";

export function LeaderboardPageFeature() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState<LeaderboardMode>(() =>
    parseLeaderboardMode(searchParams.get("mode")),
  );
  const [page, setPage] = useState(() =>
    parseLeaderboardPage(searchParams.get("page")),
  );
  const config = LEADERBOARD_MODES[mode];
  const { data, error, isError, isFetching, isLoading } = useLeaderboard({
    mode,
    page,
  });

  useEffect(() => {
    setMode(parseLeaderboardMode(searchParams.get("mode")));
    setPage(parseLeaderboardPage(searchParams.get("page")));
  }, [searchParams]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setMode(parseLeaderboardMode(params.get("mode")));
      setPage(parseLeaderboardPage(params.get("page")));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const syncUrl = (nextMode: LeaderboardMode, nextPage: number) => {
    const nextUrl = buildLeaderboardUrl(
      pathname,
      window.location.search,
      nextMode,
      nextPage,
    );

    window.history.replaceState(null, "", nextUrl);
  };

  const handleModeChange = (nextMode: LeaderboardMode) => {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setPage(1);
    syncUrl(nextMode, 1);
  };

  const handlePageChange = (nextPage: number) => {
    const totalPages = data?.totalPages ?? 1;
    const safePage = Math.max(1, Math.min(totalPages, nextPage));

    if (safePage === page) {
      return;
    }

    setPage(safePage);
    syncUrl(mode, safePage);
  };

  useEffect(() => {
    if (!data || data.currentPage === page) {
      return;
    }

    setPage(data.currentPage);
    syncUrl(mode, data.currentPage);
  }, [data, mode, page, pathname]);

  const topThree = data?.topThree ?? [];
  const rows = data?.players ?? [];
  const totalItems = data?.totalItems ?? 0;
  const currentPage = data?.currentPage ?? page;
  const totalPages = data?.totalPages ?? 1;
  const startRank = data?.startRank ?? 0;
  const endRank = data?.endRank ?? 0;
  const visibleCount = rows.length;
  const showTopThree = topThree.length >= 3;
  const showInitialLoading = isLoading && !data;
  const isRefreshing = isFetching && !showInitialLoading;
  const errorMessage =
    error instanceof Error
      ? error.message
      : "بارگذاری جدول رده‌بندی با مشکل روبه‌رو شد.";

  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 py-8 sm:px-6 lg:gap-10 lg:px-8 lg:py-12">
        <LeaderboardHeader config={config} />

        <LeaderboardModeSwitcher mode={mode} onModeChange={handleModeChange} />

        <section className="grid gap-5 lg:grid-cols-3 lg:items-end">
          {showTopThree ? (
            <>
              <LeaderboardTopCard player={topThree[1]} position={2} />
              <LeaderboardTopCard player={topThree[0]} position={1} />
              <LeaderboardTopCard player={topThree[2]} position={3} />
            </>
          ) : (
            Array.from({ length: 3 }, (_, index) => (
              <Skeleton
                key={index}
                className="min-h-[252px] rounded-[24px] bg-[#F2F5F1]"
              />
            ))
          )}
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#E8E8E3] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
          {isError && !data ? (
            <div className="px-6 py-5 text-sm text-[#9B4B4B]">
              {errorMessage}
            </div>
          ) : (
            <LeaderboardTable rows={rows} isLoading={showInitialLoading} />
          )}

          {!showInitialLoading && !rows.length && !isError ? (
            <div className="border-t border-[#EEF1ED] px-6 py-10 text-center text-sm text-[#7A7F7C]">
              بازیکنی برای این صفحه پیدا نشد.
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-[#EEF1ED] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-[#7A7F7C]">
              نمایش {formatPersianNumber(startRank)} تا{" "}
              {formatPersianNumber(endRank)} از{" "}
              {formatPersianNumber(totalItems)} نفر
            </p>

            <div className="flex flex-col items-end gap-2">
              <LeaderboardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              {isRefreshing ? (
                <p className="text-xs text-[#7A7F7C]">
                  در حال به‌روزرسانی جدول...
                </p>
              ) : null}
            </div>

            <p className="text-sm text-[#7A7F7C]">
              {formatPersianNumber(visibleCount)} بازیکن در این صفحه
            </p>
          </div>
        </section>

        {isAuthenticated && user && data?.currentUser ? (
          <LeaderboardCurrentUserCard
            config={config}
            currentUser={data.currentUser}
            userName={`${user.firstName} ${user.lastName}`}
          />
        ) : null}
      </div>
    </main>
  );
}
