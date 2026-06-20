import { AxiosHeaders } from "axios";
import { getCookieValue } from "@/shared/lib/cookies";
import { CSRF_TOKEN_COOKIE } from "@/shared/constants/auth";
import type { RetryableRequestConfig } from "./types";

export function buildCsrfHeaders() {
  const csrfToken = getCookieValue(CSRF_TOKEN_COOKIE);

  return csrfToken ? { "X-CSRF-Token": csrfToken } : {};
}

export function shouldSkipRefresh(config?: RetryableRequestConfig) {
  const url = config?.url ?? "";

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    config?.headers?.get?.("x-skip-auth-refresh") === "true"
  );
}
