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
      <div className="space-y-1.5 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f6d5c,#3f584a)] text-white shadow-[0_16px_40px_rgba(72,101,84,0.2)] sm:size-12">
          <Crown className="size-5 sm:size-6" />
        </span>
        <div className="space-y-1">
          <h1 className="text-[22px] font-medium tracking-[0.14em] text-[var(--landing-text)] uppercase sm:text-2xl">
            Chess.ir
          </h1>
          <p className="text-xs text-[var(--landing-muted)]">
            جایی برای ذهن های استراتژیک
          </p>
        </div>
      </div>
      <Tabs
        defaultValue="register"
        className="w-full rounded-[20px] border border-[rgba(230,230,230,0.9)] bg-white/75 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-[16px]"
      >
        <TabsList
          variant="line"
          className="grid h-12 w-full grid-cols-2 items-stretch rounded-none p-0"
        >
          <TabsTrigger
            value="register"
            className="h-full w-full rounded-none border-0 bg-transparent px-4 py-2.5 text-[15px] font-semibold text-[var(--landing-muted)] data-active:text-[var(--landing-text)] data-active:bg-transparent after:bottom-0 after:h-[3px] after:bg-[var(--landing-text)] focus-visible:ring-0"
          >
            ثبت نام
          </TabsTrigger>
          <TabsTrigger
            value="login"
            className="h-full w-full rounded-none border-0 bg-transparent px-4 py-2.5 text-[15px] font-semibold text-[var(--landing-muted)] data-active:text-[var(--landing-text)] data-active:bg-transparent after:bottom-0 after:h-[3px] after:bg-[var(--landing-text)] focus-visible:ring-0"
          >
            ورود
          </TabsTrigger>
        </TabsList>

        <TabsContent
          dir="rtl"
          value="register"
          className="p-4 sm:p-5 md:p-6 lg:px-8 lg:py-6"
        >
          <RegisterForm />
        </TabsContent>

        <TabsContent
          dir="rtl"
          value="login"
          className="p-4 sm:p-5 md:p-6 lg:px-8 lg:py-6"
        >
          <LoginForm />
        </TabsContent>
        <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6 lg:px-8 lg:pb-6">
          <AuthDivider />
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full justify-center gap-2.5 rounded-[10px] border-[color:var(--landing-border)] bg-white/60 text-sm font-medium text-[var(--landing-text)] hover:bg-white"
          >
            <GoogleLogo />
            ورود با گوگل
          </Button>
          <p className="text-center text-[11px] leading-5 text-[var(--landing-muted)] sm:text-xs sm:leading-6">
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
