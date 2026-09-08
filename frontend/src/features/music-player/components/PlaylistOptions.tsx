import { useTranslations } from "next-intl";
import type { PlaylistSummaryResponseDto } from "@/api";
import { SelectContent, SelectItem } from "@/shared/ui/select";

export function PlaylistOptions({
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
      {selected &&
        selected !== "none" &&
        !playlists.some((item) => item.id === selected) && (
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
