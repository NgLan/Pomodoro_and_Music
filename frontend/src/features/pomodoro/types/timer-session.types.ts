import type { CreatePomodoroHistoryRequestDto } from "@/api";
import type { TimerRuntime } from "./pomodoro-ui.types";

export interface TimerSessionEvents {
  record: (entry: CreatePomodoroHistoryRequestDto) => void;
  music: (runtime: TimerRuntime) => void;
  completed: () => void;
  stopped: () => void;
}
