import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";

const NUMBER_FIELDS = [
  ["focusDurationMinutes", "FOCUS_DURATION_LABEL", 180],
  ["shortBreakDurationMinutes", "SHORT_BREAK_DURATION_LABEL", 180],
  ["longBreakDurationMinutes", "LONG_BREAK_DURATION_LABEL", 180],
  ["focusSessionsBeforeLongBreak", "FOCUS_ROUNDS_LABEL", 12],
] as const;

export function ConfigurationFields({ form }: {
  form: UseFormReturn<ConfigurationFormValues>;
}) {
  const translate = useTranslations("pomodoro");
  return (
    <><FormField control={form.control} name="name" render={({ field }) => (
      <FormItem><FormLabel>{translate("CONFIG_NAME_LABEL")}</FormLabel><FormControl><Input autoComplete="off" placeholder={translate("CONFIG_NAME_PLACEHOLDER")} {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <div className="grid gap-4 sm:grid-cols-2">
      {NUMBER_FIELDS.map(([name, label, max]) => (
        <FormField control={form.control} key={name} name={name} render={({ field }) => (
          <FormItem><FormLabel>{translate(label)}</FormLabel><FormControl><Input type="number" min={1} max={max} inputMode="numeric" {...field} onChange={(event) => field.onChange(event.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>
        )} />
      ))}
    </div></>
  );
}
