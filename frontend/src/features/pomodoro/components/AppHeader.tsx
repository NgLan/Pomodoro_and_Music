"use client";

import { Coffee, History, Settings2, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { PageContainer } from "@/shared/ui/layout/AppShell";
import type { WorkspaceTab } from "../types/pomodoro-ui.types";
import { UserMenu } from "./UserMenu";

const NAVIGATION = [
  { icon: Timer, key: "timer", label: "TXT_NAV_TIMER" },
  { icon: Settings2, key: "configurations", label: "TXT_NAV_CONFIGS" },
  { icon: History, key: "history", label: "TXT_NAV_HISTORY" },
] as const;

export function AppHeader({ activeTab, onTabChange }: {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}) {
  const translate = useTranslations("pomodoro");
  return (
    <PageContainer className="flex flex-wrap items-center justify-between gap-4 py-4 lg:py-4">
      <button className="flex items-center gap-3 text-left" onClick={() => onTabChange("timer")} type="button">
        <span className="border-border bg-primary shadow-neo grid size-11 -rotate-2 place-items-center rounded-xl border-2"><Coffee aria-hidden="true" className="size-6" /></span>
        <span><strong className="block leading-tight">Cappucino</strong><span className="text-muted-foreground hidden text-xs sm:block">{translate("TXT_APP_TAGLINE")}</span></span>
      </button>
      <nav className="order-3 w-full sm:order-2 sm:w-auto" aria-label={translate("TXT_EYEBROW")}>
        <div className="bg-muted border-border grid grid-cols-3 rounded-xl border-2 p-1">
          {NAVIGATION.map(({ icon: Icon, key, label }) => (
            <button className="data-[active=true]:bg-surface data-[active=true]:shadow-neo-sm flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold" data-active={activeTab === key} key={key} onClick={() => onTabChange(key)} type="button">
              <Icon aria-hidden="true" className="size-4" /><span>{translate(label)}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="flex items-center gap-2"><LanguageSwitcher /><UserMenu /></div>
    </PageContainer>
  );
}
