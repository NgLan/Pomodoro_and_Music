import { useTranslations } from "next-intl";
import type { YoutubePlaylistPreviewResponseDto } from "@/api";

type WarningCounts = Pick<
  YoutubePlaylistPreviewResponseDto,
  "unavailableCount" | "skippedCount"
>;
export function ImportWarnings({
  unavailableCount,
  skippedCount,
}: WarningCounts) {
  const t = useTranslations("youtubeImport");
  if (!unavailableCount && !skippedCount) return null;
  return (
    <p className="text-sm">
      {t("TXT_WARNINGS", {
        unavailable: unavailableCount,
        skipped: skippedCount,
      })}
    </p>
  );
}
