import type { PomodoroConfigurationResponseDto } from "@/api";
import { CardContent } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import type { usePomodoroTimer } from "../hooks/use-pomodoro-timer";
import { TimerControls } from "./TimerControls";
import { TimerPhaseHeading } from "./TimerPhaseHeading";
import { TimerCountdown } from "./TimerCountdown";
import { TimerNextPhase } from "./TimerNextPhase";

interface TimerContentProps {
  timer: ReturnType<typeof usePomodoroTimer>;
  configurations?: PomodoroConfigurationResponseDto[];
  onSelectConfiguration?: (id: string) => void;
  onEditConfiguration?: (config: PomodoroConfigurationResponseDto) => void;
  onStop: () => void;
}

export function TimerContent(props: TimerContentProps) {
  const { runtime } = props.timer;
  const progress =
    (1 - runtime.remainingSeconds / runtime.plannedDurationSeconds) * 100;
  return (
    <>
      <TimerPhaseHeading
        runtime={runtime}
        configurations={props.configurations}
        onSelectConfiguration={props.onSelectConfiguration}
        onEditConfiguration={props.onEditConfiguration}
      />
      <CardContent className="relative flex flex-1 flex-col items-center justify-evenly gap-2 sm:gap-3 py-2 sm:py-3">
        <TimerCountdown runtime={runtime} />
        <Progress className="max-w-xs sm:max-w-sm" value={progress} />
        <TimerControls
          status={runtime.status}
          onPrimary={props.timer.toggle}
          onStop={props.onStop}
        />
        <TimerNextPhase runtime={runtime} />
      </CardContent>
    </>
  );
}
