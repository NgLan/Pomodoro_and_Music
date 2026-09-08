import { useId } from "react";
import { useTranslations } from "next-intl";
import { usePlaylistLibraryQuery } from "@/features/playlist/hooks/use-playlist-library-query";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select, SelectTrigger } from "@/shared/ui/select";
import type { PlaylistSummaryResponseDto } from "@/api";

import { PlaylistOptions } from "./PlaylistOptions";

interface PlaylistSelectorProps {
  value: string | null;
  onChange: (id: string | null) => void;
  label: string;
}

function getSelectorDisplay(
  value: string | null,
  playlists: PlaylistSummaryResponseDto[] | undefined,
  t: ReturnType<typeof useTranslations<"musicPlayer">>,
): string {
  if (!value || value === "none") return t("TXT_NO_PLAYLIST");
  const found = playlists?.find((item) => item.id === value);
  return found ? found.name : t("TXT_SAVED_PLAYLIST");
}

export function PlaylistSelector(props: PlaylistSelectorProps) {
  const query = usePlaylistLibraryQuery();
  const id = useId();
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <Label htmlFor={id} className="text-xs font-bold sm:text-sm">
        {props.label}
      </Label>
      <PlaylistSelect {...props} id={id} query={query} />
      <SelectorRetry query={query} />
    </div>
  );
}

type PlaylistSelectProps = PlaylistSelectorProps & {
  id: string;
  query: ReturnType<typeof usePlaylistLibraryQuery>;
};

function PlaylistSelect({ value, onChange, id, query }: PlaylistSelectProps) {
  const t = useTranslations("musicPlayer");
  const change = (next: string) => {
    // Radix's native form select can emit an empty value while options mount.
    if (next) onChange(next === "none" ? null : next);
  };
  return (
    <Select value={value ?? "none"} onValueChange={change}>
      <SelectTrigger
        id={id}
        className="h-10 w-full text-sm font-bold sm:h-10.5 sm:text-base"
        disabled={query.isLoading && !query.data}
      >
        <span
          data-slot="select-value"
          className="flex-1 truncate text-left font-bold"
        >
          {getSelectorDisplay(value, query.data, t)}
        </span>
      </SelectTrigger>
      <PlaylistOptions selected={value} playlists={query.data ?? []} />
    </Select>
  );
}

function SelectorRetry({
  query,
}: {
  query: ReturnType<typeof usePlaylistLibraryQuery>;
}) {
  const t = useTranslations("musicPlayer");
  if (!query.isError) return null;
  return (
    <Button type="button" variant="link" onClick={() => void query.refetch()}>
      {t("BTN_RETRY")}
    </Button>
  );
}
