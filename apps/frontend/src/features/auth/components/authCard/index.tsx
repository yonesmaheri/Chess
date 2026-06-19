"use client";

import { useState } from "react";

import {
  loginFormContent,
  registerFormContent,
  type AuthTab,
} from "../../constants";
import AuthTabs from "../authTabs";
import LoginForm from "../loginForm";
import RegisterForm from "../registerForm";

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState<AuthTab>("register");

  return (
    <section className="w-full rounded-[24px] border border-[rgba(230,230,230,0.9)] bg-white/75 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-[16px]">
      <AuthTabs value={activeTab} onValueChange={setActiveTab} />

      <div className="p-6 sm:p-8 md:p-10 lg:p-12">
        {activeTab === "register" ? (
          <RegisterForm {...registerFormContent} />
        ) : (
          <LoginForm {...loginFormContent} />
        )}
      </div>
    </section>
  );
}
