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

export function TimerCard({
  configuration,
  onNeedConfiguration,
}: {
  configuration?: PomodoroConfigurationResponseDto;
  onNeedConfiguration: () => void;
}) {
  if (!configuration) return <EmptyTimer onCreate={onNeedConfiguration} />;
  return <ActiveTimer configuration={configuration} />;
}

function ActiveTimer({
  configuration,
}: {
  configuration: PomodoroConfigurationResponseDto;
}) {
  const [stopOpen, setStopOpen] = useState(false);
  const timer = usePomodoroTimer(configuration);
  const stop = () => {
    timer.stop();
    setStopOpen(false);
  };
  return (
    <Card className="bg-surface relative min-h-[34rem] overflow-hidden p-2 sm:p-4">
      <span className="bg-accent-yellow border-border absolute -top-7 -right-8 size-28 rotate-12 rounded-3xl border-3" />
      <TimerContent timer={timer} onStop={() => setStopOpen(true)} />
      <TimerStopDialog
        open={stopOpen}
        onOpenChange={setStopOpen}
        onStop={stop}
      />
    </Card>
  );
}
