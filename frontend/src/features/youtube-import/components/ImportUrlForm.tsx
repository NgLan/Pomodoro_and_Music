import { useTranslations } from "next-intl";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { ImportUrlFormProps } from "../types/import-ui.types";
import { useImportUrlForm } from "../hooks/use-import-url-form";
import { ImportUrlField, ImportUrlHint } from "./ImportUrlField";

export function ImportUrlForm(props: ImportUrlFormProps) {
  const t = useTranslations("youtubeImport");
  const form = useImportUrlForm(props);
  return (
    <form className="space-y-3" onSubmit={form.onSubmit}>
      <label className="text-sm font-bold" htmlFor="playlist-url">
        {t("URL_LABEL")}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ImportUrlField {...form} disabled={props.disabled} />
        <PreviewButton {...props} />
      </div>
      <ImportUrlHint invalid={form.invalid} />
    </form>
  );
}

function PreviewButton({ disabled, isLoading }: ImportUrlFormProps) {
  const t = useTranslations("youtubeImport");
  return (
    <Button className="h-14" disabled={disabled} type="submit">
      {isLoading ? (
        <LoaderCircle className="animate-spin motion-reduce:animate-none" />
      ) : (
        <ArrowRight />
      )}
      {t(isLoading ? "BTN_FETCHING" : "BTN_PREVIEW")}
    </Button>
  );
}
