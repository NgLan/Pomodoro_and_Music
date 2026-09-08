import { describe, expect, it } from "vitest";
import {
  createPomodoroHistoryQuery,
  HISTORY_PAGE_SIZE,
  INITIAL_HISTORY_FILTERS,
} from "./pomodoro-history-query";

describe("createPomodoroHistoryQuery", () => {
  it("includes shared pagination and omits inactive filters", () => {
    expect(createPomodoroHistoryQuery(INITIAL_HISTORY_FILTERS, 3)).toEqual({
      page: 3,
      pageSize: HISTORY_PAGE_SIZE,
    });
  });

  it("maps active filters to the API query", () => {
    const query = createPomodoroHistoryQuery(
      {
        configurationId: "00000000-0000-4000-8000-000000000001",
        date: "2026-09-08",
        status: "COMPLETED",
      },
      1,
    );

    expect(query.configurationId).toBe("00000000-0000-4000-8000-000000000001");
    expect(query.status).toBe("COMPLETED");
    expect(new Date(query.dateFrom!).getTime()).toBeLessThan(
      new Date(query.dateTo!).getTime(),
    );
  });
});
