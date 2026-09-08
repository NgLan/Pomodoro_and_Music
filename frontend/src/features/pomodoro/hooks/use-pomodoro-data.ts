"use client";

import { useState } from "react";
import type {
  PomodoroConfigurationResponseDto,
  PomodoroHistoryListData,
} from "@/api";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  useConfigurationActions,
  useHistoryRecorder,
} from "./use-pomodoro-actions";
import { usePomodoroQueries } from "./use-pomodoro-queries";

function readQueryState(queries: ReturnType<typeof usePomodoroQueries>) {
  return {
    configurations: queries.configurations.data ?? [],
    historyConfigurations: queries.historyConfigurations.data ?? [],
    history: queries.history.data?.items ?? [],
    historyMeta: queries.history.data?.meta,
    isError:
      queries.configurations.isError ||
      queries.historyConfigurations.isError ||
      queries.history.isError ||
      queries.recentHistory.isError,
    isHistoryFetching: queries.history.isFetching,
    isLoading:
      queries.configurations.isLoading ||
      queries.historyConfigurations.isLoading ||
      queries.history.isLoading ||
      queries.recentHistory.isLoading,
    recentHistory: queries.recentHistory.data?.items ?? [],
  };
}

export function usePomodoroData(
  historyQuery: NonNullable<PomodoroHistoryListData["query"]>,
) {
  const { accessToken } = useAuth();
  const [editing, setEditing] =
    useState<PomodoroConfigurationResponseDto | null>(null);
  const queries = usePomodoroQueries(accessToken, historyQuery);
  const actions = useConfigurationActions(accessToken!, editing);
  const record = useHistoryRecorder(accessToken!);
  const save = async (draft: Parameters<typeof actions.save>[0]) => {
    const value = await actions.save(draft);
    setEditing(null);
    return value;
  };
  return {
    ...readQueryState(queries),
    editing,
    record,
    refetch: queries.refetch,
    remove: actions.remove,
    save,
    setEditing,
  };
}
