export const storageKeys = {
  APP_LOCALE: "cappucino:app-locale",
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
