import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { getCurrentRound } from "../state/pomodoro-machine";
import type { TimerRuntime } from "../types/pomodoro-ui.types";
import { phaseTranslationKey } from "../utils/phase-translation";

export function TimerPhaseHeading({ runtime }: { runtime: TimerRuntime }) {
  const t = useTranslations("pomodoro");
  const total = runtime.configurationSnapshot.focusSessionsBeforeLongBreak;
  const current = getCurrentRound(runtime.completedFocusSessions, total);
  return (
    <CardHeader className="relative text-center">
      <div className="mb-2 flex items-center justify-center gap-2">
        <Badge className="border-border bg-accent-pink text-surface border-2 px-3 py-1">
          <Sparkles />
          {t(phaseTranslationKey(runtime.phase))}
        </Badge>
      </div>
      <CardTitle className="text-xl">
        {runtime.configurationSnapshot.name}
      </CardTitle>
      <CardDescription>{t("TXT_ROUND", { current, total })}</CardDescription>
    </CardHeader>
  );
}
