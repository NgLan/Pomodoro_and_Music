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
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <Button className="h-9 sm:h-10 px-4 sm:px-5 font-bold" onClick={onPrimary}>
        {status === "RUNNING" ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        {translate(label)}
      </Button>
      {status !== "IDLE" && <Button variant="outline" className="h-9 sm:h-10 px-4 font-bold" onClick={onStop}><Square aria-hidden="true" className="size-4" />{translate("BTN_STOP")}</Button>}
    </div>
  );
}
