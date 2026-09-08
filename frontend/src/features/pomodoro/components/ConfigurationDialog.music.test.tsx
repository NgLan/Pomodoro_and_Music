import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@/test/render";
import { configurationFixture } from "@/features/music-player/state/player.fixture";
import { ConfigurationDialog } from "./ConfigurationDialog";

const mockQuery = vi.fn();
vi.mock("@/features/playlist/hooks/use-playlist-library-query", () => ({
  usePlaylistLibraryQuery: () => mockQuery(),
}));
afterEach(cleanup);

const playlists = [
  { id: "focus", name: "Deep Focus" },
  { id: "break", name: "Relax" },
];

it("keeps saved music selections when playlist options finish loading", async () => {
  mockQuery.mockReturnValue({ isLoading: true, isError: false });
  const props = {
    configuration: configurationFixture,
    isOpen: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
  };
  const view = render(<ConfigurationDialog {...props} />);
  mockQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    data: playlists,
  });
  view.rerender(<ConfigurationDialog {...props} />);
  await waitFor(() => {
    expect(
      screen.getByRole("combobox", { name: "Nhạc tập trung" }),
    ).toHaveTextContent("Deep Focus");
    expect(
      screen.getByRole("combobox", { name: "Nhạc nghỉ ngơi" }),
    ).toHaveTextContent("Relax");
  });
});
