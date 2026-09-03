"use client";

import { CheckCircle2, Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { CreatePomodoroHistoryRequestDto, PomodoroConfigurationResponseDto } from "@/api";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { formatDuration } from "@/shared/utils/duration";
import { usePomodoroTimer } from "../hooks/use-pomodoro-timer";
import { getCurrentRound, getNextPhase } from "../state/pomodoro-machine";
import { phaseTranslationKey } from "../utils/phase-translation";
import { TimerControls } from "./TimerControls";
import { TimerStopDialog } from "./TimerStopDialog";

function EmptyTimer({ onCreate }: { onCreate: () => void }) {
  const translate = useTranslations("pomodoro");
  const action = <Button onClick={onCreate}><Plus />{translate("BTN_CREATE_CONFIG")}</Button>;
  return <EmptyState className="min-h-[34rem]" title={translate("TXT_NO_CONFIG_TITLE")} description={translate("TXT_NO_CONFIG_DESCRIPTION")} action={action} />;
}

function TimerContent({ timer, onStop }: {
  timer: ReturnType<typeof usePomodoroTimer>;
  onStop: () => void;
}) {
  const translate = useTranslations("pomodoro");
  const { runtime } = timer;
  const round = getCurrentRound(runtime.completedFocusSessions, runtime.configurationSnapshot.focusSessionsBeforeLongBreak);
  const progress = (runtime.plannedDurationSeconds - runtime.remainingSeconds) / runtime.plannedDurationSeconds * 100;
  const next = getNextPhase(runtime.phase, runtime.completedFocusSessions, runtime.configurationSnapshot.focusSessionsBeforeLongBreak).nextPhase;
  return (
    <><CardHeader className="relative text-center">
      <div className="mb-2 flex items-center justify-center gap-2"><Badge className="border-border bg-accent-pink text-surface border-2 px-3 py-1"><Sparkles />{translate(phaseTranslationKey(runtime.phase))}</Badge></div>
      <CardTitle className="text-xl">{runtime.configurationSnapshot.name}</CardTitle>
      <CardDescription>{translate("TXT_ROUND", { current: round, total: runtime.configurationSnapshot.focusSessionsBeforeLongBreak })}</CardDescription>
    </CardHeader>
    <CardContent className="relative flex flex-1 flex-col items-center justify-center gap-7 py-5">
      {timer.transitionPhase && <div className="bg-secondary border-border flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-bold" role="status"><CheckCircle2 />{translate("TXT_TRANSITION", { phase: translate(phaseTranslationKey(timer.transitionPhase)) })}</div>}
      <div className="text-center"><p className="font-mono text-[clamp(4.5rem,13vw,8rem)] leading-none font-extrabold tracking-[-0.08em] tabular-nums">{formatDuration(runtime.remainingSeconds)}</p><p className="text-muted-foreground mt-4 text-sm font-semibold">{translate(runtime.status === "RUNNING" ? "TXT_RUNNING" : runtime.status === "PAUSED" ? "TXT_PAUSED" : "TXT_READY")}</p></div>
      <Progress className="max-w-md" value={progress} />
      <TimerControls status={runtime.status} onPrimary={timer.toggle} onStop={onStop} />
      <p className="text-muted-foreground text-xs">{translate("TXT_NEXT_PHASE", { phase: translate(phaseTranslationKey(next)) })}</p>
    </CardContent></>
  );
}

export function TimerCard({ configuration, onHistoryCreated, onNeedConfiguration }: {
  configuration?: PomodoroConfigurationResponseDto;
  onHistoryCreated: (entry: CreatePomodoroHistoryRequestDto) => void;
  onNeedConfiguration: () => void;
}) {
  if (!configuration) return <EmptyTimer onCreate={onNeedConfiguration} />;
  return <ActiveTimer configuration={configuration} onHistoryCreated={onHistoryCreated} />;
}

function ActiveTimer({ configuration, onHistoryCreated }: {
  configuration: PomodoroConfigurationResponseDto;
  onHistoryCreated: (entry: CreatePomodoroHistoryRequestDto) => void;
}) {
  const [stopOpen, setStopOpen] = useState(false);
  const timer = usePomodoroTimer(configuration, onHistoryCreated);
  const stop = () => { timer.stop(); setStopOpen(false); };
  return (
    <Card className="bg-surface relative min-h-[34rem] overflow-hidden p-2 sm:p-4">
      <span className="bg-accent-yellow border-border absolute -top-7 -right-8 size-28 rotate-12 rounded-3xl border-3" />
      <TimerContent timer={timer} onStop={() => setStopOpen(true)} />
      <TimerStopDialog open={stopOpen} onOpenChange={setStopOpen} onStop={stop} />
    </Card>
  );
}
