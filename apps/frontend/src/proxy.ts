import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/shared/constants/auth";

export function proxy(request: NextRequest) {
  const hasAccessToken = request.cookies.has(ACCESS_TOKEN_COOKIE);
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (!hasAccessToken && !hasRefreshToken) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
