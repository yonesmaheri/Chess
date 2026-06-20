import { ReactNode } from "react";
import AuthGuard from "@/shared/components/authGuard";
import Sidebar from "@/shared/components/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full flex-row overflow-hidden">
        <Sidebar />
        <div
          dir="rtl"
          className="flex flex-1 flex-col overflow-hidden bg-[#fafafa]"
        >
          <div className="w-full flex-1 overflow-y-auto px-8">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
