import {
  youtubePlaylistPreview,
  youtubePlaylistImport,
  youtubePlaylistSync,
  type YoutubePlaylistImportRequestDto,
} from "@/api";

const headers = (token: string) => ({ Authorization: `Bearer ${token}` });
function requireData<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("API response has no data");
  return value;
}
export async function previewYoutubePlaylist(token: string, url: string) {
  const response = await youtubePlaylistPreview({
    body: { url },
    headers: headers(token),
    throwOnError: true,
  });
  return requireData(response.data.data);
}
export async function importYoutubePlaylist(
  token: string,
  body: YoutubePlaylistImportRequestDto,
) {
  const response = await youtubePlaylistImport({
    body,
    headers: headers(token),
    throwOnError: true,
  });
  return requireData(response.data.data);
}
export async function syncYoutubePlaylist(token: string, id: string) {
  const response = await youtubePlaylistSync({
    path: { id },
    headers: headers(token),
    throwOnError: true,
  });
  return requireData(response.data.data);
}
