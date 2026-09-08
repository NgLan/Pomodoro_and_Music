import Link from "next/link";
import { ArrowLeft, ListMusic } from "lucide-react";
import { useTranslations } from "next-intl";
import { routes } from "@/shared/config/routes";
import type { ImportState } from "../types/import-ui.types";
import { ImportUrlForm } from "./ImportUrlForm";

export function ImportBackLink() {
  const t = useTranslations("youtubeImport");
  return (
    <Link
      href={routes.PLAYLISTS}
      className="inline-flex items-center gap-2 font-bold hover:underline"
    >
      <ArrowLeft className="size-4" />
      {t("BTN_BACK")}
    </Link>
  );
}

export function ImportHero({ state }: { state: ImportState }) {
  const onPreview = (url: string) => {
    state.importer.reset();
    state.preview.mutate(url);
  };
  const disabled = state.preview.isPending || state.importer.isPending;
  return (
    <header className="neo-surface bg-surface-blue relative space-y-5 overflow-hidden p-6 sm:p-8">
      <ImportIntro />
      {!state.importer.isSuccess && (
        <ImportUrlForm
          disabled={disabled}
          isLoading={state.preview.isPending}
          onPreview={onPreview}
        />
      )}
    </header>
  );
}

function ImportIntro() {
  const t = useTranslations("youtubeImport");
  return (
    <>
      <ListMusic
        aria-hidden
        className="absolute -top-4 -right-4 size-36 rotate-12 opacity-10"
      />
      <p className="relative text-sm font-bold">{t("TXT_EYEBROW")}</p>
      <h1 className="relative text-3xl sm:text-4xl">{t("TXT_TITLE")}</h1>
      <p className="text-muted-foreground relative max-w-2xl">
        {t("TXT_DESCRIPTION")}
      </p>
    </>
  );
}
