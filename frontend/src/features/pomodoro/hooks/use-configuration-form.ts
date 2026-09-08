"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type {
  PomodoroConfigurationRequestDto,
  PomodoroConfigurationResponseDto,
} from "@/api";
import {
  EMPTY_VALUES,
  valuesFromConfiguration,
  configurationRequest,
} from "../utils/configuration-form-values";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";
import { createConfigurationFormSchema } from "../schemas/configuration-form.schema";

export function useConfigurationForm(
  configuration: PomodoroConfigurationResponseDto | null,
  isOpen: boolean,
  onSubmit: (draft: PomodoroConfigurationRequestDto) => Promise<void>,
) {
  const translate = useTranslations("pomodoro");
  const schema = useMemo(
    () => createConfigurationFormSchema(translate),
    [translate],
  );
  const values = useMemo(
    () =>
      configuration ? valuesFromConfiguration(configuration) : EMPTY_VALUES,
    [configuration],
  );
  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
    values,
    resetOptions: { keepDefaultValues: false },
  });
  useEffect(() => {
    if (isOpen) form.reset(values);
  }, [form, isOpen, values]);
  const submit = form.handleSubmit((values) =>
    onSubmit(configurationRequest(values)),
  );
  return { form, submit };
}
