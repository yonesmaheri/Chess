import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthResponse, AuthUser } from "@/services/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

export async function getServerSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      cookie: cookieHeader,
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as AuthResponse;
  return data.user;
}

export async function redirectAuthenticatedUser() {
  const user = await getServerSessionUser();

  if (user) {
    redirect("/dashboard");
  }
}
