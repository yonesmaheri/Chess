"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/contexts/auth-provider";
import { SearchAnimation } from "./components/SearchAnimation";
import { PlayerCard } from "./components/PlayerCard";
import { useMatchmaking } from "./lib/useMatchmaking";

export function MatchmakingPageFeature() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { state, start, cancel } = useMatchmaking();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Auto-start matchmaking on mount
  useEffect(() => {
    if (isAuthenticated && state.status === "idle") {
      void start();
    }
  }, [isAuthenticated, state.status, start]);

  // Handle matched state
  useEffect(() => {
    if (state.status === "matched") {
      setShowRedirectMessage(true);
      const redirectTimer = setTimeout(() => {
        // Navigate to game page - to be implemented
        router.push("/game");
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [state.status, router]);

  // Handle error states
  useEffect(() => {
    if (state.status === "cancelled" || state.status === "timeout") {
      const backTimer = setTimeout(() => {
        router.push("/lobby");
      }, 1500);

      return () => clearTimeout(backTimer);
    }
  }, [state.status, router]);

  const isSearching =
    state.status === "searching" || state.status === "starting";
  const isMatched = state.status === "matched";

  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-right">
          <h1 className="text-4xl font-black tracking-tight text-[#1F2525]">
            {isMatched ? "حریف یافت شد!" : "جستجوی حریف..."}
          </h1>
          <p className="mt-2 text-base text-[#6E7772]">
            {isMatched
              ? "حریفتان پیدا شد. درحال انتقال به صفحه بازی..."
              : "درحال جستجوی حریف مناسب برای شما"}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Search Animation */}
          {isSearching && <SearchAnimation isPaused={false} />}
          {showRedirectMessage && <SearchAnimation isPaused={true} />}

          {/* Players Section */}
          <div className="grid gap-6 md:grid-cols-3 items-center">
            {/* Current Player */}
            <div>
              <p className="mb-3 text-right text-sm font-semibold text-[#7F9F85]">
                شما
              </p>
              {user && (
                <PlayerCard
                  name={`${user.firstName} ${user.lastName}`}
                  status={isSearching ? "searching" : "matched"}
                  isAnimating={true}
                />
              )}
            </div>

            {/* vs indicator */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E5EAE2] bg-[#F8FAF7]">
                <span className="text-xl font-bold text-[#7F9F85]">VS</span>
              </div>
            </div>

            {/* Opponent */}
            <div>
              <p className="mb-3 text-right text-sm font-semibold text-[#7F9F85]">
                حریف
              </p>
              {state.status === "matched" ? (
                <PlayerCard
                  name={state.opponent.name}
                  rating={state.opponent.rating}
                  country={state.opponent.country}
                  status="online"
                  isAnimating={true}
                />
              ) : (
                <PlayerCard name="..." status="searching" isAnimating={false} />
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="rounded-[20px] border border-[#E5EAE2] bg-white px-6 py-4 text-center shadow-[0_24px_60px_rgba(31,37,37,0.06)]">
            {state.status === "searching" && (
              <p className="text-base text-[#6E7772]">
                🔄 درحال جستجوی حریف مناسب...
                {state.status === "searching" && (
                  <span className="block text-sm text-[#A0B0A0] mt-1">
                    {Math.floor(state.elapsedSeconds / 60)} دقیقه و{" "}
                    {state.elapsedSeconds % 60} ثانیه سپری شده
                  </span>
                )}
              </p>
            )}
            {showRedirectMessage && (
              <p className="text-base font-semibold text-[#5E9F5E]">
                ✓ حریف یافت شد! درحال تهیه بازی...
              </p>
            )}
            {state.status === "timeout" && (
              <p className="text-base text-[#C9524B]">
                ⏱️ مهلت جستجو تمام شد. درحال بازگشت...
              </p>
            )}
            {state.status === "error" && (
              <p className="text-base text-[#C9524B]">❌ {state.message}</p>
            )}
            {state.status === "cancelled" && (
              <p className="text-base text-[#7F9F85]">
                جستجو لغو شد. درحال بازگشت به لابی...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isSearching && (
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                onClick={() => void cancel()}
                variant="outline"
                className="rounded-[16px] border-[#DCE4D9] bg-white px-8 py-2.5 h-11 text-[#5E6D60] hover:bg-[#F8FAF7]"
              >
                <X className="size-4 mr-2" />
                لغو جستجو
              </Button>
            </div>
          )}

          {/* Return to Lobby Button */}
          {(state.status === "cancelled" ||
            state.status === "timeout" ||
            state.status === "error") && (
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => router.push("/lobby")}
                className="rounded-[16px] bg-[#7F9F85] px-8 py-2.5 h-11 text-white hover:bg-[#6E8F74]"
              >
                بازگشت به لابی
              </Button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="rounded-[20px] border border-[#EEF1EC] bg-[#F8FAF7] px-6 py-4">
          <p className="text-sm text-[#6E7772]">
            💡 <strong className="text-[#1F2525]">نکته:</strong> شما می‌توانید
            از صفحه دیگری بازی خود را ادامه دهید. اگر بیش از 5 دقیقه صبر نکردید،
            جستجو خودکار لغو می‌شود.
          </p>
        </div>
      </div>
    </main>
  );
}
