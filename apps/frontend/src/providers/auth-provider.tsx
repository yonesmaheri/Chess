"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  authService,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
  fetchCurrentUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialUser?: AuthUser | null;
};

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [status, setStatus] = useState<AuthStatus>(
    initialUser ? "authenticated" : "loading",
  );

  const applyAuthenticatedUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await authService.me();
      return applyAuthenticatedUser(response.user);
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, [applyAuthenticatedUser]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await authService.refresh();
      return applyAuthenticatedUser(response.user);
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, [applyAuthenticatedUser]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authService.login(payload);
      router.refresh();
      return applyAuthenticatedUser(response.user);
    },
    [applyAuthenticatedUser, router],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authService.register(payload);
      router.refresh();
      return applyAuthenticatedUser(response.user);
    },
    [applyAuthenticatedUser, router],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    if (initialUser) {
      setStatus("authenticated");
      return;
    }

    void fetchCurrentUser();
  }, [fetchCurrentUser, initialUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated" && Boolean(user),
      login,
      register,
      logout,
      refreshSession,
      fetchCurrentUser,
    }),
    [fetchCurrentUser, login, logout, refreshSession, register, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
