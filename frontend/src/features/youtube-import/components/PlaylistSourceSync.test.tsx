import { afterEach, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import type { PlaylistDetailResponseDto } from "@/api";
import { cleanup, render, screen } from "@/test/render";
import { syncYoutubePlaylist } from "../services/youtube-playlist-api";
import { PlaylistSourceSync } from "./PlaylistSourceSync";

vi.mock("@/shared/providers/auth-provider", () => ({
  useAuth: () => ({ accessToken: "test" }),
}));
vi.mock("../services/youtube-playlist-api", () => ({
  syncYoutubePlaylist: vi.fn(),
}));
afterEach(cleanup);
const playlist: PlaylistDetailResponseDto = {
  id: "playlist",
  name: "Focus",
  description: null,
  thumbnailUrl: null,
  sourceType: "YOUTUBE",
  sourceUrl: "https://youtube.com/playlist?list=PLtest",
  sourceExternalId: "PLtest",
  lastSyncedAt: null,
  items: [],
  createdAt: "2026-09-08T00:00:00Z",
  updatedAt: "2026-09-08T00:00:00Z",
};
const result = {
  addedCount: 0,
  skippedCount: 0,
  unavailableCount: 0,
  syncedAt: "2026-09-08T00:00:00Z",
};

it("shows a successful no-new-videos result", async () => {
  vi.mocked(syncYoutubePlaylist).mockResolvedValue(result);
  render(<PlaylistSourceSync playlist={playlist} />);
  await userEvent.click(screen.getByRole("button", { name: "Đồng bộ" }));
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Không có video mới",
  );
  expect(syncYoutubePlaylist).toHaveBeenCalledWith("test", playlist.id);
});

it("offers retry on provider failure and then recovers", async () => {
  vi.mocked(syncYoutubePlaylist)
    .mockRejectedValueOnce({ error_code: "YOUTUBE_RATE_LIMITED" })
    .mockResolvedValue(result);
  render(<PlaylistSourceSync playlist={playlist} />);
  await userEvent.click(screen.getByRole("button", { name: "Đồng bộ" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Thử lại" }));
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Không có video mới",
  );
});

it("hides source actions for manual playlists", () => {
  render(
    <PlaylistSourceSync playlist={{ ...playlist, sourceType: "MANUAL" }} />,
  );
  expect(
    screen.queryByRole("button", { name: "Đồng bộ" }),
  ).not.toBeInTheDocument();
});
