import { AxiosHeaders } from "axios";
import { apiClient } from "@/api/axios";
import { CSRF_TOKEN_COOKIE } from "@/shared/constants/auth";
import { getCookieValue } from "@/shared/lib/cookies";

export type AuthUser = {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginPayload = {
  phone: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
};

function buildCsrfHeaders() {
  const headers = new AxiosHeaders();
  const csrfToken = getCookieValue(CSRF_TOKEN_COOKIE);

  if (csrfToken) {
    headers.set("X-CSRF-Token", csrfToken);
  }

  return headers;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async logout() {
    const { data } = await apiClient.post<{ success: boolean }>(
      "/auth/logout",
      undefined,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async refresh() {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/refresh",
      undefined,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async me() {
    const { data } = await apiClient.get<AuthResponse>("/auth/me");

    return data;
  },
};
