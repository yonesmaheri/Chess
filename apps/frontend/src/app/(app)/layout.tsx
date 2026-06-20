import { ReactNode } from "react";
import AuthGuard from "@/shared/components/authGuard";
import Sidebar from "@/shared/components/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-row w-full h-screen">
        <Sidebar />
        <div
          dir="rtl"
          className="flex-1 bg-[#fafafa] flex flex-col"
        >
            <div className="px-8 w-full">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
