import { useTranslations } from "next-intl";
import { LoadingState } from "@/shared/ui/states/StandardStates";
import type { ImportState } from "../types/import-ui.types";
import { ImportResult } from "./ImportResult";
import { ImportError } from "./ImportError";
import { ImportSelection } from "./ImportSelection";

export function ImportContent({ state }: { state: ImportState }) {
  const { preview, importer } = state;
  const retry = () => preview.mutate(preview.variables!);
  if (importer.data) return <ImportResult result={importer.data} />;
  if (preview.isPending) return <ImportLoading />;
  if (preview.isError)
    return <ImportError error={preview.error} onRetry={retry} />;
  if (!preview.data) return <ImportStartHint />;
  return <ImportSelection state={state} preview={preview.data} />;
}

function ImportLoading() {
  const t = useTranslations("youtubeImport");
  return (
    <LoadingState
      title={t("BTN_FETCHING")}
      description={t("TXT_FETCH_PROGRESS")}
    />
  );
}

function ImportStartHint() {
  const t = useTranslations("youtubeImport");
  return (
    <p className="text-muted-foreground py-8 text-center">
      {t("TXT_START_HINT")}
    </p>
  );
}
