"use client";

import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookieValue } from "@/shared/lib/cookies";
import { CSRF_TOKEN_COOKIE } from "@/shared/constants/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function buildCsrfHeaders() {
  const csrfToken = getCookieValue(CSRF_TOKEN_COOKIE);

  return csrfToken ? { "X-CSRF-Token": csrfToken } : {};
}

function shouldSkipRefresh(config?: RetryableRequestConfig) {
  const url = config?.url ?? "";

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    config?.headers?.get?.("x-skip-auth-refresh") === "true"
  );
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshClient
        .post("/auth/refresh", undefined, {
          headers: buildCsrfHeaders(),
        })
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.delete("x-skip-auth-refresh");

      return apiClient({
        ...originalRequest,
        headers,
      });
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
