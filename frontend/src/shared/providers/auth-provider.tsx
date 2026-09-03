"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef,
  useState, type ReactNode,
} from "react";

import {
  authLogin, authLogout, authRefresh, authRegister,
  type AuthSessionResponseDto, type AuthUserResponseDto,
  type LoginRequestDto, type RegisterRequestDto,
} from "@/api";

interface AuthContextValue {
  accessToken: string | null;
  isInitializing: boolean;
  login: (input: LoginRequestDto) => Promise<void>;
  logout: () => Promise<void>;
  register: (input: RegisterRequestDto) => Promise<void>;
  user: AuthUserResponseDto | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readSession(envelope: { data?: AuthSessionResponseDto }): AuthSessionResponseDto {
  if (!envelope.data) throw new Error("Authentication response has no data");
  return envelope.data;
}

function useRefreshSession(setSession: (value: AuthSessionResponseDto | null) => void) {
  const refreshSession = useCallback(async () => {
    try {
      const response = await authRefresh({ throwOnError: true });
      const nextSession = readSession(response.data);
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      setSession(null);
      throw error;
    }
  }, [setSession]);
  return refreshSession;
}

function useSessionBootstrap(refreshSession: () => Promise<AuthSessionResponseDto>) {
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    void refreshSession()
      .catch(() => undefined)
      .finally(() => setIsInitializing(false));
  }, [refreshSession]);
  return isInitializing;
}

function useSessionRotation(session: AuthSessionResponseDto | null, refreshSession: () => Promise<unknown>) {
  useEffect(() => {
    if (!session) return;
    const refreshInMilliseconds = Math.max(
      30_000,
      (session.accessTokenExpiresInSeconds - 60) * 1_000,
    );
    const timeoutId = window.setTimeout(() => {
      void refreshSession().catch(() => undefined);
    }, refreshInMilliseconds);
    return () => window.clearTimeout(timeoutId);
  }, [refreshSession, session]);
}

function useAuthActions(setSession: (value: AuthSessionResponseDto | null) => void) {
  const login = useCallback(async (input: LoginRequestDto) => {
    const response = await authLogin({ body: input, throwOnError: true });
    setSession(readSession(response.data));
  }, [setSession]);

  const register = useCallback(async (input: RegisterRequestDto) => {
    const response = await authRegister({ body: input, throwOnError: true });
    setSession(readSession(response.data));
  }, [setSession]);

  const logout = useCallback(async () => {
    await authLogout({ throwOnError: true });
    setSession(null);
  }, [setSession]);
  return { login, logout, register };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSessionResponseDto | null>(null);
  const refreshSession = useRefreshSession(setSession);
  const isInitializing = useSessionBootstrap(refreshSession);
  useSessionRotation(session, refreshSession);
  const { login, logout, register } = useAuthActions(setSession);
  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      isInitializing,
      login,
      logout,
      register,
      user: session?.user ?? null,
    }),
    [isInitializing, login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
