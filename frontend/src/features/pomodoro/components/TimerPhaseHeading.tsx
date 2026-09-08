import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { getCurrentRound } from "../state/pomodoro-machine";
import type { TimerRuntime } from "../types/pomodoro-ui.types";
import { phaseTranslationKey } from "../utils/phase-translation";
import { TimerConfigSelector } from "./TimerConfigSelector";

interface TimerPhaseHeadingProps {
  runtime: TimerRuntime;
  configurations?: PomodoroConfigurationResponseDto[];
  onSelectConfiguration?: (id: string) => void;
  onEditConfiguration?: (config: PomodoroConfigurationResponseDto) => void;
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
  const showSelector = Boolean(
    configurations?.length && onSelectConfiguration && onEditConfiguration,
  );
  return (
    <CardHeader className="relative text-center pb-0 pt-1 sm:pt-1.5">
      <div className="mb-1.5 flex items-center justify-center gap-1.5">
        <Badge className="border-border bg-accent-pink text-surface border-2 px-3 py-0.5 text-xs font-bold">
          <Sparkles className="size-3.5" />
          {t(phaseTranslationKey(runtime.phase))}
        </Badge>
      </div>
      {showSelector ? (
        <TimerConfigSelector
          configurations={configurations!}
          selected={runtime.configurationSnapshot}
          onSelect={onSelectConfiguration!}
          onEdit={onEditConfiguration!}
        />
      ) : (
        <CardTitle className="text-lg sm:text-xl">{runtime.configurationSnapshot.name}</CardTitle>
      )}
      <CardDescription className="mt-1 text-xs sm:text-sm font-semibold">{t("TXT_ROUND", { current, total })}</CardDescription>
    </CardHeader>
  );
}
