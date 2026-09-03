"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useAuth } from "@/shared/providers/auth-provider";
import { LoadingState } from "@/shared/ui/states/StandardStates";
import { AuthScreen } from "./AuthScreen";

export function AuthGate({ children }: { children: ReactNode }) {
  const translate = useTranslations("auth");
  const { isInitializing, user } = useAuth();
  if (isInitializing) {
    return (
      <main className="grid min-h-svh place-items-center p-6">
        <LoadingState className="w-full max-w-lg" title={translate("TXT_AUTH_LOADING")} description={translate("TXT_WELCOME_DESCRIPTION")} />
      </main>
    );
  }
  return user ? children : <AuthScreen />;
}
