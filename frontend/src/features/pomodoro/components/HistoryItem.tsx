import { CheckCircle2, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroHistoryResponseDto } from "@/api";
import { Badge } from "@/shared/ui/badge";
import { useAppLocale } from "@/shared/providers/locale-provider";
import { formatDateTime } from "@/shared/utils/date-time";
import { formatDuration } from "@/shared/utils/duration";
import { phaseTranslationKey } from "../utils/phase-translation";

export function HistoryItem({ entry }: { entry: PomodoroHistoryResponseDto }) {
  const translate = useTranslations("pomodoro");
  const { locale } = useAppLocale();
  const completed = entry.status === "COMPLETED";
  return (
    <article className="border-border bg-surface shadow-neo grid gap-4 rounded-xl border-2 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <span className={`${completed ? "bg-secondary" : "bg-accent-yellow"} border-border grid size-11 place-items-center rounded-lg border-2`}>{completed ? <CheckCircle2 /> : <Square />}</span>
      <div><div className="flex flex-wrap items-center gap-2"><strong>{entry.configurationName ?? translate("TXT_DELETED_CONFIG")}</strong><Badge variant="outline">{translate(phaseTranslationKey(entry.phaseType))}</Badge><Badge className={completed ? "bg-secondary" : "bg-accent-yellow"}>{translate(completed ? "TXT_COMPLETED" : "TXT_ENDED_EARLY")}</Badge></div><p className="text-muted-foreground mt-1 text-sm">{formatDateTime(entry.startedAt, locale)}</p></div>
      <div className="grid grid-cols-2 gap-5 text-sm sm:text-right"><span><small className="text-muted-foreground block">{translate("TXT_PLANNED")}</small><strong>{formatDuration(entry.plannedDurationSeconds)}</strong></span><span><small className="text-muted-foreground block">{translate("TXT_ACTUAL")}</small><strong>{formatDuration(entry.actualDurationSeconds)}</strong></span></div>
    </article>
  );
}
