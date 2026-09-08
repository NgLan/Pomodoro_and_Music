"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { PomodoroConfigurationResponseDto } from "@/api";
import type { WorkspaceTab } from "../types/pomodoro-ui.types";
import { usePomodoroData } from "./use-pomodoro-data";
import { usePomodoroHistoryNavigation } from "./use-pomodoro-history-navigation";
import { useTimerSessionStore } from "../providers/TimerSessionProvider";
import type { TimerSessionStore } from "../state/timer-session-store";

type PomodoroData = ReturnType<typeof usePomodoroData>;
type SelectedIdSetter = Dispatch<SetStateAction<string | null>>;

function useConfigurationSelection(
  data: PomodoroData,
  setTab: (tab: WorkspaceTab) => void,
) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasSelection = data.configurations.some(
    (item) => item.id === selectedId,
  );
  const effectiveId = hasSelection
    ? selectedId
    : (data.configurations[0]?.id ?? null);
  const selected = data.configurations.find((item) => item.id === effectiveId);
  const select = (id: string) => {
    setSelectedId(id);
    setTab("timer");
  };
  return { effectiveId, select, selected, selectedId, setSelectedId };
}

function useConfigurationForm(
  data: PomodoroData,
  setSelectedId: SelectedIdSetter,
) {
  const [formOpen, setFormOpen] = useState(false);
  const create = () => {
    data.setEditing(null);
    setFormOpen(true);
  };
  const edit = (value: PomodoroConfigurationResponseDto) => {
    data.setEditing(value);
    setFormOpen(true);
  };
  const closeForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) data.setEditing(null);
  };
  const save = async (draft: Parameters<typeof data.save>[0]) => {
    const value = await data.save(draft);
    setSelectedId(value.id);
    setFormOpen(false);
  };
  return { closeForm, create, edit, formOpen, save };
}

function useConfigurationDeletion(
  data: PomodoroData,
  selectedId: string | null,
  setSelectedId: SelectedIdSetter,
  store: TimerSessionStore,
) {
  const [deleting, setDeleting] =
    useState<PomodoroConfigurationResponseDto | null>(null);
  const confirmDelete = async () => {
    if (!deleting) return;
    const deletedId = deleting.id;
    await data.remove(deletedId);
    store.removeConfiguration(deletedId);
    if (selectedId === deletedId) setSelectedId(null);
    setDeleting(null);
  };
  return { confirmDelete, deleting, setDeleting };
}

export function useWorkspaceController() {
  const store = useTimerSessionStore();
  const historyNavigation = usePomodoroHistoryNavigation();
  const data = usePomodoroData(historyNavigation.historyQuery);
  const [tab, setTab] = useState<WorkspaceTab>("timer");
  const selection = useConfigurationSelection(data, setTab);
  const form = useConfigurationForm(data, selection.setSelectedId);
  const deletion = useConfigurationDeletion(
    data,
    selection.selectedId,
    selection.setSelectedId,
    store,
  );

  useEffect(() => {
    if (data.isLoading) return;
    const snapshot = store.getSnapshot();
    if (!snapshot) return;

    const exists = data.configurations.some(
      (item) => item.id === snapshot.configurationSnapshot.id,
    );
    if (!exists) {
      store.clear();
    }
  }, [data.configurations, data.isLoading, store]);

  return {
    ...data,
    ...historyNavigation,
    ...selection,
    ...form,
    ...deletion,
    setTab,
    tab,
  };
}
