import type { ReactNode } from "react";

type SidebarCardProps = {
  title: string;
  children: ReactNode;
};

export function SidebarCard({ title, children }: SidebarCardProps) {
  return (
    <div className="rounded-[18px] border border-[#E8E8E3] bg-white p-5 shadow-[0_18px_36px_rgba(31,37,37,0.04)] transition-transform duration-300 hover:-translate-y-1">
      <h3 className="mb-4 text-base font-bold text-[#1F2525]">{title}</h3>
      {children}
    </div>
  );
}
