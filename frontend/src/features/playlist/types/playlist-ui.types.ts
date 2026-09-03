import type { MediaItemResponseDto, PlaylistSummaryResponseDto } from "@/api";

export type PlaylistMetadataDraft = Pick<
  PlaylistSummaryResponseDto,
  "id" | "name" | "description" | "thumbnailUrl"
>;

export type PlaylistDialogState =
  | { mode: "create"; playlist: null }
  | { mode: "edit"; playlist: PlaylistMetadataDraft }
  | null;

export interface PlaybackState {
  current: MediaItemResponseDto | null;
  isRepeat: boolean;
  isShuffled: boolean;
}
