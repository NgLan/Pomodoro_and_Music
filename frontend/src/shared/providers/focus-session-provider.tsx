"use client";
import type { ReactNode } from "react";
import { PlayerProvider } from "@/features/music-player/providers/PlayerProvider";
import { PersistentPlayer } from "@/features/music-player/components/PersistentPlayer";
import { TimerSessionProvider } from "@/features/pomodoro/providers/TimerSessionProvider";
import { useAuth } from "./auth-provider";

export function FocusSessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <PlayerProvider key={user?.id ?? "anonymous"}>
      <TimerSessionProvider>
        {children}
        {user && <PersistentPlayer />}
      </TimerSessionProvider>
    </PlayerProvider>
  );
}
