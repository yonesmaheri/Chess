import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSessionUser } from "@/shared/api/services/auth/auth-server";

export default async function LobbyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth?redirect=/lobby");
  }

  return children;
}
