import { useTranslations } from "next-intl";
import type {
  PomodoroConfigurationResponseDto,
  PomodoroHistoryResponseDto,
} from "@/api";

function TodayStats({
  configuration,
  entries,
}: {
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
  const seconds = focus.reduce(
    (total, entry) => total + entry.actualDurationSeconds,
    0,
  );
  const items = [
    [translate("TXT_TODAY_FOCUS"), formatFocusTime(seconds, translate)],
    [translate("TXT_TODAY_SESSIONS"), String(focus.length)],
    [translate("TXT_ACTIVE_CONFIG"), configuration?.name ?? "—"],
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {items.map(([label, value]) => (
        <div
          className="border-border bg-surface shadow-neo-sm min-w-0 rounded-lg border-2 px-2 py-1"
          key={label}
        >
          <span className="text-muted-foreground block truncate text-[0.62rem] font-bold uppercase">
            {label}
          </span>
          <strong className="block truncate text-xs leading-tight sm:text-sm">
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}

export function WorkspaceHero({
  configuration,
  history,
}: {
  configuration?: PomodoroConfigurationResponseDto;
  history: PomodoroHistoryResponseDto[];
}) {
  const translate = useTranslations("pomodoro");
  return (
    <header className="flex flex-wrap items-center justify-between gap-2.5">
      <div>
        <span className="text-accent-pink text-[0.65rem] font-extrabold tracking-wide uppercase">
          {translate("TXT_EYEBROW")}
        </span>
        <h1 className="text-lg leading-tight font-extrabold tracking-tight sm:text-xl">
          {translate("TXT_PAGE_TITLE")}
        </h1>
      </div>
      <TodayStats configuration={configuration} entries={history} />
    </header>
  );
}

type PomodoroTranslator = (
  key: "TXT_HOURS_SHORT" | "TXT_MINUTES_SHORT" | "TXT_SECONDS_SHORT",
) => string;

export function formatFocusTime(
  totalSeconds: number,
  t: PomodoroTranslator,
): string {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${t("TXT_HOURS_SHORT")}`);
  if (minutes > 0 || hours > 0)
    parts.push(`${minutes} ${t("TXT_MINUTES_SHORT")}`);
  parts.push(`${seconds} ${t("TXT_SECONDS_SHORT")}`);

  return parts.join(" ");
}
