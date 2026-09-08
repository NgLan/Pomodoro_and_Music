"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTimerSessionEvents } from "../hooks/use-timer-session-events";
import {
  createTimerSessionStore,
  type TimerSessionStore,
} from "../state/timer-session-store";

const TimerContext = createContext<TimerSessionStore | null>(null);

export function TimerSessionProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createTimerSessionStore);
  useTimerSessionEvents(store);
  useEffect(() => {
    const id = setInterval(store.tick, 250);
    return () => clearInterval(id);
  }, [store]);
  return (
    <TimerContext.Provider value={store}>{children}</TimerContext.Provider>
  );
}

export function useTimerSessionStore() {
  const store = useContext(TimerContext);
  if (!store) throw new Error("TimerSessionProvider is required");
  return store;
}
