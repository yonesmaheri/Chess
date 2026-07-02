import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/lib/utils";
import { navItems } from "../constants";

export default function MobileNavigation() {
  const pathname = usePathname();

  const isNavItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-11 rounded-xl border-[color:var(--landing-border)] bg-white text-[var(--landing-text)] lg:hidden"
        >
          <Menu className="size-5" />
          <span className="sr-only">باز کردن منو</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85%] border-[color:var(--landing-border)] bg-white px-0"
      >
        <SheetHeader className="border-b border-[color:var(--landing-border)] px-6 py-5 text-right">
          <SheetTitle className="text-right text-lg font-bold text-[var(--landing-text)]">
            منوی اصلی
          </SheetTitle>
          <SheetDescription className="text-right leading-7 text-[var(--landing-muted)]">
            به بخش های اصلی صفحه و مسیر ثبت نام سریع دسترسی دارید.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-6 py-6">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.href);

            return (
              <SheetClose asChild key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--landing-soft)] text-[var(--landing-primary)]"
                      : "text-[var(--landing-text)] hover:bg-[var(--landing-soft)]",
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </div>
        <div className="mt-auto grid gap-3 px-6 pb-6">
          <Button
            variant="outline"
            asChild
            className="h-11 rounded-xl border-[color:var(--landing-border)] text-[var(--landing-text)]"
          >
            <Link href="/login">ورود</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-xl bg-[var(--landing-primary)] text-white hover:bg-[var(--landing-primary-strong)]"
          >
            <Link href="/register">ثبت نام</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
