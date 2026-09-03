import { Pause, Play, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import type { TimerStatus } from "../types/pomodoro-ui.types";

export function TimerControls({ status, onPrimary, onStop }: {
  status: TimerStatus;
  onPrimary: () => void;
  onStop: () => void;
}) {
  const translate = useTranslations("pomodoro");
  const label = status === "RUNNING" ? "BTN_PAUSE" : status === "PAUSED" ? "BTN_RESUME" : "BTN_START";
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="lg" onClick={onPrimary}>
        {status === "RUNNING" ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        {translate(label)}
      </Button>
      {status !== "IDLE" && <Button variant="outline" size="lg" onClick={onStop}><Square aria-hidden="true" />{translate("BTN_STOP")}</Button>}
    </div>
  );
}
