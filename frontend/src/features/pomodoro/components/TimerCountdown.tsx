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
      <p className="font-mono text-[clamp(2.5rem,6vw,4.25rem)] leading-none font-extrabold tracking-[-0.08em] tabular-nums">
        {formatDuration(runtime.remainingSeconds)}
      </p>
      <p className="text-muted-foreground mt-1 text-xs font-semibold">
        {t(status)}
      </p>
    </div>
  );
}
