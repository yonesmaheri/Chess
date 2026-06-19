import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { containerClassName } from "../../constants";

export default function CTASection() {
  return (
    <section id="cta" className="pb-8 sm:pb-10 lg:pb-12">
      <div className={containerClassName}>
        <div className="flex flex-col items-start justify-between gap-5 rounded-[24px] bg-[var(--landing-banner)] px-6 py-6 sm:px-8 lg:flex-row lg:items-center">
          <div className="space-y-2 text-right">
            <p className="text-sm font-semibold text-[var(--landing-accent)]">
              آماده شروع هستید؟
            </p>
            <h3 className="text-2xl font-bold text-[var(--landing-text)]">
              همین امروز عضو شوید و مسیر حرفه ای خود را آغاز کنید.
            </h3>
            <p className="text-sm leading-7 text-[var(--landing-muted)]">
              حساب کاربری بسازید، سطح خود را مشخص کنید و برنامه یادگیری مناسب
              خود را تحویل بگیرید.
            </p>
          </div>
          <Button
            asChild
            className="h-12 rounded-[12px] bg-[var(--landing-primary)] px-6 text-white hover:bg-[var(--landing-primary-strong)]"
          >
            <Link href="/register">ایجاد حساب کاربری</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
