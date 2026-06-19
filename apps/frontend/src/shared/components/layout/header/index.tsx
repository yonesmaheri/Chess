import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { containerClassName, navItems } from "../constants";
import MobileNavigation from "../mobileNavigation";
import BrandMark from "../brandMark";

export default function Header() {
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 border-b border-[color:var(--landing-header-border)] bg-white/90 backdrop-blur"
    >
      <div className={cn(containerClassName, "flex h-20 items-center gap-4")}>
        <div className="flex flex-1 justify-start gap-3 lg:hidden">
          <MobileNavigation />
        </div>
        <div className="flex flex-1 justify-start">
          <BrandMark />
        </div>
        <nav className="hidden flex-2 items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "relative text-center py-2 text-sm font-medium text-[var(--landing-text-soft)] transition-colors hover:text-[var(--landing-text)]",
                item.active && "text-[var(--landing-text)] border-b border-b-2 border-landing-accent",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-1 justify-end gap-3">
          <Button
            variant="outline"
            asChild
            className="hidden h-10 rounded-[10px] border-[color:var(--landing-border)] bg-transparent px-5 text-sm text-[var(--landing-text)] hover:bg-[var(--landing-soft)] lg:inline-flex"
          >
            <Link href="/login">ورود</Link>
          </Button>
          <Button
            asChild
            className="hidden h-10 rounded-[10px] bg-[var(--landing-primary)] px-5 text-sm text-white hover:bg-[var(--landing-primary-strong)] lg:inline-flex"
          >
            <Link href="/register">ثبت نام</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
