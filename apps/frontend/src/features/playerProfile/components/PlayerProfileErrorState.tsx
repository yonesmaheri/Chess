import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type PlayerProfileErrorStateProps = {
  error: unknown;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "بارگذاری پروفایل بازیکن با مشکل روبه رو شد.";
}

export default function PlayerProfileErrorState({
  error,
}: PlayerProfileErrorStateProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] px-4 py-12 text-[#1F2525]">
      <div className="mx-auto flex max-w-[720px] flex-col items-center rounded-[28px] border border-[#F1DDDD] bg-white px-6 py-10 text-center shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#FFF6F6] text-[#B45656]">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="text-2xl font-bold">پروفایل بازیکن در دسترس نیست</h1>
        <p className="mt-3 max-w-[540px] text-sm leading-7 text-[#7A7F7C]">
          {getErrorMessage(error)}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-[12px] bg-[#6F9D78] px-5 text-white hover:bg-[#5B8664]">
            <Link href="/leaderboard">بازگشت به جدول رده بندی</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-[12px] border-[#D9E1D7] px-5">
            <Link href="/">رفتن به صفحه اصلی</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
