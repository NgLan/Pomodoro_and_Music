"use client";

import { useTranslations } from "next-intl";
import type { PomodoroConfigurationRequestDto, PomodoroConfigurationResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Form } from "@/shared/ui/form";
import { useConfigurationForm } from "../hooks/use-configuration-form";
import { ConfigurationFields } from "./ConfigurationFields";

export function ConfigurationDialog({ configuration, isOpen, onOpenChange, onSubmit }: {
  configuration: PomodoroConfigurationResponseDto | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: PomodoroConfigurationRequestDto) => Promise<void>;
}) {
  const translate = useTranslations("pomodoro");
  const { form, submit } = useConfigurationForm(configuration, isOpen, onSubmit);
  const modeKey = configuration ? "TXT_EDIT_CONFIG_TITLE" : "TXT_CREATE_CONFIG_TITLE";
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={translate("ARIA_CLOSE")} className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>{translate(modeKey)}</DialogTitle><DialogDescription>{translate("TXT_CONFIG_FORM_DESCRIPTION")}</DialogDescription></DialogHeader>
        <Form {...form}>
          <form className="grid gap-5" onSubmit={submit}>
            <ConfigurationFields form={form} />
            <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{translate("BTN_CANCEL")}</Button><Button type="submit" disabled={form.formState.isSubmitting}>{translate(configuration ? "BTN_SAVE" : "BTN_CREATE")}</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
