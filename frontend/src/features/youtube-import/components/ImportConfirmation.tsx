import { useTranslations } from "next-intl";
import type { ImportConfirmationProps } from "../types/import-ui.types";
import { ImportNameField } from "./ImportNameField";
import { ImportProgress, ImportSubmit } from "./ImportSubmit";

export function ImportConfirmation(props: ImportConfirmationProps) {
  const t = useTranslations("youtubeImport");
  return (
    <aside className="neo-surface bg-accent-yellow space-y-5 p-5 sm:p-6 lg:sticky lg:top-6">
      <span className="text-sm font-bold">{t("TXT_YOUR_COPY")}</span>
      <h2 className="text-2xl">{t("TXT_READY")}</h2>
      <ImportNameField {...props} />
      <p className="text-sm leading-relaxed">{t("TXT_LOCAL_COPY")}</p>
      <ImportSubmit {...props} />
      <ImportProgress {...props} />
    </aside>
  );
}
