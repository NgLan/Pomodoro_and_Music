"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { CreatePomodoroHistoryRequestDto, PomodoroConfigurationResponseDto, PomodoroPhaseType } from "@/api";
import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { getRemainingSeconds } from "../state/pomodoro-machine";
import { advanceRuntime, createCompletedHistory, createStoppedHistory, createTimerRuntime } from "../state/timer-runtime";
import type { TimerRuntime } from "../types/pomodoro-ui.types";

type SetRuntime = Dispatch<SetStateAction<TimerRuntime>>;

function useCompletion(
  configuration: PomodoroConfigurationResponseDto,
  createHistory: (entry: CreatePomodoroHistoryRequestDto) => void,
  setRuntime: SetRuntime,
  setTransition: Dispatch<SetStateAction<PomodoroPhaseType | null>>,
) {
  const notification = useAppNotification();
  const lock = useRef(false);
  return useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    setRuntime((current) => {
      createHistory(createCompletedHistory(current, new Date().toISOString()));
      const next = advanceRuntime(current, configuration);
      setTransition(next.phase);
      return next;
    });
    notification.success("MSG_PHASE_COMPLETED");
    window.setTimeout(() => { lock.current = false; setTransition(null); }, 2800);
  }, [configuration, createHistory, notification, setRuntime, setTransition]);
}

function useTicker(runtime: TimerRuntime, setRuntime: SetRuntime, complete: () => void) {
  useEffect(() => {
    if (runtime.status !== "RUNNING" || runtime.endAt === null) return;
    const tick = () => {
      const remainingSeconds = getRemainingSeconds(runtime.endAt!, Date.now());
      if (remainingSeconds === 0) complete();
      else setRuntime((current) => ({ ...current, remainingSeconds }));
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [complete, runtime.endAt, runtime.status, setRuntime]);
}

function toggleTimer(setRuntime: SetRuntime) {
  setRuntime((current) => {
    if (current.status === "RUNNING") {
      const remainingSeconds = getRemainingSeconds(current.endAt!, Date.now());
      return { ...current, endAt: null, remainingSeconds, status: "PAUSED" };
    }
    const now = new Date();
    return {
      ...current,
      endAt: now.getTime() + current.remainingSeconds * 1000,
      startedAt: current.startedAt ?? now.toISOString(),
      status: "RUNNING",
    };
  });
}

function stopTimer(
  runtime: TimerRuntime,
  configuration: PomodoroConfigurationResponseDto,
  createHistory: (entry: CreatePomodoroHistoryRequestDto) => void,
  setRuntime: SetRuntime,
) {
  const endedAt = new Date();
  const remaining = runtime.status === "RUNNING" && runtime.endAt
    ? getRemainingSeconds(runtime.endAt, endedAt.getTime()) : runtime.remainingSeconds;
  createHistory(createStoppedHistory(runtime, remaining, endedAt.toISOString()));
  setRuntime(createTimerRuntime(configuration, runtime.phase, runtime.completedFocusSessions));
}

export function usePomodoroTimer(
  configuration: PomodoroConfigurationResponseDto,
  createHistory: (entry: CreatePomodoroHistoryRequestDto) => void,
) {
  const notification = useAppNotification();
  const [runtime, setRuntime] = useState(() => createTimerRuntime(configuration));
  const [transitionPhase, setTransitionPhase] = useState<PomodoroPhaseType | null>(null);
  const complete = useCompletion(configuration, createHistory, setRuntime, setTransitionPhase);
  useTicker(runtime, setRuntime, complete);
  const toggle = () => toggleTimer(setRuntime);
  const stop = () => {
    stopTimer(runtime, configuration, createHistory, setRuntime);
    notification.info("MSG_PHASE_ENDED_EARLY");
  };
  return { runtime, stop, toggle, transitionPhase };
}
