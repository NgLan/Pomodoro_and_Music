"use client";
import { useEffect, useSyncExternalStore } from "react";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { useTimerSessionStore } from "../providers/TimerSessionProvider";
import { createTimerRuntime } from "../state/timer-runtime";

export function usePomodoroTimer(
  configuration: PomodoroConfigurationResponseDto,
) {
  const store = useTimerSessionStore();
  const runtime = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  useEffect(() => {
    store.configure(configuration);
  }, [store, configuration, runtime?.status]);
  return {
    runtime: runtime ?? createTimerRuntime(configuration),
    toggle: store.toggle,
    stop: store.stop,
  };
}
