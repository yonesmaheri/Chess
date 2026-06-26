export default function CoursesHero() {
  return (
    <section className="grid min-h-[220px] gap-6 overflow-hidden rounded-[28px] border border-[#E8E8E3] bg-white px-6 py-6 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:px-10">
      <div className="relative min-h-[190px] overflow-hidden rounded-[24px] border border-[#EEF1EC] bg-[#FAFBF9] lg:col-start-1">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,#BFCABD_1px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-[#EEF3ED]" />
        <div className="absolute bottom-2 left-12 text-[122px] leading-none text-[#1F2525]/10">
          ♟
        </div>
        <div className="absolute right-10 top-0 text-[148px] leading-none text-[#FFFFFF] drop-shadow-[0_18px_38px_rgba(31,37,37,0.05)]">
          ♘
        </div>
        <div className="absolute bottom-6 right-16 h-5 w-24 rounded-full bg-[#1F2525]/5 blur-md" />
        <div className="absolute bottom-3 left-16 h-5 w-20 rounded-full bg-[#1F2525]/5 blur-md" />
      </div>

      <div className="space-y-5 text-right lg:col-start-2">
        <div className="inline-flex rounded-full border border-[#DDE8DF] bg-[#F3F6F1] px-4 py-2 text-sm font-medium text-[#547C5F]">
          دوره‌های تئوری شطرنج
        </div>
        <div className="space-y-3">
          <h1 className="text-[34px] font-extrabold leading-[1.25] text-[#1F2525] sm:text-[42px]">
            دوره‌های تئوری شطرنج
          </h1>
          <p className="max-w-[36rem] text-sm leading-8 text-[#7A7F7C] sm:text-base">
            مفاهیم عمیق شطرنج را بیاموزید و درک خود را از بازی ارتقا دهید.
          </p>
        </div>
      </div>
    </section>
  );
}
