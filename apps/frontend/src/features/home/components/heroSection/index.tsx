import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import { containerClassName } from "../../constants";
import HeroIllustration from "../heroIllustration";
import SectionHeading from "../sectionHeading";

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(247,248,245,1),rgba(255,255,255,1)_55%)]"
    >
      <div className={cn(containerClassName, "py-14 sm:py-16 lg:py-20")}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 space-y-8 text-right lg:order-1">
            <SectionHeading
              eyebrow="به دنیای شطرنج خوش آمدید"
              title="هوشمندانه بازی کنید، بهتر فکر کنید، برنده شوید."
              description="پلتفرمی یکپارچه برای بازی آنلاین، آموزش ساختارمند، تمرین های روزانه و ارتباط با جامعه ای که با شما رشد می کند."
            />

            <p className="max-w-[32rem] text-base leading-8 text-[var(--landing-muted)]">
              از اولین حرکت ها تا تصمیم های حرفه ای، همه چیز برای پیشرفت در
              شطرنج در یک تجربه ساده، مدرن و الهام گرفته از فضای رقابتی این بازی
              جمع شده است.
            </p>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Button
                asChild
                className="h-14 rounded-[12px] bg-[var(--landing-primary)] px-7 text-base font-semibold text-white shadow-[0_18px_40px_rgba(72,101,84,0.22)] hover:bg-[var(--landing-primary-strong)]"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2"
                >
                  <ArrowLeft className="size-5" />
                  شروع یادگیری و بازی
                </Link>
              </Button>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-3 text-sm font-semibold text-[var(--landing-text)]"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-[var(--landing-accent)] bg-white text-[var(--landing-accent)] transition-transform hover:-translate-y-0.5">
                  <Play className="mr-0.5 size-4 fill-current" />
                </span>
                <span>ویدیوی معرفی</span>
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
