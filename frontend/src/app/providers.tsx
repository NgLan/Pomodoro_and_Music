"use client";

import type { ReactNode } from "react";

import type { AppLocale } from "@/shared/i18n/config";
import type { AppMessages } from "@/shared/i18n/messages";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { AppLocaleProvider } from "@/shared/providers/locale-provider";
import { NotificationProvider } from "@/shared/providers/notification-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { FocusSessionProvider } from "@/shared/providers/focus-session-provider";

interface ProvidersProps {
  children: ReactNode;
  locale: AppLocale;
  messages: AppMessages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  void messages;
  return (
    <AppLocaleProvider initialLocale={locale}>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={300}>
            <NotificationProvider>
              <FocusSessionProvider>{children}</FocusSessionProvider>
            </NotificationProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </AppLocaleProvider>
  );
}
