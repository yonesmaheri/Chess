"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  Copy,
  Crown,
  Link2,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { inviteService } from "@/shared/api/services/invites";
import type { ResolveInviteResponse } from "@/shared/api/services/invites";
import type {
  GetLobbyResponse,
  LobbyInvite,
  LobbyInviteStatus,
} from "@/shared/api/services/lobby";
import { matchmakingService } from "@/shared/api/services/matchmaking";
import type {
  CreateAiMatchResponse,
  CreateRandomMatchResponse,
} from "@/shared/api/services/matchmaking";
import {
  formatRelativeTime,
  getDifficultyDescription,
  getDifficultySupportingText,
  getInviteStatusLabel,
} from "./lib/utils";

const LobbyBoardPreview = dynamic(
  () => import("./components/LobbyBoardPreview"),
  {
    ssr: false,
  },
);

const panelClassName =
  "overflow-hidden rounded-[28px] border border-[#E5EAE2] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.06)]";

type LobbyPageFeatureProps = {
  initialData: GetLobbyResponse;
  inviteId: string | null;
  inviteToken: string | null;
};

function InviteStatusBadge({ status }: { status: LobbyInviteStatus }) {
  const className =
    status === "accepted"
      ? "bg-[#EAF5E8] text-[#567553]"
      : status === "rejected" || status === "expired"
        ? "bg-[#F8EAEA] text-[#9B4B4B]"
        : "bg-[#EEF4EC] text-[#628061]";

  return (
    <Badge className={`rounded-full px-2.5 py-1 ${className}`}>
      {getInviteStatusLabel(status)}
    </Badge>
  );
}

