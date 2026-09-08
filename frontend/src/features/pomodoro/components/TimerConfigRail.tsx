import { Clock3, Coffee } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";

interface TimerConfigRailProps {
  configuration?: PomodoroConfigurationResponseDto;
}

interface RailItemData {
  label: string;
  value: string;
  color: string;
  icon: typeof Clock3;
}

export function TimerConfigRail({ configuration }: TimerConfigRailProps) {
  const t = useTranslations("pomodoro");
  if (!configuration) return null;
  const items = getRailItems(configuration, t);

  return (
    <>
      <aside
        aria-label={t("TXT_CONFIG_SUMMARY")}
        className="hidden sm:flex sm:absolute sm:left-2 md:left-3 sm:top-1 md:top-2 flex-col gap-1.5 md:gap-2 z-10"
      >
        {items.map((item) => (
          <RailItem key={item.label} item={item} />
        ))}
      </aside>
      <div className="flex sm:hidden flex-wrap items-center justify-center gap-1.5 w-full">
        {items.map((item) => (
          <MobileRailItem key={item.label} item={item} />
        ))}
      </div>
    </>
  );
}

function RailItem({ item }: { item: RailItemData }) {
  const Icon = item.icon;
  return (
    <div className="border-border bg-surface shadow-neo-sm flex items-center gap-2 rounded-xl border-2 px-2.5 py-1.5 min-w-[7.5rem] md:min-w-[8.25rem]">
      <span
        className={`${item.color} border-border grid size-7 shrink-0 place-items-center rounded-lg border-2`}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <span className="text-muted-foreground block truncate text-[0.62rem] font-bold uppercase leading-tight">
          {item.label}
        </span>
        <strong className="block truncate text-xs md:text-sm font-extrabold leading-tight">
          {item.value}
        </strong>
      </div>
    </div>
  );
}

function MobileRailItem({ item }: { item: RailItemData }) {
  return (
    <span className="border-border bg-surface shadow-neo-sm border rounded-lg px-2 py-0.5 text-[0.68rem] font-bold flex items-center gap-1">
      <span className="text-muted-foreground">{item.label}:</span>
      <span>{item.value}</span>
    </span>
  );
}

function getRailItems(
  cfg: PomodoroConfigurationResponseDto,
  t: ReturnType<typeof useTranslations<"pomodoro">>,
): RailItemData[] {
  return [
    {
      label: t("TXT_FOCUS_DURATION"),
      value: `${cfg.focusDurationSeconds / 60} ${t("TXT_MINUTES_SHORT")}`,
      color: "bg-primary text-primary-foreground",
      icon: Clock3,
    },
    {
      label: t("TXT_SHORT_BREAK_DURATION"),
      value: `${cfg.shortBreakDurationSeconds / 60} ${t("TXT_MINUTES_SHORT")}`,
      color: "bg-secondary text-secondary-foreground",
      icon: Clock3,
    },
    {
      label: t("TXT_LONG_BREAK_DURATION"),
      value: `${cfg.longBreakDurationSeconds / 60} ${t("TXT_MINUTES_SHORT")}`,
      color: "bg-accent-purple text-accent-purple-foreground",
      icon: Clock3,
    },
    {
      label: t("TXT_LONG_BREAK_AFTER"),
      value: `${cfg.focusSessionsBeforeLongBreak} ${t("TXT_SESSION_SHORT")}`,
      color: "bg-accent-yellow text-accent-yellow-foreground",
      icon: Coffee,
    },
  ];
}
