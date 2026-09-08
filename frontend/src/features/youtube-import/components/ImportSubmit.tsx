import { Download, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import type { ImportConfirmationProps } from "../types/import-ui.types";

export function ImportSubmit({
  count,
  name,
  isPending,
  onImport,
}: ImportConfirmationProps) {
  const t = useTranslations("youtubeImport");
  return (
    <Button
      className="w-full"
      size="lg"
      disabled={isPending || !count || !name.trim()}
      onClick={onImport}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin motion-reduce:animate-none" />
      ) : (
        <Download />
      )}
      {t(isPending ? "BTN_IMPORTING" : "BTN_IMPORT", { count })}
    </Button>
  );
}

export function ImportProgress({ count, isPending }: ImportConfirmationProps) {
  const t = useTranslations("youtubeImport");
  const key = isPending
    ? "TXT_IMPORT_PROGRESS"
    : count
      ? "TXT_SYNC_POLICY"
      : "TXT_SELECT_HINT";
  return (
    <p role="status" className="text-muted-foreground text-sm">
      {t(key, { count })}
    </p>
  );
}
