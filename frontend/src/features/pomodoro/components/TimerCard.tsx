"use client";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { usePomodoroTimer } from "../hooks/use-pomodoro-timer";
import { TimerContent } from "./TimerContent";
import { TimerResetDialog } from "./TimerResetDialog";
import { TimerStopDialog } from "./TimerStopDialog";

function EmptyTimer({ onCreate }: { onCreate: () => void }) {
  const translate = useTranslations("pomodoro");
  const action = (
    <Button onClick={onCreate}>
      <Plus />
      {translate("BTN_CREATE_CONFIG")}
    </Button>
  );
  return (
    <EmptyState
      className="min-h-[34rem]"
      title={translate("TXT_NO_CONFIG_TITLE")}
      description={translate("TXT_NO_CONFIG_DESCRIPTION")}
      action={action}
    />
  );
}

interface TimerCardProps {
  configuration?: PomodoroConfigurationResponseDto;
  configurations?: PomodoroConfigurationResponseDto[];
  onNeedConfiguration: () => void;
  onSelectConfiguration?: (id: string) => void;
  onEditConfiguration?: (config: PomodoroConfigurationResponseDto) => void;
}

export function TimerCard(props: TimerCardProps) {
  if (!props.configuration) return <EmptyTimer onCreate={props.onNeedConfiguration} />;
  return <ActiveTimer {...props} configuration={props.configuration} />;
}

function ActiveTimer(props: TimerCardProps & { configuration: PomodoroConfigurationResponseDto }) {
  const [stopOpen, setStopOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const timer = usePomodoroTimer(props.configuration);
  const stop = () => { timer.stop(); setStopOpen(false); };
  const reset = () => { timer.reset(); setResetOpen(false); };

  return (
    <Card className="bg-surface relative flex flex-col justify-between overflow-hidden p-3 sm:p-4 gap-2 sm:gap-3 min-h-[32rem] sm:min-h-[34rem]">
      <span className="bg-accent-yellow border-border absolute -top-7 -right-8 size-20 rotate-12 rounded-3xl border-3" />
      <TimerContent
        timer={timer}
        configurations={props.configurations}
        onSelectConfiguration={props.onSelectConfiguration}
        onEditConfiguration={props.onEditConfiguration}
        onStop={() => setStopOpen(true)}
        onReset={() => setResetOpen(true)}
      />
      <TimerStopDialog open={stopOpen} onOpenChange={setStopOpen} onStop={stop} />
      <TimerResetDialog open={resetOpen} onOpenChange={setResetOpen} onConfirm={reset} />
    </Card>
  );
}
