import { useTranslations } from "next-intl";
import { formatDuration } from "@/shared/utils/duration";
import type { TimerRuntime } from "../types/pomodoro-ui.types";

export function TimerCountdown({ runtime }: { runtime: TimerRuntime }) {
  const t = useTranslations("pomodoro");
  const status =
    runtime.status === "RUNNING"
      ? "TXT_RUNNING"
      : runtime.status === "PAUSED"
        ? "TXT_PAUSED"
        : "TXT_READY";
  return (
    <div className="text-center">
      <p className="font-mono text-[clamp(4.25rem,10vw,6.5rem)] leading-none font-extrabold tracking-[-0.05em] tabular-nums">
        {formatDuration(runtime.remainingSeconds)}
      </p>
      <p className="text-muted-foreground mt-2.5 text-sm sm:text-base font-semibold">
        {t(status)}
      </p>
    </div>
  );
}
