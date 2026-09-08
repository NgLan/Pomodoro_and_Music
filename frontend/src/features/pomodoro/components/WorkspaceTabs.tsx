import { useTranslations } from "next-intl";
import type {
  CreatePomodoroHistoryRequestDto,
  PomodoroConfigurationResponseDto,
  PomodoroHistoryResponseDto,
} from "@/api";
import type { PomodoroHistoryPage } from "../services/pomodoro-api";
import type { HistoryFilterValue } from "../types/pomodoro-ui.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { WorkspaceTab } from "../types/pomodoro-ui.types";
import { ConfigurationsPanel } from "./ConfigurationsPanel";
import { HistoryPanel } from "./HistoryPanel";
import { MusicPanel } from "@/features/music-player/components/MusicPanel";
import { TimerCard } from "./TimerCard";

interface WorkspaceTabsProps {
  tab: WorkspaceTab;
  setTab: (tab: WorkspaceTab) => void;
  configurations: PomodoroConfigurationResponseDto[];
  historyConfigurations?: PomodoroConfigurationResponseDto[];
  selected?: PomodoroConfigurationResponseDto;
  selectedId: string | null;
  history: PomodoroHistoryResponseDto[];
  historyFilters: HistoryFilterValue;
  historyMeta?: PomodoroHistoryPage["meta"];
  isHistoryFetching: boolean;
  record: (entry: CreatePomodoroHistoryRequestDto) => void;
  create: () => void;
  edit: (value: PomodoroConfigurationResponseDto) => void;
  remove: (value: PomodoroConfigurationResponseDto) => void;
  select: (id: string) => void;
  setHistoryPage: (page: number) => void;
  updateHistoryFilters: (filters: HistoryFilterValue) => void;
}

export function WorkspaceTabs(props: WorkspaceTabsProps) {
  return (
    <Tabs
      value={props.tab}
      onValueChange={(value) => props.setTab(value as WorkspaceTab)}
    >
      <WorkspaceTabLabels />
      <TimerTab {...props} />
      <ConfigurationTab {...props} />
      <HistoryTab {...props} />
    </Tabs>
  );
}

function HistoryTab(props: WorkspaceTabsProps) {
  return (
    <TabsContent value="history">
      <HistoryPanel
        configurations={props.historyConfigurations ?? props.configurations}
        entries={props.history}
        filters={props.historyFilters}
        isFetching={props.isHistoryFetching}
        meta={props.historyMeta}
        onFiltersChange={props.updateHistoryFilters}
        onGoToTimer={() => props.setTab("timer")}
        onPageChange={props.setHistoryPage}
      />
    </TabsContent>
  );
}

function WorkspaceTabLabels() {
  const translate = useTranslations("pomodoro");
  return (
    <TabsList className="sr-only">
      <TabsTrigger value="timer">{translate("TXT_NAV_TIMER")}</TabsTrigger>
      <TabsTrigger value="configurations">
        {translate("TXT_NAV_CONFIGS")}
      </TabsTrigger>
      <TabsTrigger value="history">{translate("TXT_NAV_HISTORY")}</TabsTrigger>
    </TabsList>
  );
}

function TimerTab(props: WorkspaceTabsProps) {
  return (
    <TabsContent value="timer">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]">
        <TimerCard
          configuration={props.selected}
          configurations={props.configurations}
          onNeedConfiguration={props.create}
          onSelectConfiguration={props.select}
          onEditConfiguration={props.edit}
        />
        <MusicPanel />
      </div>
    </TabsContent>
  );
}

function ConfigurationTab(props: WorkspaceTabsProps) {
  return (
    <TabsContent value="configurations">
      <ConfigurationsPanel
        configurations={props.configurations}
        selectedId={props.selectedId}
        onCreate={props.create}
        onEdit={props.edit}
        onDelete={props.remove}
        onSelect={props.select}
      />
    </TabsContent>
  );
}
