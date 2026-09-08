import { useTranslations } from "next-intl";
import { PlaylistThumbnail } from "@/features/playlist/components/PlaylistThumbnail";
import { Badge } from "@/shared/ui/badge";
import type { ImportPreviewProps } from "../types/import-ui.types";
import { ImportWarnings } from "./ImportWarnings";

type HeadingProps = Pick<ImportPreviewProps, "preview">;
export function ImportPreviewHeading({ preview }: HeadingProps) {
  return (
    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
      <PlaylistThumbnail
        key={preview.sourceUrl}
        alt={preview.title}
        src={preview.thumbnailUrl}
        className="border-border w-full rounded-lg border-2 sm:w-44"
      />
      <PreviewMetadata preview={preview} />
    </div>
  );
}

function PreviewMetadata({ preview }: HeadingProps) {
  const t = useTranslations("youtubeImport");
  const counts = { count: preview.fetchedCount, total: preview.totalCount };
  return (
    <div className="min-w-0 space-y-2">
      <Badge variant="secondary">{t("TXT_YOUTUBE")}</Badge>
      <h2 className="text-2xl break-words">{preview.title}</h2>
      <p className="text-muted-foreground text-sm">
        {t("TXT_FETCHED", counts)}
      </p>
      <ImportWarnings {...preview} />
    </div>
  );
}
