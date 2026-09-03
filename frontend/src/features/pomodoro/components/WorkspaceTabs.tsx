import { useTranslations } from "next-intl";
import type { CreatePomodoroHistoryRequestDto, PomodoroConfigurationResponseDto, PomodoroHistoryResponseDto } from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { WorkspaceTab } from "../types/pomodoro-ui.types";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { ConfigurationsPanel } from "./ConfigurationsPanel";
import { HistoryPanel } from "./HistoryPanel";
import { MusicPreview } from "./MusicPreview";
import { TimerCard } from "./TimerCard";

export function WorkspaceTabs({ tab, setTab, configurations, selected, selectedId, history, record, create, edit, remove, select }: {
  tab: WorkspaceTab; setTab: (tab: WorkspaceTab) => void;
  configurations: PomodoroConfigurationResponseDto[];
  selected?: PomodoroConfigurationResponseDto; selectedId: string | null;
  history: PomodoroHistoryResponseDto[];
  record: (entry: CreatePomodoroHistoryRequestDto) => void;
  create: () => void; edit: (value: PomodoroConfigurationResponseDto) => void;
  remove: (value: PomodoroConfigurationResponseDto) => void; select: (id: string) => void;
}) {
  const translate = useTranslations("pomodoro");
  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as WorkspaceTab)}>
      <TabsList className="sr-only"><TabsTrigger value="timer">{translate("TXT_NAV_TIMER")}</TabsTrigger><TabsTrigger value="configurations">{translate("TXT_NAV_CONFIGS")}</TabsTrigger><TabsTrigger value="history">{translate("TXT_NAV_HISTORY")}</TabsTrigger></TabsList>
      <TabsContent value="timer" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]"><TimerCard key={selected?.id ?? "empty"} configuration={selected} onHistoryCreated={record} onNeedConfiguration={create} /><MusicPreview /></div>
        <ConfigurationSummary configuration={selected} />
      </TabsContent>
      <TabsContent value="configurations"><ConfigurationsPanel configurations={configurations} selectedId={selectedId} onCreate={create} onEdit={edit} onDelete={remove} onSelect={select} /></TabsContent>
      <TabsContent value="history"><HistoryPanel configurations={configurations} entries={history} onGoToTimer={() => setTab("timer")} /></TabsContent>
    </Tabs>
  );
}
