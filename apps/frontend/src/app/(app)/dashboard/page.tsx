"use client";

import AuthGuard from "@/shared/components/authGuard";
import { useAuth } from "@/providers/auth-provider";

function DashboardContent() {
  const { user } = useAuth();

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full rounded-[28px] border border-[var(--landing-border)] bg-white p-8 shadow-sm">
        <p className="text-sm text-[var(--landing-muted)]">
          داشبورد حساب کاربری
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--landing-text)]">
          {user ? `${user.firstName} ${user.lastName}` : "کاربر Chess.ir"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--landing-muted)]">
          ورود شما با کوکی‌های امن سمت سرور مدیریت می‌شود و در این صفحه
          می‌توانید وضعیت نشست فعلی را بررسی کنید.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[var(--landing-surface)] p-5">
            <p className="text-xs text-[var(--landing-muted)]">شماره همراه</p>
            <p className="mt-2 text-base font-semibold text-[var(--landing-text)]">
              {user?.phone ?? "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--landing-surface)] p-5">
            <p className="text-xs text-[var(--landing-muted)]">شناسه کاربر</p>
            <p className="mt-2 break-all text-sm font-medium text-[var(--landing-text)]">
              {user?.id ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
