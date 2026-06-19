"use client";
import { Crown } from "lucide-react";
import AuthLayout from "./components/authLayout";
import AuthTabs from "./components/authTabs";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import { useState } from "react";
import AuthDivider from "./components/authDivider";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import GoogleLogo from "@/shared/components/googleLogo";

export function AuthPageFeature() {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");

  return (
    <AuthLayout>
      <div className="space-y-3 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f6d5c,#3f584a)] text-white shadow-[0_16px_40px_rgba(72,101,84,0.2)]">
          <Crown className="size-7" />
        </span>
        <div className="space-y-1.5">
          <h1 className="text-[26px] font-medium tracking-[0.22em] text-[var(--landing-text)] uppercase sm:text-[28px]">
            Chess.ir
          </h1>
          <p className="text-sm text-[var(--landing-muted)]">
            جایی برای ذهن های استراتژیک
          </p>
        </div>
      </div>
      <section className="w-full rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/75 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-[16px]">
        <AuthTabs value={activeTab} onValueChange={setActiveTab} />

        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          {activeTab === "register" ? <RegisterForm /> : <LoginForm />}
          <AuthDivider />
          <Button
            type="button"
            variant="outline"
            className="h-[60px] w-full justify-center gap-3 rounded-[12px] border-[var(--landing-border)] bg-white/60 text-base font-medium text-[var(--landing-text)] hover:bg-white"
          >
            <GoogleLogo />
            ورود با گوگل
          </Button>
          <p className="text-center text-[13px] leading-7 text-[var(--landing-muted)]">
            با ثبت نام، شما با{" "}
            <Link href="#" className="underline underline-offset-4">
              شرایط استفاده
            </Link>
            {" و "}
            <Link href="#" className="underline underline-offset-4">
              سیاست حریم خصوصی
            </Link>
            {" موافقت می کنید."}
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
