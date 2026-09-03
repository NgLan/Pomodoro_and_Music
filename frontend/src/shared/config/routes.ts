export const routes = {
  HOME: "/",
  POMODORO: "/pomodoro",
  PLAYLISTS: "/playlists",
  PLAYLIST_DETAIL: (id: string) =>
    `/playlists/${encodeURIComponent(id)}` as const,
  HISTORY: "/history",
  SETTINGS: "/settings",
} as const;
