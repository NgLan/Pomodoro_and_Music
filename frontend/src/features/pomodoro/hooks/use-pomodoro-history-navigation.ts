"use client";

import { useMemo, useState } from "react";
import type { HistoryFilterValue } from "../types/pomodoro-ui.types";
import {
  createPomodoroHistoryQuery,
  INITIAL_HISTORY_FILTERS,
} from "../utils/pomodoro-history-query";

export function usePomodoroHistoryNavigation() {
  const [historyFilters, setHistoryFilters] = useState(INITIAL_HISTORY_FILTERS);
  const [historyPage, setHistoryPage] = useState(1);
  const historyQuery = useMemo(
    () => createPomodoroHistoryQuery(historyFilters, historyPage),
    [historyFilters, historyPage],
  );
  const updateHistoryFilters = (filters: HistoryFilterValue) => {
    setHistoryFilters(filters);
    setHistoryPage(1);
  };
  return {
    historyFilters,
    historyPage,
    historyQuery,
    setHistoryPage,
    updateHistoryFilters,
  };
}
