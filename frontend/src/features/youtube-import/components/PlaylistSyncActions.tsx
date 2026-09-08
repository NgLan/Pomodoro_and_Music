import { ExternalLink, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import type { PlaylistDetailResponseDto } from "@/api";
import type { useYoutubeSync } from "../hooks/use-youtube-sync";

type SyncActionsProps = {
  playlist: PlaylistDetailResponseDto;
  sync: ReturnType<typeof useYoutubeSync>;
};
export function PlaylistSyncActions({ playlist, sync }: SyncActionsProps) {
  const t = useTranslations("youtubeImport");
  return (
    <div className="flex gap-3">
      {playlist.sourceUrl && <SourceLink url={playlist.sourceUrl} />}
      <Button
        variant="outline"
        disabled={sync.isPending}
        onClick={() => sync.mutate()}
      >
        <RefreshCw
          className={
            sync.isPending ? "animate-spin motion-reduce:animate-none" : ""
          }
        />
        {t(sync.isPending ? "BTN_SYNCING" : "BTN_SYNC")}
      </Button>
    </div>
  );
}

function SourceLink({ url }: { url: string }) {
  const t = useTranslations("youtubeImport");
  return (
    <Button asChild variant="ghost">
      <a href={url} target="_blank" rel="noreferrer">
        <ExternalLink />
        {t("BTN_SOURCE")}
      </a>
    </Button>
  );
}
