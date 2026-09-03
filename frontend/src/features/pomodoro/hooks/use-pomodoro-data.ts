"use client";

import { useMemo, useState } from "react";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { useAuth } from "@/shared/providers/auth-provider";
import { useConfigurationActions, useHistoryRecorder } from "./use-pomodoro-actions";
import { usePomodoroQueries } from "./use-pomodoro-queries";

export function usePomodoroData() {
  const { accessToken } = useAuth();
  const [editing, setEditing] = useState<PomodoroConfigurationResponseDto | null>(null);
  const queries = usePomodoroQueries(accessToken);
  const actions = useConfigurationActions(accessToken!, editing);
  const record = useHistoryRecorder(accessToken!);
  const configurations = useMemo(() => queries.configurations.data ?? [],
    [queries.configurations.data]);
  const history = useMemo(() => queries.history.data?.items ?? [],
    [queries.history.data]);
  const save = async (draft: Parameters<typeof actions.save>[0]) => {
    const value = await actions.save(draft);
    setEditing(null);
    return value;
  };
  return {
    configurations, editing, history,
    isError: queries.configurations.isError || queries.history.isError,
    isLoading: queries.configurations.isLoading || queries.history.isLoading,
    record, refetch: queries.refetch, remove: actions.remove,
    save, setEditing,
  };
}
