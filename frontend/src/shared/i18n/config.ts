export const locales = ["vi", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "vi";
export const fallbackLocale: AppLocale = "en";
export const defaultTimeZone = "Asia/Ho_Chi_Minh";

export function isAppLocale(value: string): value is AppLocale {
  return locales.some((locale) => locale === value);
}
