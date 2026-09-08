import { useTranslations } from "next-intl";
import type { ImportPreviewProps } from "../types/import-ui.types";
import { ImportPreviewItem } from "./ImportPreviewItem";

export function ImportPreviewList(props: ImportPreviewProps) {
  const t = useTranslations("youtubeImport");
  if (!props.preview.items.length)
    return <p className="p-8 text-center">{t("TXT_EMPTY")}</p>;
  return (
    <div className="max-h-[34rem] overflow-y-auto overscroll-contain">
      {props.preview.items.map((item) => (
        <SelectableItem key={item.externalMediaId} {...props} item={item} />
      ))}
    </div>
  );
}

function SelectableItem({
  item,
  selected,
  disabled,
  onSelect,
}: ImportPreviewProps & {
  item: ImportPreviewProps["preview"]["items"][number];
}) {
  const toggle = () => {
    const next = new Set(selected);
    if (next.has(item.externalMediaId)) next.delete(item.externalMediaId);
    else next.add(item.externalMediaId);
    onSelect(next);
  };
  return (
    <ImportPreviewItem
      item={item}
      checked={selected.has(item.externalMediaId)}
      disabled={disabled}
      onToggle={toggle}
    />
  );
}
