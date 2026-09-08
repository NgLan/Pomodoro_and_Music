import Link from "next/link";
import { Import, Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export interface PlaylistLibraryActionsProps {
  search: string;
  onCreate: () => void;
  onSearch: (value: string) => void;
}
export function PlaylistLibraryActions(props: PlaylistLibraryActionsProps) {
  const t = useTranslations("playlist");
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <LibrarySearch {...props} />
      <Button className="h-12" onClick={props.onCreate}>
        <Plus />
        {t("BTN_CREATE_PLAYLIST")}
      </Button>
      <Button className="h-12" asChild variant="outline">
        <Link href={routes.PLAYLIST_IMPORT}>
          <Import />
          {t("BTN_IMPORT_YOUTUBE")}
        </Link>
      </Button>
    </div>
  );
}

function LibrarySearch({ search, onSearch }: PlaylistLibraryActionsProps) {
  const t = useTranslations("playlist");
  return (
    <label className="relative flex-1">
      <span className="sr-only">{t("SEARCH_LABEL")}</span>
      <Search className="text-muted-foreground pointer-events-none absolute top-3.5 left-3 size-4" />
      <Input
        className="bg-surface h-12 pl-10"
        onChange={(event) => onSearch(event.target.value)}
        placeholder={t("SEARCH_PLACEHOLDER")}
        value={search}
      />
    </label>
  );
}
