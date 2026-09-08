import { CardContent } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import type { usePomodoroTimer } from "../hooks/use-pomodoro-timer";
import { TimerControls } from "./TimerControls";
import { TimerPhaseHeading } from "./TimerPhaseHeading";
import { TimerCountdown } from "./TimerCountdown";
import { TimerNextPhase } from "./TimerNextPhase";

interface TimerContentProps {
  timer: ReturnType<typeof usePomodoroTimer>;
  onStop: () => void;
}

export function TimerContent({ timer, onStop }: TimerContentProps) {
  const { runtime } = timer;
  const progress =
    (1 - runtime.remainingSeconds / runtime.plannedDurationSeconds) * 100;
  return (
    <>
      <TimerPhaseHeading runtime={runtime} />
      <CardContent className="relative flex flex-1 flex-col items-center justify-center gap-7 py-5">
        <TimerCountdown runtime={runtime} />
        <Progress className="max-w-md" value={progress} />
        <TimerControls
          status={runtime.status}
          onPrimary={timer.toggle}
          onStop={onStop}
        />
        <TimerNextPhase runtime={runtime} />
      </CardContent>
    </>
  );
}
