import type { YoutubePlaylistPreviewResponseDto } from "@/api";
import type { useYoutubeImport } from "../hooks/use-youtube-import";

export type ImportState = ReturnType<typeof useYoutubeImport>;
export interface ImportPreviewProps {
  preview: YoutubePlaylistPreviewResponseDto;
  selected: Set<string>;
  disabled: boolean;
  onSelect: (ids: Set<string>) => void;
}
export interface ImportConfirmationProps {
  count: number;
  name: string;
  isPending: boolean;
  onName: (name: string) => void;
  onImport: () => void;
}
export interface ImportUrlFormProps {
  disabled: boolean;
  isLoading: boolean;
  onPreview: (url: string) => void;
}
