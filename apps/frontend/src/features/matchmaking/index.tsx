"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/contexts/auth-provider";
import { useSocketContext } from "@/shared/contexts/socket-provider";
import { SearchAnimation } from "./components/SearchAnimation";
import { PlayerCard } from "./components/PlayerCard";
import { useMatchmaking } from "./lib/useMatchmakingWebSocket";

export function MatchmakingPageFeature() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isConnected, isConnecting, error: socketError } = useSocketContext();
  const { state, start, cancel, isReady } = useMatchmaking();
  const [showMatchedMessage, setShowMatchedMessage] = useState(false);

  // Auto-start only after the socket transport and gateway auth are both ready.
  useEffect(() => {
    if (isAuthenticated && isConnected && isReady && state.status === "idle") {
      void start();
    }
  }, [isAuthenticated, isConnected, isReady, state.status, start]);

  // Keep the success state visible briefly, then move both players into the match page.
  useEffect(() => {
    if (state.status === "matched") {
      setShowMatchedMessage(true);
      const redirectTimer = setTimeout(() => {
        const params = new URLSearchParams({
          opponent: state.opponent.name,
        });
        router.push(
          `/matchmaking/session/${state.sessionId}?${params.toString()}`,
        );
      }, 1500);

      return () => {
        setShowMatchedMessage(false);
        clearTimeout(redirectTimer);
      };
    }
  }, [router, state]);

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
  const isWaitingForConnection =
    isAuthenticated &&
    !isConnected &&
    (isConnecting || state.status === "idle");

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
              ? "حریفتان پیدا شد. آماده‌سازی جلسه بازی انجام شده است."
              : isWaitingForConnection
                ? "درحال برقراری اتصال بلادرنگ..."
                : "درحال جستجوی حریف مناسب برای شما"}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Search Animation */}
          {isSearching && <SearchAnimation isPaused={false} />}
          {showMatchedMessage && <SearchAnimation isPaused={true} />}

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
                  status={
                    isSearching || isWaitingForConnection
                      ? "searching"
                      : "matched"
                  }
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
            {isWaitingForConnection && (
              <p className="text-base text-[#6E7772]">
                درحال اتصال به سرور matchmaking...
              </p>
            )}
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
            {showMatchedMessage && (
              <p className="text-base font-semibold text-[#5E9F5E]">
                ✓ حریف یافت شد! شناسه جلسه{" "}
                {state.status === "matched" ? state.sessionId : ""} ثبت شد و
                درحال انتقال شما به اتاق بازی است.
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
            {socketError && state.status !== "error" && (
              <p className="text-base text-[#C9524B]">
                ❌ {socketError.message || "اتصال بلادرنگ برقرار نشد."}
              </p>
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
            از همین اتصال مشترک برای قابلیت‌های بلادرنگ بعدی هم استفاده کنید.
            اگر بیش از 5 دقیقه صبر کنید، جستجو خودکار لغو می‌شود.
          </p>
        </div>
      </div>
    </main>
  );
}
