import {
  playlistItemAdd,
  playlistItemDelete,
  playlistItemReorder,
  type PlaylistDetailResponseDto,
} from "@/api";

const headers = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

function requireData(
  value: PlaylistDetailResponseDto | undefined,
): PlaylistDetailResponseDto {
  if (!value) throw new Error("API response has no data");
  return value;
}

export async function addPlaylistVideo(
  accessToken: string,
  id: string,
  externalVideoId: string,
) {
  const response = await playlistItemAdd({
    body: { externalVideoId },
    headers: headers(accessToken),
    path: { id },
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function deletePlaylistItem(
  accessToken: string,
  id: string,
  itemId: string,
) {
  const response = await playlistItemDelete({
    headers: headers(accessToken),
    path: { id, itemId },
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function reorderPlaylistItems(
  accessToken: string,
  id: string,
  itemIds: string[],
) {
  const response = await playlistItemReorder({
    body: { itemIds },
    headers: headers(accessToken),
    path: { id },
    throwOnError: true,
  });
  return requireData(response.data.data);
}
