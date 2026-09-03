"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { PomodoroConfigurationRequestDto, PomodoroConfigurationResponseDto } from "@/api";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";
import { createConfigurationFormSchema } from "../schemas/configuration-form.schema";

const EMPTY_VALUES: ConfigurationFormValues = {
  name: "",
  focusDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  focusSessionsBeforeLongBreak: 4,
};

function valuesFromConfiguration(value: PomodoroConfigurationResponseDto) {
  return {
    name: value.name,
    focusDurationMinutes: value.focusDurationSeconds / 60,
    shortBreakDurationMinutes: value.shortBreakDurationSeconds / 60,
    longBreakDurationMinutes: value.longBreakDurationSeconds / 60,
    focusSessionsBeforeLongBreak: value.focusSessionsBeforeLongBreak,
  };
}

export function useConfigurationForm(
  configuration: PomodoroConfigurationResponseDto | null,
  isOpen: boolean,
  onSubmit: (draft: PomodoroConfigurationRequestDto) => Promise<void>,
) {
  const translate = useTranslations("pomodoro");
  const schema = useMemo(() => createConfigurationFormSchema(translate), [translate]);
  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });
  useEffect(() => {
    if (isOpen) form.reset(configuration ? valuesFromConfiguration(configuration) : EMPTY_VALUES);
  }, [configuration, form, isOpen]);
  const submit = form.handleSubmit(async (values) => onSubmit({
    name: values.name.trim(),
    focusDurationSeconds: values.focusDurationMinutes * 60,
    shortBreakDurationSeconds: values.shortBreakDurationMinutes * 60,
    longBreakDurationSeconds: values.longBreakDurationMinutes * 60,
    focusSessionsBeforeLongBreak: values.focusSessionsBeforeLongBreak,
  }));
  return { form, submit };
}
