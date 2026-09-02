import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { defaultLocale } from "@/shared/i18n/config";
import { messagesByLocale } from "@/shared/i18n/messages";
import { QueryProvider } from "@/shared/providers/query-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function TestProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider
      locale={defaultLocale}
      messages={messagesByLocale[defaultLocale]}
    >
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
