"use client";

import { Coffee, Music2, Timer } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppUserMenu } from "@/shared/components/AppUserMenu";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { routes } from "@/shared/config/routes";
import { PageContainer } from "@/shared/ui/layout/AppShell";

export function PlaylistHeader() {
  const translate = useTranslations("playlist");
  return (
    <PageContainer className="flex flex-wrap items-center justify-between gap-4 py-4 lg:py-4">
      <Link className="flex items-center gap-3" href={routes.HOME}>
        <span className="border-border bg-primary shadow-neo grid size-11 -rotate-2 place-items-center rounded-xl border-2">
          <Coffee aria-hidden="true" className="size-6" />
        </span>
        <span>
          <strong className="block leading-tight">Cappucino</strong>
          <span className="text-muted-foreground hidden text-xs sm:block">
            {translate("TXT_APP_TAGLINE")}
          </span>
        </span>
      </Link>
      <nav
        aria-label={translate("ARIA_MAIN_NAV")}
        className="bg-muted border-border order-3 flex w-full rounded-xl border-2 p-1 sm:order-2 sm:w-auto"
      >
        <Link
          className="hover:bg-surface flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold"
          href={routes.HOME}
        >
          <Timer aria-hidden="true" className="size-4" />
          {translate("TXT_NAV_POMODORO")}
        </Link>
        <Link
          aria-current="page"
          className="bg-surface shadow-neo-sm flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold"
          href={routes.PLAYLISTS}
        >
          <Music2 aria-hidden="true" className="size-4" />
          {translate("TXT_NAV_PLAYLISTS")}
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <AppUserMenu />
      </div>
    </PageContainer>
  );
}
