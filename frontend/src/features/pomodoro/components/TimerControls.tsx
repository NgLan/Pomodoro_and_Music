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

function PrimaryButton({
  status,
  onClick,
}: {
  status: TimerStatus;
  onClick: () => void;
}) {
  const t = useTranslations("pomodoro");
  const label =
    status === "RUNNING"
      ? "BTN_PAUSE"
      : status === "PAUSED"
        ? "BTN_RESUME"
        : "BTN_START";
  return (
    <Button
      className="shadow-neo h-11 px-6 text-base font-extrabold sm:h-12 sm:px-8 sm:text-lg"
      onClick={onClick}
    >
      {status === "RUNNING" ? (
        <Pause aria-hidden="true" className="size-5" />
      ) : (
        <Play aria-hidden="true" className="size-5" />
      )}
      {t(label)}
    </Button>
  );
}

function StopButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("pomodoro");
  return (
    <Button
      variant="outline"
      className="shadow-neo h-11 px-4 text-sm font-bold sm:h-12 sm:px-5 sm:text-base"
      onClick={onClick}
    >
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
      className="shadow-neo hover:bg-destructive/10 h-11 px-3.5 text-sm font-bold sm:h-12 sm:px-4 sm:text-base"
      onClick={onClick}
      title={t("BTN_RESET_CYCLE")}
      aria-label={t("BTN_RESET_CYCLE")}
    >
      <RotateCcw aria-hidden="true" className="size-4.5" />
      {t("BTN_RESET_CYCLE")}
    </Button>
  );
}
