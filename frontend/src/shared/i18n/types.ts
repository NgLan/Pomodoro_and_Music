import { messagesByLocale, type AppMessages } from "./messages";

export type CommonMessageKey = keyof AppMessages["common"];
export type NotificationMessageKey = keyof AppMessages["notifications"];
export type ErrorMessageKey = keyof AppMessages["errors"];

const errorMessageKeys: ReadonlySet<string> = new Set(
  Object.keys(messagesByLocale.vi.errors),
);

const notificationMessageKeys: ReadonlySet<string> = new Set(
  Object.keys(messagesByLocale.vi.notifications),
);

export function isErrorMessageKey(value: string): value is ErrorMessageKey {
  return errorMessageKeys.has(value);
}

export function isNotificationMessageKey(
  value: string,
): value is NotificationMessageKey {
  return notificationMessageKeys.has(value);
}
