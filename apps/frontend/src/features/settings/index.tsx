"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Check,
  Info,
  Palette,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

type ThemeOption = {
  id: string;
  label: string;
  light: string;
  dark: string;
  accent: string;
};

type PieceStyle = {
  id: "neo" | "3d";
  label: string;
  pieces: string[];
};

const themeOptions: ThemeOption[] = [
  {
    id: "classic",
    label: "کلاسیک",
    light: "#f2edd7",
    dark: "#b5a27a",
    accent: "#8d7754",
  },
  {
    id: "light-wood",
    label: "چوب روشن",
    light: "#f3e9d6",
    dark: "#c9a883",
    accent: "#9d7c58",
  },
  {
    id: "dark-wood",
    label: "چوب تیره",
    light: "#d8c6b0",
    dark: "#7f614b",
    accent: "#5f4a39",
  },
  {
    id: "green",
    label: "سبز ملایم",
    light: "#f2edda",
    dark: "#8ea882",
    accent: "#789B84",
  },
  {
    id: "gray-blue",
    label: "سرمه‌ای",
    light: "#edf1f5",
    dark: "#7d8fa2",
    accent: "#61778e",
  },
  {
    id: "gray",
    label: "خاکستری",
    light: "#f0f0ee",
    dark: "#a8adaf",
    accent: "#7f8689",
  },
  {
    id: "light-blue",
    label: "آبی یخی",
    light: "#eef5f7",
    dark: "#9bb9c0",
    accent: "#6f96a1",
  },
  {
    id: "purple",
    label: "بنفش ملایم",
    light: "#f4eff6",
    dark: "#aa98b3",
    accent: "#8a7596",
  },
];

const pieceStyles: PieceStyle[] = [
  {
    id: "neo",
    label: "Neo",
    pieces: ["♔", "♕", "♖", "♘", "♗", "♙"],
  },
  {
    id: "3d",
    label: "سه‌بعدی (3D)",
    pieces: ["♚", "♛", "♜", "♞", "♝", "♟"],
  },
];

const previewPieces = [
  { square: [0, 4], piece: "♚" },
  { square: [0, 3], piece: "♛" },
  { square: [0, 2], piece: "♝" },
  { square: [0, 1], piece: "♞" },
  { square: [1, 4], piece: "♟" },
  { square: [1, 3], piece: "♟" },
  { square: [2, 2], piece: "♟" },
  { square: [4, 4], piece: "♙" },
  { square: [5, 5], piece: "♘" },
  { square: [6, 3], piece: "♙" },
  { square: [7, 4], piece: "♔" },
  { square: [7, 3], piece: "♕" },
  { square: [7, 2], piece: "♗" },
  { square: [7, 1], piece: "♘" },
];

const coordinates = {
  files: ["a", "b", "c", "d", "e", "f", "g", "h"],
  ranks: ["8", "7", "6", "5", "4", "3", "2", "1"],
};

function SectionHeader({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ee] text-[#789B84]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#1f2520]">{title}</h2>
      </div>
    </div>
  );
}

