"use client";
import { Crown } from "lucide-react";
import AuthLayout from "./components/authLayout";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import AuthDivider from "./components/authDivider";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import Link from "next/link";
import GoogleLogo from "@/shared/components/googleLogo";

export function AuthPageFeature() {
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
      <Tabs
        defaultValue="register"
        className="w-full rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/75 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-[16px]"
      >
        <TabsList
          variant="line"
          className="grid h-[60px] w-full grid-cols-2 items-stretch rounded-none p-0"
        >
          <TabsTrigger
            value="register"
            className="h-full w-full rounded-none border-0 bg-transparent px-6 py-4 text-lg font-semibold text-[var(--landing-muted)] data-active:text-[var(--landing-text)] data-active:bg-transparent after:bottom-0 after:h-[3px] after:bg-[var(--landing-text)] focus-visible:ring-0"
          >
            ثبت نام
          </TabsTrigger>
          <TabsTrigger
            value="login"
            className="h-full w-full rounded-none border-0 bg-transparent px-6 py-4 text-lg font-semibold text-[var(--landing-muted)] data-active:text-[var(--landing-text)] data-active:bg-transparent after:bottom-0 after:h-[3px] after:bg-[var(--landing-text)] focus-visible:ring-0"
          >
            ورود
          </TabsTrigger>
        </TabsList>

        <TabsContent
          dir="rtl"
          value="register"
          className="p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <RegisterForm />
        </TabsContent>

        <TabsContent
          dir="rtl"
          value="login"
          className="p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <LoginForm />
        </TabsContent>
        <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-10 lg:px-12 lg:pb-12">
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
      </Tabs>
    </AuthLayout>
  );
}
