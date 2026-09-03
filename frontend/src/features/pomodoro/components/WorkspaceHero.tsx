import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto, PomodoroHistoryResponseDto } from "@/api";

function TodayStats({ configuration, entries }: {
  configuration?: PomodoroConfigurationResponseDto;
  entries: PomodoroHistoryResponseDto[];
}) {
  const translate = useTranslations("pomodoro");
  const today = new Date().toDateString();
  const focus = entries.filter((entry) => new Date(entry.startedAt).toDateString() === today && entry.phaseType === "FOCUS" && entry.status === "COMPLETED");
  const seconds = focus.reduce((total, entry) => total + entry.actualDurationSeconds, 0);
  const items = [
    [translate("TXT_TODAY_FOCUS"), `${Math.round(seconds / 60)} ${translate("TXT_MINUTES_SHORT")}`],
    [translate("TXT_TODAY_SESSIONS"), String(focus.length)],
    [translate("TXT_ACTIVE_CONFIG"), configuration?.name ?? "—"],
  ];
  return <div className="grid grid-cols-3 gap-2 sm:gap-3">{items.map(([label, value]) => <div className="border-border bg-surface shadow-neo min-w-0 rounded-xl border-2 p-3 sm:min-w-32" key={label}><span className="text-muted-foreground block truncate text-[0.68rem] font-bold uppercase">{label}</span><strong className="mt-1 block truncate text-sm sm:text-base">{value}</strong></div>)}</div>;
}

export function WorkspaceHero({ configuration, history }: {
  configuration?: PomodoroConfigurationResponseDto;
  history: PomodoroHistoryResponseDto[];
}) {
  const translate = useTranslations("pomodoro");
  return (
    <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="max-w-3xl"><span className="text-accent-pink text-sm font-extrabold uppercase">{translate("TXT_EYEBROW")}</span><h1 className="mt-2 max-w-2xl text-[clamp(2.35rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.04em]">{translate("TXT_PAGE_TITLE")}</h1><p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">{translate("TXT_PAGE_DESCRIPTION")}</p></div>
      <TodayStats configuration={configuration} entries={history} />
    </header>
  );
}
