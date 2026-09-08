import type { PlaylistDetailResponseDto } from "@/api";

export type PlayerIssue =
  "MSG_PLAYER_ERROR" | "MSG_AUTOPLAY_BLOCKED" | "MSG_TRACK_SKIPPED" | null;
export interface PlaylistCursor {
  itemId: string | null;
  position: number;
  queue: string[];
  shuffleEnabled?: boolean;
}
export interface PlayerState extends PlaylistCursor {
  playlistId: string | null;
  playlist: PlaylistDetailResponseDto | null;
  cursors: Record<string, PlaylistCursor>;
  isPlaying: boolean;
  isShuffleEnabled: boolean;
  isRepeat: boolean;
  isRepeatOne: boolean;
  failedIds: string[];
  issue: PlayerIssue;
  revision: number;
  providerRevision: number;
  volume: number;
  duration: number;
  seekTarget: number | null;
}
