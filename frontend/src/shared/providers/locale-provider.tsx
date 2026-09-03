"use client";

import { NextIntlClientProvider } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  isAppLocale,
  type AppLocale,
  defaultTimeZone,
} from "@/shared/i18n/config";
import { messagesByLocale } from "@/shared/i18n/messages";
import {
  readStorageValue,
  writeStorageValue,
} from "@/shared/lib/storage/storage";
import { storageKeys } from "@/shared/lib/storage/storage-keys";

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const localeCodec = {
  parse(value: unknown): AppLocale {
    if (typeof value === "string" && isAppLocale(value)) {
      return value;
    }
    throw new TypeError("Invalid application locale");
  },
};

function useLocaleState(initialLocale: AppLocale) {
  const [locale, setLocaleState] = useState(initialLocale);
  const setLocale = useCallback((nextLocale: AppLocale) => {
    setLocaleState(nextLocale);
    writeStorageValue(storageKeys.APP_LOCALE, nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  useEffect(() => {
    const savedLocale = readStorageValue(storageKeys.APP_LOCALE, localeCodec);
    if (savedLocale) {
      const timeoutId = window.setTimeout(() => {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  return useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
}

export function AppLocaleProvider({ children, initialLocale }: {
  children: ReactNode;
  initialLocale: AppLocale;
}) {
  const contextValue = useLocaleState(initialLocale);
  const { locale } = contextValue;
  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesByLocale[locale]}
        timeZone={defaultTimeZone}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useAppLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useAppLocale must be used within AppLocaleProvider");
  }
  return value;
}
