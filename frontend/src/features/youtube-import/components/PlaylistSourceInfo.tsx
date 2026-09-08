import { useFormatter, useTranslations } from "next-intl";
import type { PlaylistDetailResponseDto } from "@/api";

export function PlaylistSourceInfo({
  playlist,
}: {
  playlist: PlaylistDetailResponseDto;
}) {
  const t = useTranslations("youtubeImport");
  return (
    <div>
      <h2 className="text-lg">{t("TXT_SOURCE")}</h2>
      <p className="text-muted-foreground text-sm">{t("TXT_SYNC_POLICY")}</p>
      {playlist.lastSyncedAt && <LastSyncedAt value={playlist.lastSyncedAt} />}
    </div>
  );
}

function LastSyncedAt({ value }: { value: string }) {
  const t = useTranslations("youtubeImport");
  const format = useFormatter();
  const date = format.dateTime(new Date(value), {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <p className="text-muted-foreground mt-1 text-xs">
      {t("TXT_LAST_SYNC", { date })}
    </p>
  );
}
