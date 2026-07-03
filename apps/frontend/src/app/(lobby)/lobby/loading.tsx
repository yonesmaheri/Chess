import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LobbyLoading() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-11 w-40 rounded-[16px] bg-[#EDF2EC]" />
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-8 w-40 rounded-full bg-[#EDF2EC]" />
            <Skeleton className="h-5 w-64 rounded-full bg-[#EDF2EC]" />
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-3 lg:grid-cols-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-[#E5EAE2] bg-white p-6 shadow-[0_24px_60px_rgba(31,37,37,0.04)]"
            >
              <Skeleton className="mb-4 h-12 w-12 rounded-full bg-[#EDF2EC]" />
              <Skeleton className="h-7 w-40 rounded-full bg-[#EDF2EC]" />
              <Skeleton className="mt-3 h-5 w-full rounded-full bg-[#EDF2EC]" />
              <Skeleton className="mt-2 h-5 w-5/6 rounded-full bg-[#EDF2EC]" />
              <Skeleton className="mt-8 h-14 w-full rounded-[18px] bg-[#EDF2EC]" />
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-16 rounded-[24px] bg-[#EDF2EC]"
            />
          ))}
        </section>
      </div>
    </main>
  );
}
