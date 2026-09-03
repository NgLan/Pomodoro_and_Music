"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAppLocale } from "@/shared/providers/locale-provider";

export function LanguageSwitcher() {
  const translate = useTranslations("pomodoro");
  const { locale, setLocale } = useAppLocale();
  return (
    <div
      aria-label={translate("ARIA_CHANGE_LANGUAGE")}
      className="border-border bg-surface flex items-center gap-1 rounded-lg border-2 p-1"
    >
      <Languages aria-hidden="true" className="mx-2 size-4" />
      {(["vi", "en"] as const).map((item) => (
        <button
          aria-pressed={locale === item}
          className="aria-pressed:bg-accent-yellow min-h-9 rounded-md px-2.5 text-xs font-extrabold"
          key={item}
          onClick={() => setLocale(item)}
          type="button"
        >
          {translate(item === "vi" ? "TXT_VIETNAMESE" : "TXT_ENGLISH")}
        </button>
      ))}
    </div>
  );
}
