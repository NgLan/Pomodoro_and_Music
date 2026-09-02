import type { AppLocale } from "@/shared/i18n/config";
import type { AppMessages } from "@/shared/i18n/messages";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: AppMessages;
  }
}
