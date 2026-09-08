import { Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import type { useImportUrlForm } from "../hooks/use-import-url-form";

type UrlFieldProps = ReturnType<typeof useImportUrlForm> & {
  disabled: boolean;
};
export function ImportUrlField(props: UrlFieldProps) {
  const t = useTranslations("youtubeImport");
  const inputProps = {
    id: "playlist-url",
    value: props.url,
    disabled: props.disabled,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      props.onChange(event.target.value),
    placeholder: t("URL_PLACEHOLDER"),
    "aria-invalid": props.invalid,
    "aria-describedby": "url-help",
  };
  return (
    <div className="relative flex-1">
      <Link2 aria-hidden className="absolute top-4 left-3 size-5" />
      <Input className="bg-surface h-14 pl-11" {...inputProps} />
    </div>
  );
}

export function ImportUrlHint({ invalid }: { invalid: boolean }) {
  const t = useTranslations("youtubeImport");
  const className = invalid
    ? "text-destructive text-sm"
    : "text-muted-foreground text-sm";
  return (
    <p id="url-help" className={className} role={invalid ? "alert" : undefined}>
      {t(invalid ? "MSG_INVALID_URL" : "TXT_URL_HELP")}
    </p>
  );
}
