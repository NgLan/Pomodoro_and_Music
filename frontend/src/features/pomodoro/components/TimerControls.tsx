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
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
      <Button className="h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-lg font-extrabold shadow-neo" onClick={onPrimary}>
        {status === "RUNNING" ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
        {translate(label)}
      </Button>
      {status !== "IDLE" && <Button variant="outline" className="h-11 sm:h-12 px-5 sm:px-6 text-base font-bold shadow-neo" onClick={onStop}><Square aria-hidden="true" className="size-5" />{translate("BTN_STOP")}</Button>}
    </div>
  );
}
