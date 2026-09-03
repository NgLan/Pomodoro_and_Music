"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listPomodoroConfigurations,
  listPomodoroHistory,
} from "../services/pomodoro-api";

export function usePomodoroQueries(accessToken: string | null) {
  const configurations = useQuery({
    enabled: Boolean(accessToken),
    queryKey: ["pomodoro", "configurations"],
    queryFn: () => listPomodoroConfigurations(accessToken!),
  });
  const history = useQuery({
    enabled: Boolean(accessToken),
    queryKey: ["pomodoro", "history"],
    queryFn: () => listPomodoroHistory(accessToken!),
  });
  const refetch = () => {
    void configurations.refetch();
    void history.refetch();
  };
  return { configurations, history, refetch };
}
