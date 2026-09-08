import { selectableVideoIds } from "../utils/selectable-video-ids";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import type { ImportPreviewProps } from "../types/import-ui.types";

export function ImportSelectionToolbar(props: ImportPreviewProps) {
  const t = useTranslations("youtubeImport");
  const counts = {
    count: props.selected.size,
    total: props.preview.availableCount,
  };
  return (
    <div className="border-border bg-surface-blue flex flex-wrap items-center justify-between gap-3 border-y-2 p-4">
      <p className="font-bold" role="status">
        {t("TXT_SELECTED", counts)}
      </p>
      <SelectionActions {...props} />
    </div>
  );
}

function SelectionActions({ preview, disabled, onSelect }: ImportPreviewProps) {
  const t = useTranslations("youtubeImport");
  const selectAll = () => onSelect(selectableVideoIds(preview));
  const actions = [
    { key: "BTN_SELECT_ALL", onClick: selectAll },
    { key: "BTN_DESELECT_ALL", onClick: () => onSelect(new Set<string>()) },
  ] as const;
  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Button
          key={action.key}
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={action.onClick}
        >
          {t(action.key)}
        </Button>
      ))}
    </div>
  );
}