function ThemeThumbnail({
  theme,
  showCoordinates = false,
  showHighlight = false,
  pieceStyle = "neo",
  className,
}: {
  theme: ThemeOption;
  showCoordinates?: boolean;
  showHighlight?: boolean;
  pieceStyle?: PieceStyle["id"];
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[10px]", className)}>
      <div className="grid aspect-square grid-cols-8">
        {Array.from({ length: 64 }).map((_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const isDark = (row + col) % 2 === 1;
          const piece = previewPieces.find(
            (item) => item.square[0] === row && item.square[1] === col,
          );
          const isSource = showHighlight && row === 6 && col === 3;
          const isTarget = showHighlight && row === 4 && col === 4;

          return (
            <div
              key={`${theme.id}-${index}`}
              className="relative flex items-center justify-center"
              style={{
                backgroundColor: isDark ? theme.dark : theme.light,
              }}
            >
              {isSource || isTarget ? (
                <div className="absolute inset-[12%] rounded-md bg-[#7ea18a]/30 ring-1 ring-[#789B84]/55" />
              ) : null}

              {piece ? (
                <span
                  className={cn(
                    "relative z-10 select-none leading-none",
                    pieceStyle === "neo"
                      ? "text-[clamp(8px,1.5vw,22px)] text-[#203126]"
                      : "text-[clamp(8px,1.5vw,22px)] text-white [text-shadow:0_1px_0_rgba(32,49,38,0.45),0_3px_6px_rgba(32,49,38,0.35)]",
                  )}
                  style={{
                    color: pieceStyle === "neo" ? theme.accent : undefined,
                  }}
                >
                  {piece.piece}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      {showCoordinates ? (
        <>
          <div className="pointer-events-none absolute inset-x-2 bottom-1 flex items-center justify-between text-[10px] text-[#f8faf8]/90">
            {coordinates.files.map((file) => (
              <span key={file}>{file}</span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-2 left-1 flex flex-col items-center justify-between text-[10px] text-[#f8faf8]/90">
            {coordinates.ranks.map((rank) => (
              <span key={rank}>{rank}</span>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ThemeCard({
  theme,
  selected,
  onClick,
}: {
  theme: ThemeOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative rounded-[14px] border bg-white p-3 text-right transition-all duration-300 hover:-translate-y-0.5",
        selected
          ? "border-[#789B84] shadow-[0_18px_44px_-30px_rgba(120,155,132,0.5)]"
          : "border-[#e7e8e2] shadow-[0_14px_40px_-34px_rgba(31,37,32,0.18)] hover:border-[#d7ddd6]",
      )}
    >
      {selected ? (
        <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#789B84] text-white">
          <Check className="h-3.5 w-3.5" />
        </span>
      ) : null}

      <ThemeThumbnail
        theme={theme}
        className="rounded-[10px] border border-black/5 shadow-inner"
      />
      <span className="mt-3 block text-sm font-medium text-[#32403a]">
        {theme.label}
      </span>
    </button>
  );
}

function PieceStyleCard({
  style,
  selected,
  onClick,
}: {
  style: PieceStyle;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-[72px] items-center justify-between rounded-[12px] border bg-white px-5 transition-all duration-300 hover:-translate-y-0.5",
        selected
          ? "border-[#789B84] shadow-[0_16px_40px_-28px_rgba(120,155,132,0.42)]"
          : "border-[#e3e4de] hover:border-[#d5dbd4]",
      )}
    >
      {selected ? (
        <span className="absolute left-3 top-3 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#789B84] text-white">
          <Check className="h-3 w-3" />
        </span>
      ) : null}

      <span className="text-sm font-semibold text-[#1f2520]">
        {style.label}
      </span>
      <div className="flex items-center gap-2 text-2xl">
        {style.pieces.map((piece, index) => (
          <span
            key={`${style.id}-${piece}-${index}`}
            className={cn(
              "leading-none",
              style.id === "3d"
                ? "text-white [text-shadow:0_1px_0_rgba(31,37,32,0.45),0_4px_10px_rgba(31,37,32,0.35)]"
                : "text-[#6f8876]",
            )}
          >
            {piece}
          </span>
        ))}
      </div>
    </button>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex min-h-[72px] items-center justify-between gap-4 border-y border-[#eff0eb] py-4">
      <div>
        <h3 className="text-[15px] font-semibold text-[#1f2520]">{title}</h3>
        <p className="mt-1 text-sm text-[#8a928c]">{description}</p>
      </div>

      <button
        type="button"
        aria-pressed={enabled}
        onClick={onToggle}
        className={cn(
          "relative h-[26px] w-[48px] rounded-full transition-colors duration-300",
          enabled ? "bg-[#789B84]" : "bg-[#d7dbd6]",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-[18px] w-[18px] rounded-full bg-white shadow-[0_4px_12px_rgba(31,37,32,0.2)] transition-all duration-300",
            enabled ? "right-[26px]" : "right-1",
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] =
    useState<ThemeOption["id"]>("green");
  const [selectedPieceStyle, setSelectedPieceStyle] =
    useState<PieceStyle["id"]>("neo");
  const [highlightMoves, setHighlightMoves] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [formValues, setFormValues] = useState({
    username: "شطرنج‌باز",
    fullName: "پارسا محمدی",
    email: "chessplayer@example.com",
    joinedAt: "۱۴۰۲/۰۶/۱۵",
  });

  const activeTheme =
    themeOptions.find((theme) => theme.id === selectedTheme) ?? themeOptions[3];

  return (
    <div dir="rtl" className="min-h-full bg-[#fafaf8] py-8 sm:py-10">
      <div className="rounded-[22px] border border-[#e8e8e3] bg-white p-5 shadow-[0_28px_80px_-66px_rgba(31,37,32,0.24)] sm:p-6 lg:p-8">
        <header>
          <h1 className="text-3xl font-bold text-[#1F2520] sm:text-[34px]">
            تنظیمات
          </h1>
          <p className="mt-4 text-sm text-[#7b837d] sm:text-[15px]">
            تنظیمات حساب کاربری و ظاهر بازی خود را مدیریت کنید.
          </p>
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[16px] border border-[#e9e9e4] bg-white p-6 shadow-[0_18px_48px_-40px_rgba(31,37,32,0.2)]">
              <SectionHeader title="ظاهر بازی" icon={Palette} />

              <div className="mt-8">
                <h3 className="text-sm font-semibold text-[#32403a]">
                  تم صفحه شطرنج
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {themeOptions.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      selected={theme.id === selectedTheme}
                      onClick={() => setSelectedTheme(theme.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-[#eef0eb] pt-8">
                <h3 className="text-base font-semibold text-[#1f2520]">
                  سبک مهره‌ها
                </h3>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {pieceStyles.map((style) => (
                    <PieceStyleCard
                      key={style.id}
                      style={style}
                      selected={style.id === selectedPieceStyle}
                      onClick={() => setSelectedPieceStyle(style.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-0">
                <ToggleRow
                  title="هایلایت حرکت‌ها"
                  description="خانه مبدا و مقصد حرکت را هایلایت کن"
                  enabled={highlightMoves}
                  onToggle={() => setHighlightMoves((current) => !current)}
                />
                <ToggleRow
                  title="نمایش مختصات"
                  description="نمایش حروف و اعداد اطراف صفحه شطرنج"
                  enabled={showCoordinates}
                  onToggle={() => setShowCoordinates((current) => !current)}
                />
              </div>
            </section>

            <section className="rounded-[16px] border border-[#e9e9e4] bg-white p-6 shadow-[0_18px_48px_-40px_rgba(31,37,32,0.2)]">
              <SectionHeader title="اطلاعات حساب کاربری" icon={UserRound} />

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#647069]">
                    نام کاربری
                  </span>
                  <Input
                    value={formValues.username}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                    className="h-[42px] rounded-[8px] border-[#e3e3de] bg-white px-4 text-right text-sm text-[#1f2520] shadow-none focus-visible:border-[#789B84] focus-visible:ring-3 focus-visible:ring-[#789B84]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#647069]">
                    نام و نام خانوادگی
                  </span>
                  <Input
                    value={formValues.fullName}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    className="h-[42px] rounded-[8px] border-[#e3e3de] bg-white px-4 text-right text-sm text-[#1f2520] shadow-none focus-visible:border-[#789B84] focus-visible:ring-3 focus-visible:ring-[#789B84]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#647069]">
                    ایمیل
                  </span>
                  <Input
                    type="email"
                    value={formValues.email}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className="h-[42px] rounded-[8px] border-[#e3e3de] bg-white px-4 text-right text-sm text-[#1f2520] shadow-none focus-visible:border-[#789B84] focus-visible:ring-3 focus-visible:ring-[#789B84]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#647069]">
                    تاریخ عضویت
                  </span>
                  <div className="relative">
                    <Input
                      value={formValues.joinedAt}
                      onChange={(event) =>
                        setFormValues((current) => ({
                          ...current,
                          joinedAt: event.target.value,
                        }))
                      }
                      className="h-[42px] rounded-[8px] border-[#e3e3de] bg-white pl-11 pr-4 text-right text-sm text-[#1f2520] shadow-none focus-visible:border-[#789B84] focus-visible:ring-3 focus-visible:ring-[#789B84]/15"
                    />
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#8a928c]" />
                  </div>
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-[55px] flex-1 rounded-[12px] border-[#789B84] bg-white text-base font-semibold text-[#789B84] shadow-none transition-all duration-300 hover:bg-[#f6faf7] hover:text-[#6d8d79]"
              >
                انصراف
              </Button>
              <Button
                type="button"
                className="h-[55px] flex-1 rounded-[12px] bg-[#789B84] text-base font-semibold text-white transition-all duration-300 hover:bg-[#6d8d79]"
              >
                <Save className="h-4.5 w-4.5" />
                ذخیره تغییرات
              </Button>
            </div>
          </div>

          <aside className="xl:sticky xl:top-8 xl:self-start">
            <section className="rounded-[16px] border border-[#e8e8e3] bg-white p-5 shadow-[0_18px_48px_-40px_rgba(31,37,32,0.2)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ee] text-[#789B84]">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1f2520]">
                    پیش‌نمایش زنده
                  </h2>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <ThemeThumbnail
                  theme={activeTheme}
                  pieceStyle={selectedPieceStyle}
                  showHighlight={highlightMoves}
                  showCoordinates={showCoordinates}
                  className="w-full max-w-[280px] rounded-[4px] border border-[#dde2db] shadow-[0_18px_40px_-34px_rgba(31,37,32,0.24)]"
                />
              </div>

              <div className="mt-5 rounded-[10px] bg-[#f6f7f4] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#7f8c84]">
                    <Info className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-sm leading-6 text-[#7f8781]">
                    این پیش‌نمایش بر اساس تنظیمات انتخابی شما به‌روز می‌شود.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
