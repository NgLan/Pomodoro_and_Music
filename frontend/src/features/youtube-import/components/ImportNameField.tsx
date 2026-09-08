import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import type { ImportConfirmationProps } from "../types/import-ui.types";

export function ImportNameField(props: ImportConfirmationProps) {
  const { name, isPending, onName } = props;
  const t = useTranslations("youtubeImport");
  const inputProps = {
    id: "import-name",
    value: name,
    maxLength: 255,
    disabled: isPending,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      onName(event.target.value),
    "aria-invalid": !name.trim(),
    "aria-describedby": !name.trim() ? "name-help" : undefined,
  };
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold" htmlFor="import-name">
        {t("NAME_LABEL")}
      </label>
      <Input className="bg-surface" {...inputProps} />
      <NameHint isEmpty={!name.trim()} />
    </div>
  );
}

function NameHint({ isEmpty }: { isEmpty: boolean }) {
  const t = useTranslations("youtubeImport");
  return isEmpty ? (
    <p id="name-help" className="text-sm">
      {t("MSG_NAME_REQUIRED")}
    </p>
  ) : null;
}
