"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  CreatePomodoroHistoryRequestDto,
  PomodoroConfigurationRequestDto,
  PomodoroConfigurationResponseDto,
} from "@/api";
import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { normalizeApiError } from "@/shared/lib/api-error";
import {
  createPomodoroConfiguration,
  createPomodoroHistory,
  deletePomodoroConfiguration,
  updatePomodoroConfiguration,
} from "../services/pomodoro-api";

export function useConfigurationActions(
  token: string,
  editing: PomodoroConfigurationResponseDto | null,
) {
  const client = useQueryClient();
  const notification = useAppNotification();
  const saveMutation = useMutation({ mutationFn: (draft: PomodoroConfigurationRequestDto) => editing
    ? updatePomodoroConfiguration(token, editing.id, draft) : createPomodoroConfiguration(token, draft) });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePomodoroConfiguration(token, id),
  });
  const save = async (draft: PomodoroConfigurationRequestDto) => {
    const value = await saveMutation.mutateAsync(draft);
    await client.invalidateQueries({ queryKey: ["pomodoro", "configurations"] });
    notification.success(editing ? "MSG_CONFIG_UPDATED" : "MSG_CONFIG_CREATED");
    return value;
  };
  const remove = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    await Promise.all([client.invalidateQueries({ queryKey: ["pomodoro", "configurations"] }),
      client.invalidateQueries({ queryKey: ["pomodoro", "history"] })]);
    notification.success("MSG_CONFIG_DELETED");
  };
  return { remove, save };
}

export function useHistoryRecorder(token: string) {
  const client = useQueryClient();
  const notification = useAppNotification();
  const mutation = useMutation({
    mutationFn: (entry: CreatePomodoroHistoryRequestDto) =>
      createPomodoroHistory(token, entry),
    onSuccess: () => void client.invalidateQueries({ queryKey: ["pomodoro", "history"] }),
    onError: (error) => notification.error(normalizeApiError(error).errorCode),
  });
  return useCallback(
    (entry: CreatePomodoroHistoryRequestDto) => mutation.mutate(entry),
    [mutation],
  );
}
