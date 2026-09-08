import { useTranslations } from "next-intl";
import { getNextPhase } from "../state/pomodoro-machine";
import type { TimerRuntime } from "../types/pomodoro-ui.types";
import { phaseTranslationKey } from "../utils/phase-translation";

export function TimerNextPhase({ runtime }: { runtime: TimerRuntime }) {
  const t = useTranslations("pomodoro");
  const next = getNextPhase(
    runtime.phase,
    runtime.completedFocusSessions,
    runtime.configurationSnapshot.focusSessionsBeforeLongBreak,
  ).nextPhase;
  return (
    <p className="text-muted-foreground text-xs">
      {t("TXT_NEXT_PHASE", { phase: t(phaseTranslationKey(next)) })}
    </p>
  );
}
