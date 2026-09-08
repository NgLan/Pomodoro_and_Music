import { useEffect } from "react";
import { usePlayerStore } from "@/features/music-player/providers/PlayerProvider";
import { useAuth } from "@/shared/providers/auth-provider";
import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { useHistoryRecorder } from "./use-pomodoro-actions";
import type { TimerSessionStore } from "../state/timer-session-store";
import type { TimerRuntime } from "../types/pomodoro-ui.types";

export function useTimerSessionEvents(store: TimerSessionStore) {
  const player = usePlayerStore();
  const { accessToken } = useAuth();
  const record = useHistoryRecorder(accessToken!);
  const notification = useAppNotification();
  useEffect(() => {
    store.setEvents({
      record,
      music: (runtime) => player.activate(phasePlaylist(runtime)),
      completed: () => notification.success("MSG_PHASE_COMPLETED"),
      stopped: () => notification.info("MSG_PHASE_ENDED_EARLY"),
    });
  }, [store, player, record, notification]);
}

export function phasePlaylist(runtime: TimerRuntime) {
  return runtime.phase === "FOCUS"
    ? runtime.configurationSnapshot.focusPlaylistId
    : runtime.configurationSnapshot.breakPlaylistId;
}
