"use client";

import React from "react";
import {
  BarChart3,
  Home,
  Grid3x3,
  BookOpen,
  History,
  Target,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/shared/contexts/auth-provider";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { id: "home", label: "خانه", icon: Home, href: "/dashboard" },
  { id: "play", label: "بازی", icon: Grid3x3, href: "/dashboard/play" },
  {
    id: "history",
    label: "بازی های من",
    icon: History,
    href: "/dashboard/history",
  },
  {
    id: "lessons",
    label: "درس‌ها",
    icon: BookOpen,
    href: "/dashboard/lessons",
  },
  {
    id: "training",
    label: "تمرینات",
    icon: Target,
    href: "/dashboard/training",
  },
  {
    id: "achievements",
    label: "آمار",
    icon: BarChart3,
    href: "/dashboard/achievements",
  },
  {
    id: "community",
    label: "جامعه",
    icon: Users,
    href: "/dashboard/community",
  },
  {
    id: "messages",
    label: "پیام‌ها",
    icon: MessageSquare,
    href: "/dashboard/messages",
  },
  {
    id: "settings",
    label: "تنظیمات",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside
      dir="rtl"
      className="sticky top-0 right-0 z-40 flex h-screen w-[110px] shrink-0 flex-col items-center overflow-y-hidden border-l border-[#e7e9e8] bg-white py-6"
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#7f9f85] flex items-center justify-center mb-2">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-sm font-bold text-[#252a2e]">شطرنج</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-4 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-[#7f9f85] text-white"
                  : "text-[#8a8f94] hover:text-[#252a2e]",
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => logout()}
        className="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-[#8a8f94] hover:text-[#d32f2f] transition-all duration-200"
        title="خروج"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[10px] mt-1">خروج</span>
      </button>
    </aside>
  );
}
