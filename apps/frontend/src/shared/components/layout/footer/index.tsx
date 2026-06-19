import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import BrandMark from "../brandMark";
import { containerClassName, footerColumns, socialLinks } from "../constants";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-[color:var(--landing-header-border)] bg-white"
    >
      <div className={cn(containerClassName, "py-12 sm:py-14")}>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div className="space-y-5 text-right">
            <BrandMark />
            <p className="max-w-md text-sm leading-8 text-[var(--landing-muted)]">
              Chess.ir خانه ای برای یادگیری، بازی و رشد در شطرنج است. تجربه ای
              مدرن و آرام که محتوای آموزشی، تمرین و رقابت را در یک مسیر واحد جمع
              می کند.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-10 items-center justify-center rounded-full border border-[color:var(--landing-border)] text-[var(--landing-text)] transition-colors hover:border-[color:var(--landing-primary)] hover:text-[var(--landing-primary)]"
                    aria-label={item.label}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title} className="text-right">
                <h4 className="text-base font-bold text-[var(--landing-text)]">
                  {column.title}
                </h4>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-primary)]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-[var(--landing-border)]" />

        <div className="flex flex-col gap-3 text-sm text-[var(--landing-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>تمامی حقوق برای Chess.ir محفوظ است.</p>
          <p>طراحی شده برای تجربه ای آموزشی، مدرن و الهام گرفته از شطرنج.</p>
        </div>
      </div>
    </footer>
  );
}
