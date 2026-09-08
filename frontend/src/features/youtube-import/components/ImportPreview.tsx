import { useTranslations } from "next-intl";
import type { ImportPreviewProps } from "../types/import-ui.types";
import { ImportPreviewHeading } from "./ImportPreviewHeading";
import { ImportSelectionToolbar } from "./ImportSelectionToolbar";
import { ImportPreviewList } from "./ImportPreviewList";

export function ImportPreview(props: ImportPreviewProps) {
  const t = useTranslations("youtubeImport");
  return (
    <section
      className="neo-surface bg-surface overflow-hidden"
      aria-label={t("TXT_PREVIEW")}
    >
      <ImportPreviewHeading preview={props.preview} />
      <ImportSelectionToolbar {...props} />
      <ImportPreviewList {...props} />
    </section>
  );
}
