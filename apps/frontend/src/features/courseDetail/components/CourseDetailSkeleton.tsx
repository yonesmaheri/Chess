import { Skeleton } from "@/shared/components/ui/skeleton";

export function CourseDetailSkeleton() {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#1F2525]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="space-y-5">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-14 w-3/4 rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-28 rounded-[20px]" />
              ))}
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-[12px]" />
              <Skeleton className="h-14 w-40 rounded-[12px]" />
            </div>
          </div>
          <Skeleton className="h-[420px] rounded-[24px]" />
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-[18px]" />
          ))}
        </section>

        <section className="mt-8 space-y-4 rounded-[22px] border border-[#E8E8E3] bg-white p-5 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:p-7">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-72 rounded-[18px]" />
        </section>
      </div>
    </main>
  );
}
