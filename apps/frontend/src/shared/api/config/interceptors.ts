"use client";

import { AxiosError, AxiosHeaders } from "axios";
import { apiClient, refreshClient } from "./axios";
import { buildCsrfHeaders, shouldSkipRefresh } from "./utils";
import type { RetryableRequestConfig } from "./types";

let refreshPromise: Promise<void> | null = null;

export function setupInterceptors() {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

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
}
