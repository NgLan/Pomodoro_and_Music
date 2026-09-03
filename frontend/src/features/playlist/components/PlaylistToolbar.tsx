import { CirclePlay, Link2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

export function PlaylistToolbar({
  onAddUrl,
  onSearch,
}: {
  onAddUrl: () => void;
  onSearch: () => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <section className="neo-surface bg-surface flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <span className="bg-accent-pink border-border grid size-11 place-items-center rounded-xl border-2 text-white">
          <CirclePlay />
        </span>
        <div>
          <h2 className="text-lg">{translate("TXT_ADD_MUSIC")}</h2>
          <p className="text-muted-foreground text-sm">
            {translate("TXT_ADD_MUSIC_DESCRIPTION")}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onSearch}>
          <Search />
          {translate("BTN_SEARCH_YOUTUBE")}
        </Button>
        <Button onClick={onAddUrl} variant="outline">
          <Link2 />
          {translate("BTN_ADD_BY_URL")}
        </Button>
      </div>
    </section>
  );
}
