import { useTranslations } from "next-intl";
import type { MediaItemResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/ui/states/StandardStates";
import { YoutubeSearchResult } from "./YoutubeSearchResult";

export function YoutubeSearchResults({
  addingId,
  isError,
  isPending,
  isSuccess,
  onAdd,
  onRetry,
  results,
}: {
  addingId: string | null;
  isError: boolean;
  isPending: boolean;
  isSuccess: boolean;
  onAdd: (video: MediaItemResponseDto) => void;
  onRetry: () => void;
  results: MediaItemResponseDto[];
}) {
  const translate = useTranslations("playlist");
  if (isPending)
    return (
      <LoadingState
        title={translate("TXT_SEARCHING")}
        description={translate("TXT_SEARCHING_DESCRIPTION")}
      />
    );
  if (isError)
    return (
      <ErrorState
        title={translate("TXT_YOUTUBE_ERROR")}
        description={translate("TXT_YOUTUBE_ERROR_DESCRIPTION")}
        action={<Button onClick={onRetry}>{translate("BTN_RETRY")}</Button>}
      />
    );
  if (isSuccess && !results.length)
    return (
      <EmptyState
        title={translate("TXT_NO_VIDEO_RESULTS")}
        description={translate("TXT_NO_VIDEO_RESULTS_DESCRIPTION")}
      />
    );
  return results.map((video) => (
    <YoutubeSearchResult
      key={video.externalMediaId}
      isAdding={addingId === video.externalMediaId}
      onAdd={() => onAdd(video)}
      video={video}
    />
  ));
}
