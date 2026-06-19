import { ArrowLeft } from "lucide-react";

import { containerClassName, features } from "../../constants";
import SectionHeading from "../sectionHeading";

export default function FeatureSection() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24">
      <div className={containerClassName}>
        <SectionHeading
          centered
          title="همه چیز برای پیشرفت در شطرنج"
          description="چه برای شروع مسیر یادگیری آمده باشید و چه برای رقابت جدی، ابزارها و محتواهای مورد نیاز شما در کنار هم قرار گرفته اند."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-[18px] border border-[var(--landing-border)] bg-white p-6 shadow-[0_10px_35px_rgba(36,38,43,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(36,38,43,0.08)]"
              >
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[var(--landing-soft)] text-[var(--landing-primary)]">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-lg font-bold text-[var(--landing-text)]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-[var(--landing-muted)]">
                  {feature.description}
                </p>
                <a
                  href={feature.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-primary)]"
                >
                  بیشتر ببینید
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
