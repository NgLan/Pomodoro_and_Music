import { useTranslations } from "next-intl";
import { normalizeApiError } from "@/shared/lib/api-error";
import { getErrorMessageKey } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";

interface ImportErrorProps {
  error: unknown;
  onRetry: () => void;
  disabled?: boolean;
}

export function ImportError({ error, onRetry, disabled }: ImportErrorProps) {
  const errors = useTranslations("errors");
  const t = useTranslations("youtubeImport");
  return (
    <div
      role="alert"
      className="border-destructive bg-surface flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 p-4"
    >
      <p>{errors(getErrorMessageKey(normalizeApiError(error).errorCode))}</p>
      <Button variant="outline" onClick={onRetry} disabled={disabled}>
        {t("BTN_RETRY")}
      </Button>
    </div>
  );
}
