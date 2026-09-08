import type { PlaylistItemResponseDto } from "@/api";

export interface TrackRowProps {
  item: PlaylistItemResponseDto;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onPlay: () => void;
  onRemove: () => void;
}
