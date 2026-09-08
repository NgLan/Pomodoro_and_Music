import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";

const NUMBER_FIELDS = [
  ["focusDurationMinutes", "FOCUS_DURATION_LABEL", 180],
  ["shortBreakDurationMinutes", "SHORT_BREAK_DURATION_LABEL", 180],
  ["longBreakDurationMinutes", "LONG_BREAK_DURATION_LABEL", 180],
  ["focusSessionsBeforeLongBreak", "FOCUS_ROUNDS_LABEL", 12],
] as const;

export function ConfigurationDurationFields({
  form,
}: {
  form: UseFormReturn<ConfigurationFormValues>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {NUMBER_FIELDS.map((definition) => (
        <DurationField
          key={definition[0]}
          form={form}
          definition={definition}
        />
      ))}
    </div>
  );
}

interface DurationFieldProps {
  form: UseFormReturn<ConfigurationFormValues>;
  definition: (typeof NUMBER_FIELDS)[number];
}

function DurationField({ form, definition }: DurationFieldProps) {
  const t = useTranslations("pomodoro");
  const [name, label, max] = definition;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={1}
              max={max}
              {...field}
              onChange={(event) => field.onChange(event.target.valueAsNumber)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
