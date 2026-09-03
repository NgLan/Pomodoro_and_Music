import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto, PomodoroHistoryStatus } from "@/api";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

export interface HistoryFilterValue {
  configurationId: string;
  date: string;
  status: "all" | PomodoroHistoryStatus;
}

export function HistoryFilters({ configurations, value, onChange }: {
  configurations: PomodoroConfigurationResponseDto[];
  value: HistoryFilterValue;
  onChange: (value: HistoryFilterValue) => void;
}) {
  const translate = useTranslations("pomodoro");
  const field = (key: keyof HistoryFilterValue, next: string) => onChange({ ...value, [key]: next });
  return (
    <Card className="shadow-neo py-4"><CardContent className="grid gap-4 px-4 sm:grid-cols-3">
      <label className="grid gap-1.5 text-sm font-bold">{translate("DATE_FILTER_LABEL")}<Input type="date" value={value.date === "all" ? "" : value.date} onChange={(event) => field("date", event.target.value || "all")} /></label>
      <label className="grid gap-1.5 text-sm font-bold">{translate("CONFIG_FILTER_LABEL")}<Select value={value.configurationId} onValueChange={(next) => field("configurationId", next)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{translate("TXT_ALL_CONFIGS")}</SelectItem>{configurations.map((item) => <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></label>
      <label className="grid gap-1.5 text-sm font-bold">{translate("STATUS_FILTER_LABEL")}<Select value={value.status} onValueChange={(next) => field("status", next)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{translate("TXT_ALL_STATUSES")}</SelectItem><SelectItem value="COMPLETED">{translate("TXT_COMPLETED")}</SelectItem><SelectItem value="ENDED_EARLY">{translate("TXT_ENDED_EARLY")}</SelectItem></SelectContent></Select></label>
    </CardContent></Card>
  );
}
