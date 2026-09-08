"use client";

import { Coffee, History, Music2, Settings2, Timer } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { AppUserMenu } from "@/shared/components/AppUserMenu";
import { routes } from "@/shared/config/routes";
import type { WorkspaceTab } from "../types/pomodoro-ui.types";

const NAVIGATION = [
  { icon: Timer, key: "timer", label: "TXT_NAV_TIMER" },
  { icon: Settings2, key: "configurations", label: "TXT_NAV_CONFIGS" },
  { icon: History, key: "history", label: "TXT_NAV_HISTORY" },
] as const;

export function AppHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-(--content-max-width) items-center justify-between gap-2 px-4 py-1.5 sm:gap-4 sm:px-6 sm:py-2 lg:px-10">
      <AppLogo onSelect={() => onTabChange("timer")} />
      <AppNavigation activeTab={activeTab} onTabChange={onTabChange} />
      <div className="order-2 flex items-center gap-1.5 sm:order-3 sm:gap-2">
        <LanguageSwitcher />
        <AppUserMenu />
      </div>
    </div>
  );
}

function AppLogo({ onSelect }: { onSelect: () => void }) {
  const translate = useTranslations("pomodoro");
  return (
    <button className="order-1 flex items-center gap-2 text-left sm:gap-3" onClick={onSelect} type="button">
      <span className="border-border bg-primary shadow-neo grid size-9 -rotate-2 place-items-center rounded-lg border-2 sm:size-10 sm:rounded-xl">
        <Coffee aria-hidden="true" className="size-5" />
      </span>
      <span>
        <strong className="block text-sm leading-tight sm:text-base">Cappucino</strong>
        <span className="text-muted-foreground hidden text-xs sm:block">{translate("TXT_APP_TAGLINE")}</span>
      </span>
    </button>
  );
}

function AppNavigation({ activeTab, onTabChange }: { activeTab: WorkspaceTab; onTabChange: (tab: WorkspaceTab) => void }) {
  const translate = useTranslations("pomodoro");
  return (
    <nav className="order-last hidden sm:order-2 sm:block" aria-label={translate("TXT_EYEBROW")}>
      <div className="bg-muted border-border flex rounded-xl border-2 p-0.5 sm:p-1">
        {NAVIGATION.map(({ icon: Icon, key, label }) => (
          <button
            className="data-[active=true]:bg-surface data-[active=true]:shadow-neo-sm flex h-8.5 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold sm:px-3 sm:text-sm"
            data-active={activeTab === key}
            key={key}
            onClick={() => onTabChange(key)}
            type="button"
          >
            <Icon aria-hidden="true" className="size-3.5 sm:size-4" />
            <span>{translate(label)}</span>
          </button>
        ))}
        <Link className="hover:bg-surface flex h-8.5 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold sm:px-3 sm:text-sm" href={routes.PLAYLISTS}>
          <Music2 aria-hidden="true" className="size-3.5 sm:size-4" />
          <span>{translate("TXT_NAV_PLAYLISTS")}</span>
        </Link>
      </div>
    </nav>
  );
}
