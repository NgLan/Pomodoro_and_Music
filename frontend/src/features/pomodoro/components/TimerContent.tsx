import type { PomodoroConfigurationResponseDto } from "@/api";
import { CardContent } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import type { usePomodoroTimer } from "../hooks/use-pomodoro-timer";
import { TimerConfigRail } from "./TimerConfigRail";
import { TimerControls } from "./TimerControls";
import { TimerPhaseHeading } from "./TimerPhaseHeading";
import { getPhaseTheme } from "../utils/phase-theme";
import { TimerCountdown } from "./TimerCountdown";
import { TimerNextPhase } from "./TimerNextPhase";

interface TimerContentProps {
  timer: ReturnType<typeof usePomodoroTimer>;
  configurations?: PomodoroConfigurationResponseDto[];
  onSelectConfiguration?: (id: string) => void;
  onEditConfiguration?: (config: PomodoroConfigurationResponseDto) => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerContent(props: TimerContentProps) {
  const { runtime } = props.timer;
  const progress =
    (1 - runtime.remainingSeconds / runtime.plannedDurationSeconds) * 100;
  const canReset =
    runtime.phase !== "FOCUS" ||
    runtime.completedFocusSessions > 0 ||
    runtime.status !== "IDLE" ||
    runtime.remainingSeconds !== runtime.plannedDurationSeconds;
  const theme = getPhaseTheme(runtime.phase);

  return (
    <>
      <TimerPhaseHeading
        runtime={runtime}
        configurations={props.configurations}
        onSelectConfiguration={props.onSelectConfiguration}
        onEditConfiguration={props.onEditConfiguration}
      />
      <CardContent className="relative flex flex-1 flex-col items-center justify-evenly gap-2.5 sm:gap-3.5 py-2 sm:py-3">
        <TimerConfigRail configuration={runtime.configurationSnapshot} />
        <TimerCountdown runtime={runtime} />
        <Progress
          className="max-w-sm sm:max-w-md h-3.5 sm:h-4"
          indicatorClassName={theme.progressClass}
          value={progress}
        />
        <TimerControls
          status={runtime.status}
          canReset={canReset}
          onPrimary={props.timer.toggle}
          onStop={props.onStop}
          onReset={props.onReset}
        />
        <TimerNextPhase runtime={runtime} />
      </CardContent>
    </>
  );
}
