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

export function PomodoroWorkspace() {
  const translate = useTranslations("pomodoro");
  const common = useTranslations("common");
  const state = useWorkspaceController();
  return (
    <AppShell header={<AppHeader activeTab={state.tab} onTabChange={state.setTab} />}>
      <PageContainer className="space-y-8">
        <WorkspaceHero configuration={state.selected} history={state.history} />
        {state.isLoading ? <LoadingState title={translate("TXT_TIMER_HEADING")} description={translate("TXT_READY")} />
          : state.isError ? <ErrorState title={common("TXT_ERROR_TITLE")} description={common("TXT_ERROR_DESCRIPTION")} action={<Button onClick={state.refetch}>{common("BTN_RETRY")}</Button>} />
            : <WorkspaceTabs tab={state.tab} setTab={state.setTab} configurations={state.configurations} selected={state.selected} selectedId={state.effectiveId} history={state.history} record={state.record} create={state.create} edit={state.edit} remove={state.setDeleting} select={state.select} />}
        <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs"><Clock3 className="size-3.5" />{translate("TXT_SERVER_NOTE")}</p>
      </PageContainer>
      <ConfigurationDialog configuration={state.editing} isOpen={state.formOpen} onOpenChange={state.closeForm} onSubmit={state.save} />
      <DeleteConfigurationDialog value={state.deleting} onCancel={() => state.setDeleting(null)} onConfirm={() => void state.confirmDelete()} />
    </AppShell>
  );
}
