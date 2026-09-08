"use client";

import { Coffee, Music2, Timer } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppUserMenu } from "@/shared/components/AppUserMenu";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { routes } from "@/shared/config/routes";

export function PlaylistHeader() {
  return (
    <div className="mx-auto flex w-full max-w-(--content-max-width) items-center justify-between gap-2 px-4 py-1.5 sm:gap-4 sm:px-6 sm:py-2 lg:px-10">
      <PlaylistLogo />
      <PlaylistNav />
      <div className="order-2 flex items-center gap-1.5 sm:order-3 sm:gap-2">
        <LanguageSwitcher />
        <AppUserMenu />
      </div>
    </div>
  );
}

function PlaylistLogo() {
  const translate = useTranslations("playlist");
  return (
    <Link className="order-1 flex items-center gap-2 sm:gap-3" href={routes.HOME}>
      <span className="border-border bg-primary shadow-neo grid size-9 -rotate-2 place-items-center rounded-lg border-2 sm:size-10 sm:rounded-xl">
        <Coffee aria-hidden="true" className="size-5" />
      </span>
      <span>
        <strong className="block text-sm leading-tight sm:text-base">Cappucino</strong>
        <span className="text-muted-foreground hidden text-xs sm:block">
          {translate("TXT_APP_TAGLINE")}
        </span>
      </span>
    </Link>
  );
}

function PlaylistNav() {
  const translate = useTranslations("playlist");
  return (
    <nav
      aria-label={translate("ARIA_MAIN_NAV")}
      className="bg-muted border-border order-last hidden sm:order-2 sm:flex rounded-xl border-2 p-0.5 sm:p-1"
    >
      <Link
        className="hover:bg-surface flex h-8.5 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold sm:px-3 sm:text-sm"
        href={routes.HOME}
      >
        <Timer aria-hidden="true" className="size-3.5 sm:size-4" />
        {translate("TXT_NAV_POMODORO")}
      </Link>
      <Link
        aria-current="page"
        className="bg-surface shadow-neo-sm flex h-8.5 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold sm:px-3 sm:text-sm"
        href={routes.PLAYLISTS}
      >
        <Music2 aria-hidden="true" className="size-3.5 sm:size-4" />
        {translate("TXT_NAV_PLAYLISTS")}
      </Link>
    </nav>
  );
}
