"use client";

import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import { ErrorState, LoadingState } from "@/shared/ui/states/StandardStates";
import { useWorkspaceController } from "../hooks/use-workspace-controller";
import { AppHeader } from "./AppHeader";
import { ConfigurationDialog } from "./ConfigurationDialog";
import { DeleteConfigurationDialog } from "./DeleteConfigurationDialog";
import { WorkspaceHero } from "./WorkspaceHero";
import { WorkspaceTabs } from "./WorkspaceTabs";

type WorkspaceState = ReturnType<typeof useWorkspaceController>;

function ReadyWorkspace({ state }: { state: WorkspaceState }) {
  return (
    <WorkspaceTabs
      tab={state.tab}
      setTab={state.setTab}
      configurations={state.configurations}
      selected={state.selected}
      selectedId={state.effectiveId}
      history={state.history}
      historyFilters={state.historyFilters}
      historyMeta={state.historyMeta}
      isHistoryFetching={state.isHistoryFetching}
      record={state.record}
      create={state.create}
      edit={state.edit}
      remove={state.setDeleting}
      select={state.select}
      setHistoryPage={state.setHistoryPage}
      updateHistoryFilters={state.updateHistoryFilters}
    />
  );
}

function WorkspaceError({ state }: { state: WorkspaceState }) {
  const common = useTranslations("common");
  const action = <Button onClick={state.refetch}>{common("BTN_RETRY")}</Button>;
  return (
    <ErrorState
      title={common("TXT_ERROR_TITLE")}
      description={common("TXT_ERROR_DESCRIPTION")}
      action={action}
    />
  );
}

function WorkspaceStatus({ state }: { state: WorkspaceState }) {
  const translate = useTranslations("pomodoro");
  if (state.isLoading)
    return (
      <LoadingState
        title={translate("TXT_TIMER_HEADING")}
        description={translate("TXT_READY")}
      />
    );
  if (state.isError) return <WorkspaceError state={state} />;
  return <ReadyWorkspace state={state} />;
}

function WorkspaceDialogs({ state }: { state: WorkspaceState }) {
  return (
    <>
      <ConfigurationDialog
        configuration={state.editing}
        isOpen={state.formOpen}
        onOpenChange={state.closeForm}
        onSubmit={state.save}
      />
      <DeleteConfigurationDialog
        value={state.deleting}
        onCancel={() => state.setDeleting(null)}
        onConfirm={() => void state.confirmDelete()}
      />
    </>
  );
}

function WorkspaceBody({ state }: { state: WorkspaceState }) {
  const translate = useTranslations("pomodoro");
  return (
    <PageContainer className="space-y-2.5 pb-14 sm:space-y-3 sm:pb-16">
      <WorkspaceHero
        configuration={state.selected}
        history={state.recentHistory}
      />
      <WorkspaceStatus state={state} />
      <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
        <Clock3 className="size-3.5" />
        {translate("TXT_SERVER_NOTE")}
      </p>
    </PageContainer>
  );
}

export function PomodoroWorkspace() {
  const state = useWorkspaceController();
  return (
    <AppShell
      header={<AppHeader activeTab={state.tab} onTabChange={state.setTab} />}
    >
      <WorkspaceBody state={state} />
      <WorkspaceDialogs state={state} />
    </AppShell>
  );
}
