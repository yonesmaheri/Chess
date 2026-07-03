import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  Crown,
  Flame,
  Globe,
  MapPinned,
  Shield,
  Star,
  Swords,
  Target,
  Trophy,
  UserPlus,
  Zap,
} from "lucide-react";
import type {
  PlayerProfile,
  PlayerProfileAchievement,
  PlayerProfileAchievementIcon,
  PlayerProfileMode,
  PlayerProfileRecentGame,
  PlayerProfileRecentGameResult,
} from "@/shared/api/services/players";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { getCalendarApi } from "@/shared/lib/date";
import { cn } from "@/shared/lib/utils";
import PlayerProfileRatingChart from "./components/PlayerProfileRatingChart";

type PlayerProfileViewProps = {
  profile: PlayerProfile;
};

const calendar = getCalendarApi();

const modeLabels: Record<PlayerProfileMode, string> = {
  blitz: "بلیتز",
  rapid: "رپید",
  puzzle: "پازل",
};

const resultLabels: Record<PlayerProfileRecentGameResult, string> = {
  win: "برد",
  loss: "باخت",
  draw: "مساوی",
};

const resultClassNames: Record<PlayerProfileRecentGameResult, string> = {
  win: "bg-[#EDF7EF] text-[#4E8A5C]",
  loss: "bg-[#FFF1F1] text-[#C45B5B]",
  draw: "bg-[#F4F5F4] text-[#777D7A]",
};

const achievementIcons: Record<PlayerProfileAchievementIcon, typeof Trophy> = {
  target: Target,
  zap: Zap,
  crown: Crown,
  flame: Flame,
  shield: Shield,
};

function formatPersianNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}٪`;
}

function formatDate(value: string, pattern = "yyyy/MM/dd") {
  return calendar.format(new Date(value), pattern);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2);
}

function getLeaderboardHref(mode: PlayerProfileMode) {
  return mode === "blitz" ? "/leaderboard" : `/leaderboard?mode=${mode}`;
}

function AchievementCard({
  achievement,
}: {
  achievement: PlayerProfileAchievement;
}) {
  const Icon = achievementIcons[achievement.icon];

  return (
    <div className="flex min-w-[112px] flex-col items-center text-center">
      <div className="mb-3 flex size-[58px] items-center justify-center rounded-full border border-[#EEF1ED] bg-[#F7F9F7] text-[#6F9D78] shadow-[0_14px_30px_rgba(31,37,37,0.06)]">
        <Icon className="size-6" />
      </div>
      <p className="text-sm font-semibold text-[#1F2525]">
        {achievement.label}
      </p>
      <p className="mt-2 text-lg font-black text-[#2D3231]">
        {achievement.value}
      </p>
      <p className="mt-1 text-xs text-[#7A7F7C]">{achievement.description}</p>
      <div className="mt-2 flex items-center gap-1 text-[#6F9D78]">
        <Star className="size-3 fill-current" />
        <Star className="size-3 fill-current" />
        <Star className="size-3 fill-current" />
      </div>
    </div>
  );
}

function RecentGameRow({ game }: { game: PlayerProfileRecentGame }) {
  return (
    <tr className="border-b border-[#EEF1ED] last:border-b-0">
      <td className="px-4 py-4 text-right">
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
            resultClassNames[game.result],
          )}
        >
          {resultLabels[game.result]}
        </span>
      </td>
      <td className="px-4 py-4 text-right font-medium text-[#2D3231]">
        {game.opponentName}
      </td>
      <td className="px-4 py-4 text-right text-[#4F5553]">
        {formatPersianNumber(game.opponentElo)}
      </td>
      <td className="px-4 py-4 text-right text-[#4F5553]">
        {game.color === "white" ? "سفید" : "سیاه"}
      </td>
      <td className="px-4 py-4 text-right text-[#4F5553]">
        {modeLabels[game.mode]}
      </td>
      <td className="px-4 py-4 text-right text-[#7A7F7C]">
        {formatDate(game.playedAt, "dd MMMM")}
      </td>
    </tr>
  );
}

export function PlayerProfileView({ profile }: PlayerProfileViewProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-8 sm:px-6 lg:gap-8 lg:px-8 lg:py-12">
        <div className="flex items-center justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-[12px] border-[#D9E1D7] bg-white px-4"
          >
            <Link href={getLeaderboardHref(profile.mode)}>
              <ChevronLeft className="size-4" />
              بازگشت به جدول
            </Link>
          </Button>
          <div className="inline-flex items-center rounded-full bg-[#EEF5EF] px-4 py-2 text-sm font-semibold text-[#497154]">
            پروفایل بازیکن {modeLabels[profile.mode]}
          </div>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-[#E8ECE7] bg-white p-6 shadow-[0_26px_70px_rgba(31,37,37,0.05)] lg:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 lg:max-w-[60%]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative">
                  <Avatar className="size-28 border-[4px] border-[#D7E5D9] shadow-[0_20px_46px_rgba(31,37,37,0.12)]">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback className="bg-[linear-gradient(135deg,#DCD9D1_0%,#BBB2A4_100%)] text-3xl font-bold text-[#34413B]">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-2 right-2 size-5 rounded-full border-[3px] border-white bg-[#53B36A]" />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black text-[#1F2525]">
                      {profile.name}
                    </h1>
                    {profile.verified ? (
                      <BadgeCheck className="size-6 fill-[#6F9D78] text-[#6F9D78]" />
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#66706B]">
                    <span className="rounded-full bg-[#F5F8F4] px-3 py-1.5 font-semibold text-[#4A7B56]">
                      {profile.title}
                    </span>
                    <span>{profile.countryName}</span>
                    <span>عضویت: {formatDate(profile.joinedAt)}</span>
                  </div>

                  <p className="max-w-[720px] text-sm leading-8 text-[#5F6662]">
                    {profile.about}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto">
              <Button className="h-12 rounded-[14px] bg-[#6F9D78] px-6 text-white hover:bg-[#5B8664]">
                <Swords className="size-4" />
                چالش
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-[14px] border-[#D9E1D7] px-6 text-[#2D3231]"
              >
                <UserPlus className="size-4" />
                دنبال کردن
              </Button>
              <div className="rounded-[18px] border border-[#EEF1ED] bg-[#FCFDFC] px-4 py-3 text-sm">
                <p className="text-[#7A7F7C]">پیشرفت اخیر</p>
                <p className="mt-1 flex items-center gap-1 text-lg font-bold text-[#2D3231]">
                  +{formatPersianNumber(profile.eloChange)}
                  <ArrowUpRight className="size-4 text-[#5C8E68]" />
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[24px] border border-[#E8ECE7] bg-white p-5 shadow-[0_18px_42px_rgba(31,37,37,0.045)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#7A7F7C]">رتبه جهانی</span>
              <Globe className="size-5 text-[#96A09B]" />
            </div>
            <p className="text-[2rem] font-black text-[#2D3231]">
              {formatPersianNumber(profile.worldRank)}
            </p>
            <p className="mt-3 text-sm text-[#7A7F7C]">
              جایگاه فعلی در جدول {modeLabels[profile.mode]}
            </p>
          </article>

          <article className="rounded-[24px] border border-[#E8ECE7] bg-white p-5 shadow-[0_18px_42px_rgba(31,37,37,0.045)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#7A7F7C]">رتبه کشوری</span>
              <MapPinned className="size-5 text-[#96A09B]" />
            </div>
            <p className="text-[2rem] font-black text-[#2D3231]">
              {formatPersianNumber(profile.countryRank)}
            </p>
            <p className="mt-3 text-sm text-[#7A7F7C]">
              بر اساس عملکرد اخیر در {profile.countryName}
            </p>
          </article>

          <article className="rounded-[24px] border border-[#E8ECE7] bg-white p-5 shadow-[0_18px_42px_rgba(31,37,37,0.045)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#7A7F7C]">امتیاز فعلی</span>
              <Trophy className="size-5 text-[#96A09B]" />
            </div>
            <p className="text-[2rem] font-black text-[#2D3231]">
              {formatPersianNumber(profile.currentElo)}
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-[#5C8E68]">
                رشد اخیر: +{formatPersianNumber(profile.eloChange)}
              </p>
              <p className="text-[#7A7F7C]">
                اوج امتیاز: {formatPersianNumber(profile.peakElo)}
              </p>
            </div>
          </article>

          <article className="rounded-[24px] border border-[#E8ECE7] bg-white p-5 shadow-[0_18px_42px_rgba(31,37,37,0.045)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#7A7F7C]">
                ثبت برد / باخت / مساوی
              </span>
              <CalendarDays className="size-5 text-[#96A09B]" />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#ECEFED]">
              <div className="flex h-full w-full">
                <div
                  className="bg-[#6F9D78]"
                  style={{ width: `${profile.winRate}%` }}
                />
                <div
                  className="bg-[#D95764]"
                  style={{ width: `${profile.lossRate}%` }}
                />
                <div
                  className="bg-[#C7CDCA]"
                  style={{ width: `${profile.drawRate}%` }}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="font-bold text-[#5C8E68]">
                  {formatPercent(profile.winRate)}
                </p>
                <p className="text-[#7A7F7C]">برد</p>
              </div>
              <div>
                <p className="font-bold text-[#C45B5B]">
                  {formatPercent(profile.lossRate)}
                </p>
                <p className="text-[#7A7F7C]">باخت</p>
              </div>
              <div>
                <p className="font-bold text-[#7A7F7C]">
                  {formatPercent(profile.drawRate)}
                </p>
                <p className="text-[#7A7F7C]">مساوی</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#7A7F7C]">
              تعداد کل بازی ها: {formatPersianNumber(profile.totalGames)}
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[450px_1fr]">
          <article className="rounded-[28px] border border-[#E8ECE7] bg-white p-6 shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F2525]">دستاوردها</h2>
                <p className="mt-1 text-sm text-[#7A7F7C]">
                  خلاصه ای از شاخص های مهم این بازیکن
                </p>
              </div>
              <Trophy className="mt-1 size-5 text-[#96A09B]" />
            </div>

            <div className="overflow-x-auto">
              <div className="flex w-max gap-6 px-1 pb-3">
                {profile.achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-3 h-11 w-full rounded-[14px] border-[#EEF1ED] bg-white text-sm font-semibold text-[#4F5553]"
            >
              مشاهده همه
              <ChevronLeft className="size-4" />
            </Button>
          </article>

          <PlayerProfileRatingChart
            points={profile.ratingHistory}
            currentElo={profile.currentElo}
          />
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#E8ECE7] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
          <div className="flex flex-col gap-2 border-b border-[#EEF1ED] px-6 py-5">
            <h2 className="text-lg font-bold text-[#1F2525]">بازی های اخیر</h2>
            <p className="text-sm text-[#7A7F7C]">
              آخرین مسابقات ثبت شده برای این بازیکن
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FCFDFC] text-[#6E7571]">
                <tr>
                  <th className="px-4 py-4 text-right font-semibold">نتیجه</th>
                  <th className="px-4 py-4 text-right font-semibold">حریف</th>
                  <th className="px-4 py-4 text-right font-semibold">
                    امتیاز حریف
                  </th>
                  <th className="px-4 py-4 text-right font-semibold">رنگ</th>
                  <th className="px-4 py-4 text-right font-semibold">بخش</th>
                  <th className="px-4 py-4 text-right font-semibold">زمان</th>
                </tr>
              </thead>
              <tbody>
                {profile.recentGames.map((game) => (
                  <RecentGameRow key={game.id} game={game} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
