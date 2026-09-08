"use client";
import type { PlaylistDetailResponseDto } from "@/api";
import { useYoutubeSync } from "../hooks/use-youtube-sync";
import { PlaylistSourceInfo } from "./PlaylistSourceInfo";
import { PlaylistSyncActions } from "./PlaylistSyncActions";
import { PlaylistSyncFeedback } from "./PlaylistSyncFeedback";

type SourceSyncProps = { playlist: PlaylistDetailResponseDto };
export function PlaylistSourceSync({ playlist }: SourceSyncProps) {
  const sync = useYoutubeSync(playlist.id);
  if (playlist.sourceType !== "YOUTUBE") return null;
  return (
    <section className="neo-surface bg-surface space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PlaylistSourceInfo playlist={playlist} />
        <PlaylistSyncActions playlist={playlist} sync={sync} />
      </div>
      <PlaylistSyncFeedback sync={sync} />
    </section>
  );
}
