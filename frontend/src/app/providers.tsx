"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { defaultTimeZone, type AppLocale } from "@/shared/i18n/config";
import type { AppMessages } from "@/shared/i18n/messages";
import { NotificationProvider } from "@/shared/providers/notification-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";

interface ProvidersProps {
  children: ReactNode;
  locale: AppLocale;
  messages: AppMessages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={defaultTimeZone}
    >
      <QueryProvider>
        <TooltipProvider delayDuration={300}>
          <NotificationProvider>{children}</NotificationProvider>
        </TooltipProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
