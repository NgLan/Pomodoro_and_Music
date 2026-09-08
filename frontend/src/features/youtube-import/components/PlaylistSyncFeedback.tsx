import { useTranslations } from "next-intl";
import type { useYoutubeSync } from "../hooks/use-youtube-sync";
import { ImportError } from "./ImportError";
import { ImportWarnings } from "./ImportWarnings";

export function PlaylistSyncFeedback({
  sync,
}: {
  sync: ReturnType<typeof useYoutubeSync>;
}) {
  const t = useTranslations("youtubeImport");
  if (sync.isError)
    return <ImportError error={sync.error} onRetry={() => sync.mutate()} />;
  if (!sync.data) return null;
  const key = sync.data.addedCount ? "MSG_SYNC_ADDED" : "MSG_SYNC_CURRENT";
  return (
    <div role="status" className="text-sm">
      <p>{t(key, { count: sync.data.addedCount })}</p>
      <ImportWarnings {...sync.data} />
    </div>
  );
}
