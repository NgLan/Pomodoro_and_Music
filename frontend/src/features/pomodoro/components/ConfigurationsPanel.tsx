import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { ConfigurationCard } from "./ConfigurationCard";

export function ConfigurationsPanel({ configurations, selectedId, onCreate, onDelete, onEdit, onSelect }: {
  configurations: PomodoroConfigurationResponseDto[];
  selectedId: string | null;
  onCreate: () => void;
  onDelete: (value: PomodoroConfigurationResponseDto) => void;
  onEdit: (value: PomodoroConfigurationResponseDto) => void;
  onSelect: (id: string) => void;
}) {
  const translate = useTranslations("pomodoro");
  const emptyAction = <Button onClick={onCreate}><Plus />{translate("BTN_CREATE_CONFIG")}</Button>;
  return (
    <section className="space-y-7" aria-labelledby="configurations-title">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-2xl"><span className="text-accent-pink text-sm font-extrabold uppercase">{translate("TXT_CONFIGS_EYEBROW")}</span><h2 id="configurations-title" className="mt-2">{translate("TXT_CONFIGS_TITLE")}</h2><p className="text-muted-foreground mt-2">{translate("TXT_CONFIGS_DESCRIPTION")}</p></div>
        {emptyAction}
      </div>
      {configurations.length === 0
        ? <EmptyState title={translate("TXT_EMPTY_CONFIG_TITLE")} description={translate("TXT_EMPTY_CONFIG_DESCRIPTION")} action={emptyAction} />
        : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{configurations.map((value, index) => <ConfigurationCard configuration={value} index={index} key={value.id} selected={value.id === selectedId} onDelete={() => onDelete(value)} onEdit={() => onEdit(value)} onSelect={() => onSelect(value.id)} />)}</div>}
    </section>
  );
}
