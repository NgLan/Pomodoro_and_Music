"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { PomodoroConfigurationResponseDto, PomodoroHistoryResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { HistoryFilters, type HistoryFilterValue } from "./HistoryFilters";
import { HistoryItem } from "./HistoryItem";

const INITIAL_FILTERS: HistoryFilterValue = {
  configurationId: "all",
  date: "all",
  status: "all",
};

function matches(entry: PomodoroHistoryResponseDto, filters: HistoryFilterValue) {
  return (filters.date === "all" || entry.startedAt.slice(0, 10) === filters.date)
    && (filters.configurationId === "all" || entry.pomodoroId === filters.configurationId)
    && (filters.status === "all" || entry.status === filters.status);
}

export function HistoryPanel({ configurations, entries, onGoToTimer }: {
  configurations: PomodoroConfigurationResponseDto[];
  entries: PomodoroHistoryResponseDto[];
  onGoToTimer: () => void;
}) {
  const translate = useTranslations("pomodoro");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const filtered = useMemo(() => entries.filter((entry) => matches(entry, filters)), [entries, filters]);
  const action = <Button onClick={onGoToTimer}><Play />{translate("BTN_GO_TO_TIMER")}</Button>;
  return (
    <section className="space-y-7" aria-labelledby="history-title">
      <div className="max-w-2xl"><span className="text-accent-pink text-sm font-extrabold uppercase">{translate("TXT_HISTORY_EYEBROW")}</span><h2 id="history-title" className="mt-2">{translate("TXT_HISTORY_TITLE")}</h2><p className="text-muted-foreground mt-2">{translate("TXT_HISTORY_DESCRIPTION")}</p></div>
      <HistoryFilters configurations={configurations} value={filters} onChange={setFilters} />
      {filtered.length === 0
        ? <EmptyState title={translate("TXT_EMPTY_HISTORY_TITLE")} description={translate("TXT_EMPTY_HISTORY_DESCRIPTION")} action={action} />
        : <div className="space-y-3">{filtered.map((entry) => <HistoryItem entry={entry} key={entry.id} />)}</div>}
    </section>
  );
}
