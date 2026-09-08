"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  PomodoroConfigurationResponseDto,
  PomodoroHistoryResponseDto,
} from "@/api";
import type { PomodoroHistoryPage } from "../services/pomodoro-api";
import type { HistoryFilterValue } from "../types/pomodoro-ui.types";
import { Button } from "@/shared/ui/button";
import { InputPagination } from "@/shared/ui/InputPagination";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryItem } from "./HistoryItem";

interface HistoryPanelProps {
  configurations: PomodoroConfigurationResponseDto[];
  entries: PomodoroHistoryResponseDto[];
  filters: HistoryFilterValue;
  isFetching: boolean;
  meta?: PomodoroHistoryPage["meta"];
  onFiltersChange: (filters: HistoryFilterValue) => void;
  onGoToTimer: () => void;
  onPageChange: (page: number) => void;
}

function HistoryHeader() {
  const translate = useTranslations("pomodoro");
  return (
    <div className="max-w-2xl">
      <span className="text-accent-pink text-sm font-extrabold uppercase">
        {translate("TXT_HISTORY_EYEBROW")}
      </span>
      <h2 id="history-title" className="mt-2">
        {translate("TXT_HISTORY_TITLE")}
      </h2>
      <p className="text-muted-foreground mt-2">
        {translate("TXT_HISTORY_DESCRIPTION")}
      </p>
    </div>
  );
}

function HistoryItems({ entries }: Pick<HistoryPanelProps, "entries">) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <HistoryItem entry={entry} key={entry.id} />
      ))}
    </div>
  );
}

function EmptyHistory({ onGoToTimer }: Pick<HistoryPanelProps, "onGoToTimer">) {
  const translate = useTranslations("pomodoro");
  const action = (
    <Button onClick={onGoToTimer}>
      <Play />
      {translate("BTN_GO_TO_TIMER")}
    </Button>
  );
  return (
    <EmptyState
      title={translate("TXT_EMPTY_HISTORY_TITLE")}
      description={translate("TXT_EMPTY_HISTORY_DESCRIPTION")}
      action={action}
    />
  );
}

function HistoryResults(
  props: Pick<HistoryPanelProps, "entries" | "onGoToTimer">,
) {
  return props.entries.length > 0 ? (
    <HistoryItems entries={props.entries} />
  ) : (
    <EmptyHistory onGoToTimer={props.onGoToTimer} />
  );
}

export function HistoryPanel(props: HistoryPanelProps) {
  return (
    <section
      className="space-y-7"
      aria-labelledby="history-title"
      aria-busy={props.isFetching}
    >
      <HistoryHeader />
      <HistoryFilters
        configurations={props.configurations}
        value={props.filters}
        onChange={props.onFiltersChange}
      />
      <HistoryResults entries={props.entries} onGoToTimer={props.onGoToTimer} />
      {props.meta ? (
        <InputPagination
          currentPage={props.meta.page}
          totalPages={props.meta.totalPages}
          isDisabled={props.isFetching}
          onPageChange={props.onPageChange}
        />
      ) : null}
    </section>
  );
}
