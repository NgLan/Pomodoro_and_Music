"use client";

import { useState } from "react";
import type { PomodoroConfigurationResponseDto } from "@/api";
import type { WorkspaceTab } from "../types/pomodoro-ui.types";
import { usePomodoroData } from "./use-pomodoro-data";

export function useWorkspaceController() {
  const data = usePomodoroData();
  const [tab, setTab] = useState<WorkspaceTab>("timer");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<PomodoroConfigurationResponseDto | null>(null);
  const hasSelection = data.configurations.some((item) => item.id === selectedId);
  const effectiveId = hasSelection ? selectedId : (data.configurations[0]?.id ?? null);
  const selected = data.configurations.find((item) => item.id === effectiveId);
  const create = () => { data.setEditing(null); setFormOpen(true); };
  const edit = (value: PomodoroConfigurationResponseDto) => { data.setEditing(value); setFormOpen(true); };
  const select = (id: string) => { setSelectedId(id); setTab("timer"); };
  const closeForm = (open: boolean) => { setFormOpen(open); if (!open) data.setEditing(null); };
  const save = async (draft: Parameters<typeof data.save>[0]) => {
    const value = await data.save(draft);
    setSelectedId((current) => current ?? value.id); setFormOpen(false);
  };
  const confirmDelete = async () => {
    if (!deleting) return;
    await data.remove(deleting.id);
    if (selectedId === deleting.id) setSelectedId(null); setDeleting(null);
  };
  return { ...data, closeForm, confirmDelete, create, deleting, edit, effectiveId,
    formOpen, save, select, selected, setDeleting, setTab, tab };
}
