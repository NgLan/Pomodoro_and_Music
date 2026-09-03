import { Import, Music2, Plus, Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function PlaylistLibraryHero({
  search,
  onCreate,
  onSearch,
}: {
  search: string;
  onCreate: () => void;
  onSearch: (value: string) => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <section className="neo-surface bg-accent-yellow relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <Music2
        aria-hidden="true"
        className="text-accent-pink absolute -right-5 -bottom-6 size-36 rotate-12 opacity-20"
      />
      <div className="relative max-w-3xl space-y-4">
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">{translate("SEARCH_LABEL")}</span>
            <Search className="text-muted-foreground pointer-events-none absolute top-3.5 left-3 size-4" />
            <Input
              className="bg-surface h-12 pl-10"
              onChange={(event) => onSearch(event.target.value)}
              placeholder={translate("SEARCH_PLACEHOLDER")}
              value={search}
            />
          </label>
          <Button className="h-12" onClick={onCreate}>
            <Plus />
            {translate("BTN_CREATE_PLAYLIST")}
          </Button>
          <Button
            className="h-12"
            disabled
            title={translate("TXT_COMING_SOON")}
            variant="outline"
          >
            <Import />
            {translate("BTN_IMPORT_YOUTUBE")}
          </Button>
        </div>
      </div>
    </section>
  );
}
