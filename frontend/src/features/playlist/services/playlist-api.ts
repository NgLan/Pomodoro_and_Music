import {
  playlistCreate,
  playlistDelete,
  playlistDuplicate,
  playlistGet,
  playlistList,
  playlistUpdate,
  type PlaylistDetailResponseDto,
  type PlaylistListData,
  type PlaylistMetadataRequestDto,
  type PlaylistSummaryResponseDto,
} from "@/api";

const headers = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

function requireData<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("API response has no data");
  return value;
}

export async function listPlaylists(
  accessToken: string,
  query?: PlaylistListData["query"],
): Promise<PlaylistSummaryResponseDto[]> {
  const response = await playlistList({
    headers: headers(accessToken),
    query,
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function getPlaylist(
  accessToken: string,
  id: string,
): Promise<PlaylistDetailResponseDto> {
  const response = await playlistGet({
    headers: headers(accessToken),
    path: { id },
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function createPlaylist(
  accessToken: string,
  body: PlaylistMetadataRequestDto,
): Promise<PlaylistDetailResponseDto> {
  const response = await playlistCreate({
    body,
    headers: headers(accessToken),
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function updatePlaylist(
  accessToken: string,
  id: string,
  body: PlaylistMetadataRequestDto,
): Promise<PlaylistDetailResponseDto> {
  const response = await playlistUpdate({
    body,
    headers: headers(accessToken),
    path: { id },
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function deletePlaylist(
  accessToken: string,
  id: string,
): Promise<void> {
  await playlistDelete({
    headers: headers(accessToken),
    path: { id },
    throwOnError: true,
  });
}

export async function duplicatePlaylist(
  accessToken: string,
  id: string,
): Promise<PlaylistDetailResponseDto> {
  const response = await playlistDuplicate({
    headers: headers(accessToken),
    path: { id },
    throwOnError: true,
  });
  return requireData(response.data.data);
}
