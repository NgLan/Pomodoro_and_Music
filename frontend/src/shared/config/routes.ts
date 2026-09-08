export const routes = {
  HOME: "/",
  POMODORO: "/pomodoro",
  PLAYLIST_IMPORT: "/playlists/import",
  PLAYLISTS: "/playlists",
  PLAYLIST_DETAIL: (id: string) =>
    `/playlists/${encodeURIComponent(id)}` as const,
  HISTORY: "/history",
  SETTINGS: "/settings",
} as const;
