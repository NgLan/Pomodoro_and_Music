import type { YoutubePlaylistPreviewResponseDto } from "@/api";

export function selectableVideoIds(preview: YoutubePlaylistPreviewResponseDto) {
  return new Set(
    preview.items
      .filter((item) => item.selectable)
      .map((item) => item.externalMediaId),
  );
}
