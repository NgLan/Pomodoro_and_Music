import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enErrors from "./locales/en/errors.json";
import enNotifications from "./locales/en/notifications.json";
import enPomodoro from "./locales/en/pomodoro.json";
import viAuth from "./locales/vi/auth.json";
import viCommon from "./locales/vi/common.json";
import viErrors from "./locales/vi/errors.json";
import viNotifications from "./locales/vi/notifications.json";
import viPomodoro from "./locales/vi/pomodoro.json";
import type { AppLocale } from "./config";

export const messagesByLocale = {
  vi: {
    auth: viAuth,
    common: viCommon,
    errors: viErrors,
    notifications: viNotifications,
    pomodoro: viPomodoro,
  },
  en: {
    auth: enAuth,
    common: enCommon,
    errors: enErrors,
    notifications: enNotifications,
    pomodoro: enPomodoro,
  },
} as const satisfies Record<AppLocale, object>;

export type AppMessages = (typeof messagesByLocale)["vi"];
