import Link from "next/link";

type MatchSessionPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams: Promise<{
    opponent?: string;
  }>;
};

export const metadata = {
  title: "اتاق بازی",
  description: "ورود به اتاق بازی پس از یافتن حریف در matchmaking.",
};

export default async function MatchSessionPage({
  params,
  searchParams,
}: MatchSessionPageProps) {
  const { sessionId } = await params;
  const { opponent } = await searchParams;

  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] px-4 py-10 text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[28px] border border-[#E5EAE2] bg-white p-8 shadow-[0_24px_60px_rgba(31,37,37,0.06)]">
        <div className="text-right">
          <p className="text-sm font-semibold text-[#7F9F85]">اتاق بازی</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            حریف پیدا شد
          </h1>
          <p className="mt-3 text-base leading-7 text-[#6E7772]">
            شما و {opponent ?? "حریف شما"} وارد یک جلسه مشترک شده‌اید. این صفحه
            می‌تواند نقطه شروع Game Room نهایی باشد.
          </p>
        </div>

        <div className="grid gap-4 rounded-[20px] border border-[#EEF1EC] bg-[#F8FAF7] p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#6E7772]">شناسه جلسه</p>
            <p className="mt-2 break-all font-mono text-sm text-[#1F2525]">
              {sessionId}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#6E7772]">حریف</p>
            <p className="mt-2 text-base font-semibold text-[#1F2525]">
              {opponent ?? "درحال همگام‌سازی اطلاعات حریف"}
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-dashed border-[#DCE4D9] bg-[#FCFDFC] p-5 text-right">
          <p className="text-sm leading-7 text-[#6E7772]">
            مرحله بعدی می‌تواند بارگذاری برد، ساعت بازی، وضعیت اتصال هر دو بازیکن
            و همگام‌سازی حرکات باشد.
          </p>
        </div>

        <div className="flex justify-end">
          <Link
            href="/lobby"
            className="inline-flex h-11 items-center rounded-[16px] bg-[#7F9F85] px-6 text-sm font-semibold text-white transition hover:bg-[#6E8F74]"
          >
            بازگشت به لابی
          </Link>
        </div>
      </div>
    </main>
  );
}
