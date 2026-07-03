export default function MatchmakingLoading() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#FCFDFC] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-12 w-3/4 rounded-lg bg-[#E5EAE2] animate-pulse"></div>
          <div className="h-4 w-1/2 rounded-lg bg-[#EEF4EC] animate-pulse"></div>
        </div>

        {/* Animation Skeleton */}
        <div className="flex justify-center py-8">
          <div className="size-[120px] rounded-full border-4 border-[#E5EAE2] bg-[#F8FAF7] animate-pulse"></div>
        </div>

        {/* Players Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="size-20 rounded-full bg-[#EEF4EC] animate-pulse"></div>
              <div className="h-6 w-32 rounded-lg bg-[#E5EAE2] animate-pulse"></div>
              <div className="h-8 w-24 rounded-full bg-[#EEF4EC] animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Status Box Skeleton */}
        <div className="h-16 rounded-[20px] border border-[#E5EAE2] bg-[#F8FAF7] animate-pulse"></div>

        {/* Button Skeleton */}
        <div className="flex justify-center">
          <div className="h-11 w-32 rounded-[16px] bg-[#E5EAE2] animate-pulse"></div>
        </div>
      </div>
    </main>
  );
}
