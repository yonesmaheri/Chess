import type { ReactNode } from "react";

import ChessBackground from "../chessBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate flex min-h-screen overflow-hidden bg-[var(--landing-soft)] text-[var(--landing-text)] md:min-h-[900px]">
      <ChessBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-[675px] flex-col items-center gap-8 sm:gap-10">
          {children}
        </div>
      </div>
    </main>
  );
}
