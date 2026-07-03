"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "../ui/sonner";
import { AuthProvider } from "@/shared/contexts/auth-provider";
import { SocketProvider } from "@/shared/contexts/socket-provider";
import type { AuthUser } from "@/shared/api/services/auth";

function Providers({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={initialUser}>
        <SocketProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SocketProvider>
      </AuthProvider>
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}

export default Providers;
