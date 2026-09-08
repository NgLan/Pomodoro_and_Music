import type { PlaylistItemResponseDto } from "@/api";

export interface TrackRowProps {
  item: PlaylistItemResponseDto;
  index: number;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onPlay: () => void;
  onRemove: () => void;
  onDragStart?: (e: React.DragEvent<HTMLElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLElement>, index: number) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent<HTMLElement>, index: number) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}
