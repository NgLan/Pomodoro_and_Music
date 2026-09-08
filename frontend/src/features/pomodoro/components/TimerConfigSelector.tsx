"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface TimerConfigSelectorProps {
  configurations: PomodoroConfigurationResponseDto[];
  selected: PomodoroConfigurationResponseDto;
  onSelect: (id: string) => void;
  onEdit: (config: PomodoroConfigurationResponseDto) => void;
}

export function TimerConfigSelector(props: TimerConfigSelectorProps) {
  const t = useTranslations("pomodoro");
  return (
    <div className="flex items-center justify-center gap-2">
      <Select value={props.selected.id} onValueChange={props.onSelect}>
        <SelectTrigger
          aria-label={t("TXT_SWITCH_CONFIG")}
          className="border-border bg-surface shadow-neo-sm h-10 max-w-xs text-sm font-bold sm:max-w-sm"
        >
          <SelectValue />
        </SelectTrigger>
        <ConfigOptions configurations={props.configurations} />
      </Select>
      <EditConfigButton onEdit={() => props.onEdit(props.selected)} />
    </div>
  );
}

function ConfigOptions({ configurations }: { configurations: PomodoroConfigurationResponseDto[] }) {
  const t = useTranslations("pomodoro");
  return (
    <SelectContent>
      {configurations.map((item) => (
        <SelectItem key={item.id} value={item.id}>
          {item.name} ({calculateTotalMinutes(item)} {t("TXT_MINUTES_SHORT")})
        </SelectItem>
      ))}
    </SelectContent>
  );
}

function EditConfigButton({ onEdit }: { onEdit: () => void }) {
  const t = useTranslations("pomodoro");
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="border-border bg-accent-yellow hover:bg-accent-yellow/80 shadow-neo-sm size-10 shrink-0"
      onClick={onEdit}
      title={t("BTN_EDIT_CURRENT_CONFIG")}
      aria-label={t("BTN_EDIT_CURRENT_CONFIG")}
    >
      <Settings className="size-4.5" />
    </Button>
  );
}

function calculateTotalMinutes(item: PomodoroConfigurationResponseDto): number {
  return (
    Math.round(item.focusDurationSeconds / 60) *
    item.focusSessionsBeforeLongBreak
  );
}
