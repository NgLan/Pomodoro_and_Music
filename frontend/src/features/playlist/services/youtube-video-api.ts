import {
  youtubeVideoResolve,
  youtubeVideoSearch,
  type MediaItemResponseDto,
} from "@/api";

const headers = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

function requireData<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("API response has no data");
  return value;
}

export async function searchYoutubeVideos(
  accessToken: string,
  query: string,
): Promise<MediaItemResponseDto[]> {
  const response = await youtubeVideoSearch({
    headers: headers(accessToken),
    query: { query },
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function resolveYoutubeVideo(
  accessToken: string,
  url: string,
): Promise<MediaItemResponseDto> {
  const response = await youtubeVideoResolve({
    body: { url },
    headers: headers(accessToken),
    throwOnError: true,
  });
  return requireData(response.data.data);
}
