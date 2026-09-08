import type { PomodoroHistoryListData } from "@/api";
import type { HistoryFilterValue } from "../types/pomodoro-ui.types";

export const HISTORY_PAGE_SIZE = 20;
export const INITIAL_HISTORY_FILTERS: HistoryFilterValue = {
  configurationId: "all",
  date: "all",
  status: "all",
};

type HistoryQuery = NonNullable<PomodoroHistoryListData["query"]>;

function createDateRange(date: string) {
  if (date === "all") return {};
  const dateFrom = new Date(`${date}T00:00:00`);
  const dateTo = new Date(dateFrom);
  dateTo.setDate(dateTo.getDate() + 1);
  dateTo.setMilliseconds(-1);
  return { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString() };
}

export function createPomodoroHistoryQuery(
  filters: HistoryFilterValue,
  page: number,
): HistoryQuery {
  return {
    page,
    pageSize: HISTORY_PAGE_SIZE,
    ...(filters.configurationId === "all"
      ? {}
      : { configurationId: filters.configurationId }),
    ...(filters.status === "all" ? {} : { status: filters.status }),
    ...createDateRange(filters.date),
  };
}
