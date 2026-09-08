import { useId } from "react";
import { useTranslations } from "next-intl";
import { usePlaylistLibraryQuery } from "@/features/playlist/hooks/use-playlist-library-query";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { PlaylistSummaryResponseDto } from "@/api";

interface PlaylistSelectorProps {
  value: string | null;
  onChange: (id: string | null) => void;
  label: string;
}

export function PlaylistSelector({
  value,
  onChange,
  label,
}: PlaylistSelectorProps) {
  const query = usePlaylistLibraryQuery();
  const id = useId();
  const t = useTranslations("musicPlayer");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value ?? "none"}
        onValueChange={(next) => onChange(next === "none" ? null : next)}
      >
        <SelectTrigger id={id} className="w-full" disabled={query.isLoading}>
          <SelectValue placeholder={t("TXT_CHOOSE_PLAYLIST")} />
        </SelectTrigger>
        <PlaylistOptions selected={value} playlists={query.data ?? []} />
      </Select>
      <SelectorRetry query={query} />
    </div>
  );
}

function PlaylistOptions({
  selected,
  playlists,
}: {
  selected: string | null;
  playlists: PlaylistSummaryResponseDto[];
}) {
  const t = useTranslations("musicPlayer");
  return (
    <SelectContent>
      <SelectItem value="none">{t("TXT_NO_PLAYLIST")}</SelectItem>
      {selected && !playlists.some((item) => item.id === selected) && (
        <SelectItem value={selected}>{t("TXT_SAVED_PLAYLIST")}</SelectItem>
      )}
      {playlists.map((playlist) => (
        <SelectItem key={playlist.id} value={playlist.id}>
          {playlist.name}
        </SelectItem>
      ))}
    </SelectContent>
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
