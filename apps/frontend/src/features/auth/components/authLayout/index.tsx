import type { ReactNode } from "react";

import ChessBackground from "../chessBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate flex min-h-screen overflow-hidden bg-[var(--landing-soft)] text-[var(--landing-text)]">
      <ChessBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex w-full max-w-[580px] flex-col items-center gap-4 sm:gap-5">
          {children}
        </div>
      </div>
    </main>
  );
}
