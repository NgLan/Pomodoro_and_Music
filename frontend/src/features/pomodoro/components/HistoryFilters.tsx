import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import type { HistoryFilterValue } from "../types/pomodoro-ui.types";
import { HistorySelectFilter } from "./HistorySelectFilter";

interface FilterProps {
  value: HistoryFilterValue;
  onChange: (value: HistoryFilterValue) => void;
}

function DateFilter({ value, onChange }: FilterProps) {
  const translate = useTranslations("pomodoro");
  return (
    <label className="grid gap-1.5 text-sm font-bold">
      {translate("DATE_FILTER_LABEL")}
      <Input
        type="date"
        value={value.date === "all" ? "" : value.date}
        onChange={(event) =>
          onChange({ ...value, date: event.target.value || "all" })
        }
      />
    </label>
  );
}

function ConfigurationFilter({
  configurations,
  value,
  onChange,
}: FilterProps & {
  configurations: PomodoroConfigurationResponseDto[];
}) {
  const translate = useTranslations("pomodoro");
  const options = [
    { label: translate("TXT_ALL_CONFIGS"), value: "all" },
    ...configurations.map(({ id, name, deletedAt }) => ({
      label: deletedAt ? `${name} (${translate("TXT_DELETED_TAG")})` : name,
      value: id,
    })),
  ];
  return (
    <HistorySelectFilter
      label={translate("CONFIG_FILTER_LABEL")}
      options={options}
      value={value.configurationId}
      onChange={(configurationId) => onChange({ ...value, configurationId })}
    />
  );
}

function StatusFilter({ value, onChange }: FilterProps) {
  const translate = useTranslations("pomodoro");
  const options = [
    { label: translate("TXT_ALL_STATUSES"), value: "all" },
    { label: translate("TXT_COMPLETED"), value: "COMPLETED" },
    { label: translate("TXT_ENDED_EARLY"), value: "ENDED_EARLY" },
  ];
  return (
    <HistorySelectFilter
      label={translate("STATUS_FILTER_LABEL")}
      options={options}
      value={value.status}
      onChange={(status) =>
        onChange({ ...value, status: status as HistoryFilterValue["status"] })
      }
    />
  );
}

export function HistoryFilters({
  configurations,
  value,
  onChange,
}: {
  configurations: PomodoroConfigurationResponseDto[];
  value: HistoryFilterValue;
  onChange: (value: HistoryFilterValue) => void;
}) {
  return (
    <Card className="shadow-neo py-4">
      <CardContent className="grid gap-4 px-4 sm:grid-cols-3">
        <DateFilter value={value} onChange={onChange} />
        <ConfigurationFilter
          configurations={configurations}
          value={value}
          onChange={onChange}
        />
        <StatusFilter value={value} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
