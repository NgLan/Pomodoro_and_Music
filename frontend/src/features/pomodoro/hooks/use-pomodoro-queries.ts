"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PomodoroHistoryListData } from "@/api";
import {
  listPomodoroConfigurations,
  listPomodoroHistory,
} from "../services/pomodoro-api";
import { HISTORY_PAGE_SIZE } from "../utils/pomodoro-history-query";

const RECENT_HISTORY_QUERY = { page: 1, pageSize: HISTORY_PAGE_SIZE };
type HistoryQuery = NonNullable<PomodoroHistoryListData["query"]>;

function useConfigurationsQuery(accessToken: string | null) {
  return useQuery({
    enabled: Boolean(accessToken),
    queryKey: ["pomodoro", "configurations"],
    queryFn: () => listPomodoroConfigurations(accessToken!),
  });
}

function useHistoryQuery(
  accessToken: string | null,
  query: HistoryQuery,
  preservesData = false,
) {
  return useQuery({
    enabled: Boolean(accessToken),
    placeholderData: preservesData ? keepPreviousData : undefined,
    queryKey: ["pomodoro", "history", query],
    queryFn: () => listPomodoroHistory(accessToken!, query),
  });
}

export function usePomodoroQueries(
  accessToken: string | null,
  historyQuery: HistoryQuery,
) {
  const configurations = useConfigurationsQuery(accessToken);
  const recentHistory = useHistoryQuery(accessToken, RECENT_HISTORY_QUERY);
  const history = useHistoryQuery(accessToken, historyQuery, true);
  const refetch = () => {
    void configurations.refetch();
    void recentHistory.refetch();
    void history.refetch();
  };
  return { configurations, history, recentHistory, refetch };
}
