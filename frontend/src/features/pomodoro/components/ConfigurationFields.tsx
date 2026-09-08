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
import { ConfigurationMusicFields } from "./ConfigurationMusicFields";
import { ConfigurationDurationFields } from "./ConfigurationDurationFields";

export function ConfigurationFields({
  form,
}: {
  form: UseFormReturn<ConfigurationFormValues>;
}) {
  return (
    <>
      <ConfigurationName form={form} />
      <ConfigurationDurationFields form={form} />
      <ConfigurationMusicFields form={form} />
    </>
  );
}

type ConfigurationNameProps = { form: UseFormReturn<ConfigurationFormValues> };

function ConfigurationName({ form }: ConfigurationNameProps) {
  const t = useTranslations("pomodoro");
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("CONFIG_NAME_LABEL")}</FormLabel>
          <FormControl>
            <Input
              autoComplete="off"
              placeholder={t("CONFIG_NAME_PLACEHOLDER")}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
