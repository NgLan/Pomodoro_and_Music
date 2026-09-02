import enCommon from "./locales/en/common.json";
import enErrors from "./locales/en/errors.json";
import enNotifications from "./locales/en/notifications.json";
import viCommon from "./locales/vi/common.json";
import viErrors from "./locales/vi/errors.json";
import viNotifications from "./locales/vi/notifications.json";
import type { AppLocale } from "./config";

export const messagesByLocale = {
  vi: {
    common: viCommon,
    errors: viErrors,
    notifications: viNotifications,
  },
  en: {
    common: enCommon,
    errors: enErrors,
    notifications: enNotifications,
  },
} as const satisfies Record<AppLocale, object>;

export type AppMessages = (typeof messagesByLocale)["vi"];
