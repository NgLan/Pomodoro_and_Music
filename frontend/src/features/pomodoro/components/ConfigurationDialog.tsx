"use client";
import { useTranslations } from "next-intl";
import type {
  PomodoroConfigurationRequestDto,
  PomodoroConfigurationResponseDto,
} from "@/api";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Form } from "@/shared/ui/form";
import { useConfigurationForm } from "../hooks/use-configuration-form";
import { ConfigurationFields } from "./ConfigurationFields";

interface ConfigurationDialogProps {
  configuration: PomodoroConfigurationResponseDto | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: PomodoroConfigurationRequestDto) => Promise<void>;
}

export function ConfigurationDialog(props: ConfigurationDialogProps) {
  const t = useTranslations("pomodoro");
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent
        closeLabel={t("ARIA_CLOSE")}
        className="max-h-[90svh] overflow-y-auto sm:max-w-2xl"
      >
        <ConfigurationHeading isEditing={Boolean(props.configuration)} />
        <ConfigurationFormBody {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ConfigurationHeading({ isEditing }: { isEditing: boolean }) {
  const t = useTranslations("pomodoro");
  return (
    <DialogHeader>
      <DialogTitle>
        {t(isEditing ? "TXT_EDIT_CONFIG_TITLE" : "TXT_CREATE_CONFIG_TITLE")}
      </DialogTitle>
      <DialogDescription>{t("TXT_CONFIG_FORM_DESCRIPTION")}</DialogDescription>
    </DialogHeader>
  );
}

function ConfigurationFormBody(props: ConfigurationDialogProps) {
  const { form, submit } = useConfigurationForm(
    props.configuration,
    props.isOpen,
    props.onSubmit,
  );
  return (
    <Form {...form}>
      <form className="grid gap-5" onSubmit={submit}>
        <ConfigurationFields form={form} />
        <ConfigurationFormActions
          isEditing={Boolean(props.configuration)}
          isSubmitting={form.formState.isSubmitting}
          onCancel={() => props.onOpenChange(false)}
        />
      </form>
    </Form>
  );
}

interface ConfigurationFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

function ConfigurationFormActions(props: ConfigurationFormActionsProps) {
  const t = useTranslations("pomodoro");
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={props.onCancel}>
        {t("BTN_CANCEL")}
      </Button>
      <Button type="submit" disabled={props.isSubmitting}>
        {t(props.isEditing ? "BTN_SAVE" : "BTN_CREATE")}
      </Button>
    </DialogFooter>
  );
}
