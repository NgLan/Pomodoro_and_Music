import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import type { TimerStatus } from "../types/pomodoro-ui.types";

interface TimerControlsProps {
  status: TimerStatus;
  canReset: boolean;
  onPrimary: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerControls(props: TimerControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <PrimaryButton status={props.status} onClick={props.onPrimary} />
      {props.status !== "IDLE" && <StopButton onClick={props.onStop} />}
      {props.canReset && <ResetButton onClick={props.onReset} />}
    </div>
  );
}

function PrimaryButton({ status, onClick }: { status: TimerStatus; onClick: () => void }) {
  const t = useTranslations("pomodoro");
  const label = status === "RUNNING" ? "BTN_PAUSE" : status === "PAUSED" ? "BTN_RESUME" : "BTN_START";
  return (
    <Button className="h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-lg font-extrabold shadow-neo" onClick={onClick}>
      {status === "RUNNING" ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
      {t(label)}
    </Button>
  );
}

function StopButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("pomodoro");
  return (
    <Button variant="outline" className="h-11 sm:h-12 px-4 sm:px-5 text-sm sm:text-base font-bold shadow-neo" onClick={onClick}>
      <Square aria-hidden="true" className="size-4.5" />
      {t("BTN_STOP")}
    </Button>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("pomodoro");
  return (
    <Button
      variant="outline"
      className="h-11 sm:h-12 px-3.5 sm:px-4 text-sm sm:text-base font-bold shadow-neo hover:bg-destructive/10"
      onClick={onClick}
      title={t("BTN_RESET_CYCLE")}
      aria-label={t("BTN_RESET_CYCLE")}
    >
      <RotateCcw aria-hidden="true" className="size-4.5" />
      {t("BTN_RESET_CYCLE")}
    </Button>
  );
}