function ChallengeListItem({
  invite,
  action,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  disabled,
}: {
  invite: LobbyInvite;
  action?: () => void;
  actionLabel?: string;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  disabled?: boolean;
}) {
  const initials = invite.creator.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");

  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[#EDF1EB] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-11 border border-[#E4EAE1] bg-[#F7FAF6]">
          <AvatarFallback className="bg-[#EEF4EC] text-sm font-semibold text-[#648162]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#1F2525]">
            {invite.creator.fullName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6E7772]">
            <span>{formatRelativeTime(invite.createdAt)}</span>
            <span className="text-[#C7CDC7]">•</span>
            <span>{formatRelativeTime(invite.expiresAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <InviteStatusBadge status={invite.status} />
        {action && actionLabel ? (
          <Button
            type="button"
            size="sm"
            onClick={action}
            disabled={disabled}
            className="rounded-full bg-[#7F9F85] px-4 text-white hover:bg-[#6E8F74]"
          >
            {actionLabel}
          </Button>
        ) : null}
        {secondaryAction && secondaryActionLabel ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={secondaryAction}
            disabled={disabled}
            className="rounded-full border-[#DCE4D9] bg-transparent px-4 text-[#5E6D60]"
          >
            {secondaryActionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function LobbyPageFeature({
  initialData,
  inviteId,
  inviteToken,
}: LobbyPageFeatureProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    initialData.ai.recommendedDifficulty,
  );
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [isStartingRandom, setIsStartingRandom] = useState(false);
  const [isStartingAi, setIsStartingAi] = useState(false);
  const [isResolvingInvite, setIsResolvingInvite] = useState(false);
  const [randomMatch, setRandomMatch] =
    useState<CreateRandomMatchResponse | null>(null);
  const [aiMatch, setAiMatch] = useState<CreateAiMatchResponse | null>(null);
  const [acceptedInviteGame, setAcceptedInviteGame] = useState<
    ResolveInviteResponse["game"] | null
  >(null);
  const [resolvedInviteState, setResolvedInviteState] = useState<
    "accepted" | "rejected" | null
  >(null);

  const difficultyDescription = getDifficultyDescription(selectedDifficulty);
  const difficultySupportingText =
    getDifficultySupportingText(selectedDifficulty);
  const activeInvite = data.friends.activeInvite;
  const inviteQueryIsOwnLink =
    Boolean(inviteId && inviteToken) &&
    activeInvite?.id === inviteId &&
    activeInvite.token === inviteToken &&
    activeInvite.creator.id === data.currentUser.id;

  const previewData = useMemo(() => {
    if (acceptedInviteGame) {
      return {
        title: "بازی خصوصی آماده شد",
        subtitle: `بازی شما با ${acceptedInviteGame.opponent.name} آماده است.`,
        fen: acceptedInviteGame.fen,
      };
    }

    if (aiMatch) {
      return {
        title: `بازی با هوش مصنوعی - سطح ${aiMatch.difficulty}`,
        subtitle: `${aiMatch.difficultyLabel} | ${aiMatch.note}`,
        fen: aiMatch.board.fen,
      };
    }

    return null;
  }, [acceptedInviteGame, aiMatch]);

  const syncInvites = async () => {
    const invites = await inviteService.get();

    setData((current) => ({
      ...current,
      friends: {
        ...current.friends,
        ...invites,
      },
    }));
  };

  const clearInviteQuery = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.history.replaceState(null, "", "/lobby");
  };

  const copyInviteLink = async (inviteUrl: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("لینک دعوت کپی شد.");
    } catch {
      toast.error("امکان کپی لینک در این مرورگر فراهم نیست.");
    }
  };

  const handleCreateInvite = async () => {
    setIsCreatingInvite(true);

    try {
      const response = await inviteService.create();
      await syncInvites();
      toast.success(
        response.reused
          ? "دعوت فعال قبلی شما دوباره آماده شد."
          : "لینک دعوت جدید ساخته شد.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ساخت لینک دعوت با مشکل روبه‌رو شد.",
      );
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const handleStartRandomMatch = async () => {
    setIsStartingRandom(true);

    try {
      // Navigate to the matchmaking page
      router.push("/matchmaking");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "انتقال به صفحه جستجوی حریف انجام نشد.",
      );
      setIsStartingRandom(false);
    }
  };

  const handleStartAiMatch = async () => {
    setIsStartingAi(true);

    try {
      const response = await matchmakingService.createAiMatch({
        difficulty: selectedDifficulty,
      });
      setAiMatch(response);
      toast.success("بازی تمرینی شما آماده شد.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "آماده‌سازی بازی با هوش مصنوعی انجام نشد.",
      );
    } finally {
      setIsStartingAi(false);
    }
  };

  const handleResolveInvite = async (action: "accept" | "reject") => {
    if (!inviteId || !inviteToken) {
      return;
    }

    setIsResolvingInvite(true);

    try {
      const response =
        action === "accept"
          ? await inviteService.accept(inviteId, { token: inviteToken })
          : await inviteService.reject(inviteId, { token: inviteToken });

      await syncInvites();
      setResolvedInviteState(action === "accept" ? "accepted" : "rejected");
      setAcceptedInviteGame(response.game ?? null);
      clearInviteQuery();
      toast.success(action === "accept" ? "دعوت پذیرفته شد." : "دعوت رد شد.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "پاسخ به دعوت با مشکل روبه‌رو شد.",
      );
    } finally {
      setIsResolvingInvite(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-[16px] border-[#E3E9E1] bg-white px-4 text-[#5D6B60] shadow-sm"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              بازگشت به داشبورد
            </Link>
          </Button>

          <div className="text-right">
            <div className="mb-2 flex items-center justify-end gap-2 text-[#7F9F85]">
              <Crown className="size-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {data.hero.title}
            </h1>
            <p className="mt-2 text-sm text-[#6E7772] sm:text-base">
              {data.hero.subtitle}
            </p>
          </div>
        </div>

        {inviteId &&
        inviteToken &&
        !inviteQueryIsOwnLink &&
        !resolvedInviteState ? (
          <section
            className={`${panelClassName} border-[#DCE8D8] bg-[#F7FBF6]`}
          >
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#6C8A6F]">
                  <Link2 className="size-4" />
                  <span className="text-sm font-semibold">دعوت جدید</span>
                </div>
                <h2 className="text-lg font-bold text-[#1F2525]">
                  یک لینک دعوت برای شما باز شده است
                </h2>
                <p className="mt-1 text-sm text-[#6E7772]">
                  در صورت تمایل این دعوت خصوصی را بپذیرید یا رد کنید.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => void handleResolveInvite("accept")}
                  disabled={isResolvingInvite}
                  className="h-11 rounded-[16px] bg-[#7F9F85] px-5 text-white hover:bg-[#6E8F74]"
                >
                  <CheckCircle2 className="size-4" />
                  پذیرش دعوت
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleResolveInvite("reject")}
                  disabled={isResolvingInvite}
                  className="h-11 rounded-[16px] border-[#DDE5DA] bg-white px-5 text-[#5E6D60]"
                >
                  <XCircle className="size-4" />
                  رد دعوت
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {inviteQueryIsOwnLink ? (
          <section
            className={`${panelClassName} border-[#E8EEDA] bg-[#FAFCF8]`}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-[#5F7B5D]">
                  این لینک دعوت متعلق به شماست
                </p>
                <p className="mt-1 text-sm text-[#6E7772]">
                  لینک را برای دوستتان ارسال کنید یا همان دعوت فعال را دوباره
                  کپی کنید.
                </p>
              </div>
              {activeInvite ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void copyInviteLink(activeInvite.inviteUrl)}
                  className="rounded-[14px] border-[#DDE5DA] bg-white px-4 text-[#5E6D60]"
                >
                  <Copy className="size-4" />
                  کپی لینک
                </Button>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-3 lg:grid-cols-2">
          <section className={panelClassName}>
            <div className="flex items-start justify-between gap-3 px-5 py-5 sm:px-6">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-[#EAF4E8] p-2 text-[#6C8A6F]">
                  <Zap className="size-5" />
                </div>
                <h2 className="text-xl font-bold">{data.online.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6E7772]">
                  {data.online.description}
                </p>
              </div>
              <Badge className="rounded-full bg-[#EEF4EC] px-3 py-1 text-[#628061] hover:bg-[#EEF4EC]">
                سریع
              </Badge>
            </div>

            <div className="grid gap-3 px-5 pb-5 sm:px-6">
              <div className="rounded-[22px] border border-[#EDF2EC] bg-[#F8FBF8] p-4">
                <div className="flex items-center gap-3 text-[#658263]">
                  <Clock3 className="size-5" />
                  <div>
                    <p className="text-lg font-black">۱ دقیقه</p>
                    <p className="text-xs text-[#6E7772]">
                      کنترل زمان از تنظیمات کاربر خوانده می‌شود.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                onClick={() => void handleStartRandomMatch()}
                disabled={isStartingRandom}
                className="h-14 rounded-[18px] bg-[#7F9F85] text-base font-semibold text-white hover:bg-[#6E8F74]"
              >
                <Swords className="size-5" />
                {isStartingRandom ? "در حال ورود به صف..." : "شروع بازی تصادفی"}
              </Button>

              <p className="text-xs leading-6 text-[#7A817C]">
                فعلاً فقط معماری صف بازی آماده شده و اتصال بلادرنگ هنوز فعال
                نشده است.
              </p>

              {randomMatch ? (
                <div className="rounded-[20px] border border-[#E6ECE4] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2525]">
                        بلیت صف ساخته شد
                      </p>
                      <p className="mt-1 text-xs text-[#6E7772]">
                        حدود {randomMatch.estimatedWaitSeconds} ثانیه زمان
                        انتظار تخمینی
                      </p>
                    </div>
                    <Badge className="rounded-full bg-[#EAF4E8] px-3 py-1 text-[#628061] hover:bg-[#EAF4E8]">
                      {randomMatch.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-[#7A817C]">
                    {randomMatch.note}
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <section className={panelClassName}>
            <div className="px-5 py-5 sm:px-6">
              <div className="mb-3 inline-flex rounded-full bg-[#EAF4E8] p-2 text-[#6C8A6F]">
                <Bot className="size-5" />
              </div>
              <h2 className="text-xl font-bold">{data.ai.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6E7772]">
                {data.ai.description}
              </p>
            </div>

            <Separator className="bg-[#EEF2EC]" />

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#314036]">
                    سطح دشواری
                  </h3>
                  <Badge className="rounded-full bg-[#EEF4EC] px-3 py-1 text-[#628061] hover:bg-[#EEF4EC]">
                    {difficultyDescription}
                  </Badge>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {data.ai.levels.map((level) => {
                    const isSelected = level === selectedDifficulty;

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedDifficulty(level)}
                        className={`flex h-12 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                          isSelected
                            ? "border-[#7F9F85] bg-[#7F9F85] text-white shadow-[0_10px_25px_rgba(127,159,133,0.28)]"
                            : "border-[#E2E8E0] bg-white text-[#48544B] hover:border-[#BDD0BB]"
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`انتخاب سطح ${level}`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-[20px] border border-[#EEF2EC] bg-[#F8FBF8] px-4 py-3">
                  <p className="text-sm font-semibold text-[#315438]">
                    سطح {selectedDifficulty} - {difficultyDescription}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#6E7772]">
                    {difficultySupportingText}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                onClick={() => void handleStartAiMatch()}
                disabled={isStartingAi}
                className="h-14 w-full rounded-[18px] bg-[#7F9F85] text-base font-semibold text-white hover:bg-[#6E8F74]"
              >
                <Sparkles className="size-5" />
                {isStartingAi
                  ? "در حال آماده‌سازی..."
                  : "شروع بازی با هوش مصنوعی"}
              </Button>

              <p className="text-xs leading-6 text-[#7A817C]">
                رنگ مهره و زمان از تنظیمات کاربر گرفته می‌شود و در این صفحه
                انتخاب مجدد ندارد.
              </p>
            </div>
          </section>

          <section className={panelClassName}>
            <div className="px-5 py-5 sm:px-6">
              <div className="mb-3 inline-flex rounded-full bg-[#EAF4E8] p-2 text-[#6C8A6F]">
                <Users className="size-5" />
              </div>
              <h2 className="text-xl font-bold">{data.friends.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6E7772]">
                {data.friends.description}
              </p>
            </div>

            <div className="space-y-5 px-5 pb-5 sm:px-6">
              <div className="rounded-[22px] border border-[#E8EEE5] bg-[#F8FBF8] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1F2525]">
                      ایجاد لینک دعوت
                    </p>
                    <p className="mt-1 text-xs leading-6 text-[#6E7772]">
                      لینک اختصاصی بسازید و آن را با حریف یا دوستتان به اشتراک
                      بگذارید.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => void handleCreateInvite()}
                      disabled={isCreatingInvite}
                      className="rounded-[14px] bg-[#7F9F85] px-4 text-white hover:bg-[#6E8F74]"
                    >
                      <Link2 className="size-4" />
                      {isCreatingInvite ? "در حال ایجاد..." : "ایجاد لینک دعوت"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        activeInvite
                          ? void copyInviteLink(activeInvite.inviteUrl)
                          : toast.error("ابتدا یک لینک دعوت بسازید.")
                      }
                      className="rounded-[14px] border-[#DDE5DA] bg-white px-4 text-[#5E6D60]"
                    >
                      <Copy className="size-4" />
                      کپی لینک دعوت
                    </Button>
                  </div>
                </div>

                {activeInvite ? (
                  <div className="mt-4 rounded-[18px] border border-[#E2E9DF] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#1F2525]">
                        لینک فعال شما آماده است
                      </p>
                      <InviteStatusBadge status={activeInvite.status} />
                    </div>
                    <p className="mt-2 truncate text-xs text-[#6E7772]">
                      {activeInvite.inviteUrl}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#314036]">
                    چالش‌های اخیر
                  </h3>
                  <Badge className="rounded-full bg-[#F1F4F0] px-3 py-1 text-[#6E7772] hover:bg-[#F1F4F0]">
                    {data.friends.recentChallenges.length}
                  </Badge>
                </div>

                {data.friends.recentChallenges.length ? (
                  data.friends.recentChallenges.map((invite) => (
                    <ChallengeListItem key={invite.id} invite={invite} />
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[#DDE5DA] bg-[#FBFCFB] px-4 py-5 text-sm text-[#7A817C]">
                    هنوز چالشی ثبت نشده است. با ساختن اولین لینک، این بخش کامل
                    می‌شود.
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#314036]">
                    دعوت‌های ورودی
                  </h3>
                  <Badge className="rounded-full bg-[#F1F4F0] px-3 py-1 text-[#6E7772] hover:bg-[#F1F4F0]">
                    {data.friends.incomingInvitations.length}
                  </Badge>
                </div>

                {data.friends.incomingInvitations.length ? (
                  data.friends.incomingInvitations.map((invite) => (
                    <ChallengeListItem
                      key={invite.id}
                      invite={invite}
                      action={() =>
                        void inviteService
                          .accept(invite.id, { token: invite.token })
                          .then(async (response) => {
                            setAcceptedInviteGame(response.game ?? null);
                            await syncInvites();
                            toast.success("دعوت پذیرفته شد.");
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "پذیرش دعوت انجام نشد.",
                            );
                          })
                      }
                      actionLabel="پذیرش"
                      secondaryAction={() =>
                        void inviteService
                          .reject(invite.id, { token: invite.token })
                          .then(async () => {
                            await syncInvites();
                            toast.success("دعوت رد شد.");
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "رد دعوت انجام نشد.",
                            );
                          })
                      }
                      secondaryActionLabel="رد"
                    />
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[#DDE5DA] bg-[#FBFCFB] px-4 py-5 text-sm text-[#7A817C]">
                    فعلاً دعوت ورودی مستقیمی ندارید. لینک‌هایی که دیگران برای
                    شما ارسال می‌کنند از همین بخش قابل مدیریت هستند.
                  </div>
                )}
              </div>

              <div className="rounded-[20px] border border-dashed border-[#DDE5DA] bg-[#FAFCFA] p-4">
                <div className="mb-2 flex items-center gap-2 text-[#6A8767]">
                  {data.friends.supported ? (
                    <Users className="size-4" />
                  ) : (
                    <WifiOff className="size-4" />
                  )}
                  <p className="text-sm font-semibold text-[#314036]">
                    وضعیت دوستان آنلاین
                  </p>
                </div>
                {data.friends.supported ? (
                  <p className="text-sm text-[#6E7772]">
                    {data.friends.onlineFriends.length} دوست آنلاین در دسترس
                    است.
                  </p>
                ) : (
                  <p className="text-sm leading-6 text-[#6E7772]">
                    {data.friends.emptyStateMessage}
                  </p>
                )}
              </div>
            </div>
          </section>
        </section>

        {previewData ? (
          <LobbyBoardPreview
            title={previewData.title}
            subtitle={previewData.subtitle}
            fen={previewData.fen}
          />
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.trustIndicators.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-[24px] border border-[#E6ECE4] bg-white px-4 py-4 shadow-sm"
            >
              <div className="rounded-full bg-[#EEF4EC] p-2 text-[#6C8A6F]">
                {item.includes("امن") ? (
                  <ShieldCheck className="size-4" />
                ) : item.includes("فیر") ? (
                  <Sparkles className="size-4" />
                ) : item.includes("موتور") ? (
                  <Bot className="size-4" />
                ) : item.includes("خصوصی") ? (
                  <Users className="size-4" />
                ) : (
                  <Zap className="size-4" />
                )}
              </div>
              <span className="text-sm font-medium text-[#435146]">{item}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
