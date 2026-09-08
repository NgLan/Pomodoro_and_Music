import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/cn";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { getCurrentRound } from "../state/pomodoro-machine";
import type { TimerRuntime } from "../types/pomodoro-ui.types";
import { phaseTranslationKey } from "../utils/phase-translation";
import { getPhaseTheme } from "../utils/phase-theme";
import { TimerConfigSelector } from "./TimerConfigSelector";

interface TimerPhaseHeadingProps {
  runtime: TimerRuntime;
  configurations?: PomodoroConfigurationResponseDto[];
  onSelectConfiguration?: (id: string) => void;
  onEditConfiguration?: (config: PomodoroConfigurationResponseDto) => void;
}

function HeadingTitle({
  snapshot,
  configurations,
  onSelect,
  onEdit,
}: {
  snapshot: PomodoroConfigurationResponseDto;
  configurations?: PomodoroConfigurationResponseDto[];
  onSelect?: (id: string) => void;
  onEdit?: (config: PomodoroConfigurationResponseDto) => void;
}) {
  if (configurations?.length && onSelect && onEdit) {
    return (
      <TimerConfigSelector
        configurations={configurations}
        selected={snapshot}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );
  }
  return <CardTitle className="text-lg sm:text-xl">{snapshot.name}</CardTitle>;
}

export function TimerPhaseHeading({
  runtime,
  configurations,
  onSelectConfiguration,
  onEditConfiguration,
}: TimerPhaseHeadingProps) {
  const t = useTranslations("pomodoro");
  const total = runtime.configurationSnapshot.focusSessionsBeforeLongBreak;
  const current = getCurrentRound(
    runtime.completedFocusSessions,
    total,
    runtime.phase,
  );
  const theme = getPhaseTheme(runtime.phase);
  const Icon = theme.icon;

  return (
    <CardHeader className="relative pt-1 pb-0 text-center sm:pt-1.5">
      <div className="mb-1.5 flex items-center justify-center gap-1.5">
        <Badge
          className={cn(
            "border-border border-2 px-3 py-0.5 text-xs font-bold transition-colors",
            theme.badgeClass,
          )}
        >
          <Icon className="size-3.5" />
          {t(phaseTranslationKey(runtime.phase))}
        </Badge>
      </div>
      <HeadingTitle
        snapshot={runtime.configurationSnapshot}
        configurations={configurations}
        onSelect={onSelectConfiguration}
        onEdit={onEditConfiguration}
      />
      <CardDescription className="mt-1 text-xs font-semibold sm:text-sm">
        {t("TXT_ROUND", { current, total })}
      </CardDescription>
    </CardHeader>
  );
}
