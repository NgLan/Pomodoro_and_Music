import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto, PomodoroHistoryResponseDto } from "@/api";

function TodayStats({ configuration, entries }: {
  configuration?: PomodoroConfigurationResponseDto;
  entries: PomodoroHistoryResponseDto[];
}) {
  const translate = useTranslations("pomodoro");
  const today = new Date().toDateString();
  const focus = entries.filter(
    (entry) =>
      new Date(entry.startedAt).toDateString() === today &&
      entry.phaseType === "FOCUS",
  );
  const seconds = focus.reduce((total, entry) => total + entry.actualDurationSeconds, 0);
  const items = [
    [translate("TXT_TODAY_FOCUS"), `${Math.round(seconds / 60)} ${translate("TXT_MINUTES_SHORT")}`],
    [translate("TXT_TODAY_SESSIONS"), String(focus.length)],
    [translate("TXT_ACTIVE_CONFIG"), configuration?.name ?? "—"],
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {items.map(([label, value]) => (
        <div className="border-border bg-surface shadow-neo-sm min-w-0 rounded-lg border-2 px-2 py-1" key={label}>
          <span className="text-muted-foreground block truncate text-[0.62rem] font-bold uppercase">{label}</span>
          <strong className="block truncate text-xs sm:text-sm leading-tight">{value}</strong>
        </div>
      ))}
    </div>
  );
}

export function WorkspaceHero({ configuration, history }: {
  configuration?: PomodoroConfigurationResponseDto;
  history: PomodoroHistoryResponseDto[];
}) {
  const translate = useTranslations("pomodoro");
  return (
    <header className="flex flex-wrap items-center justify-between gap-2.5">
      <div>
        <span className="text-accent-pink text-[0.65rem] font-extrabold uppercase tracking-wide">{translate("TXT_EYEBROW")}</span>
        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight">{translate("TXT_PAGE_TITLE")}</h1>
      </div>
      <TodayStats configuration={configuration} entries={history} />
    </header>
  );
}
