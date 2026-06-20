"use client";

import { setupInterceptors } from "@/shared/api/config";

// Initialize interceptors
setupInterceptors();

export { apiClient } from "@/shared/api/config";
export type { RetryableRequestConfig } from "@/shared/api/config";
