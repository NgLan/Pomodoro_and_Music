import { ImportWarnings } from "./ImportWarnings";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { YoutubePlaylistImportResponseDto } from "@/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

export function ImportResult({
  result,
}: {
  result: YoutubePlaylistImportResponseDto;
}) {
  const t = useTranslations("youtubeImport");
  return (
    <section
      className="neo-surface bg-secondary flex flex-col items-center gap-5 p-8 text-center sm:p-12"
      role="status"
    >
      <span className="border-border bg-surface shadow-neo grid size-16 place-items-center rounded-full border-2">
        <Check className="size-8" />
      </span>
      <h2 className="text-3xl">{t("TXT_SUCCESS")}</h2>
      <p>{t("MSG_IMPORTED", { count: result.importedCount })}</p>
      <ImportWarnings {...result} />
      <OpenPlaylistLink id={result.playlistId} />
    </section>
  );
}

function OpenPlaylistLink({ id }: { id: string }) {
  const t = useTranslations("youtubeImport");
  return (
    <Button asChild size="lg">
      <Link href={routes.PLAYLIST_DETAIL(id)}>
        {t("BTN_OPEN_PLAYLIST")}
        <ArrowRight />
      </Link>
    </Button>
  );
}
