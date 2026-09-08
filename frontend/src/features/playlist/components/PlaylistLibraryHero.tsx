import { Music2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  PlaylistLibraryActions,
  type PlaylistLibraryActionsProps,
} from "./PlaylistLibraryActions";

export function PlaylistLibraryHero(props: PlaylistLibraryActionsProps) {
  return (
    <section className="neo-surface bg-accent-yellow relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <Music2
        aria-hidden="true"
        className="text-accent-pink absolute -right-5 -bottom-6 size-36 rotate-12 opacity-20"
      />
      <div className="relative max-w-3xl space-y-4">
        <LibraryIntro />
        <PlaylistLibraryActions {...props} />
      </div>
    </section>
  );
}

function LibraryIntro() {
  const translate = useTranslations("playlist");
  return (
    <>
      <span className="bg-surface border-border inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-sm font-bold">
        <Sparkles className="size-4" />
        {translate("TXT_LIBRARY_EYEBROW")}
      </span>
      <div>
        <h1 className="text-3xl sm:text-4xl">
          {translate("TXT_LIBRARY_TITLE")}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-base sm:text-lg">
          {translate("TXT_LIBRARY_DESCRIPTION")}
        </p>
      </div>
    </>
  );
}
