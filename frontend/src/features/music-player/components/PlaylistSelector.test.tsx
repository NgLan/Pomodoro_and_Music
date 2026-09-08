import { afterEach, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@/test/render";
import { PlaylistSelector } from "./PlaylistSelector";

const mockQuery = vi.fn();

vi.mock("@/features/playlist/hooks/use-playlist-library-query", () => ({
  usePlaylistLibraryQuery: () => mockQuery(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("renders playlist options and propagates selected id", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  mockQuery.mockReturnValue({
    data: [{ id: "playlist-1", name: "Deep Focus" }],
    isLoading: false,
    isError: false,
  });

  render(
    <PlaylistSelector
      value={null}
      onChange={handleChange}
      label="Nhạc tập trung"
    />,
  );

  const trigger = screen.getByRole("combobox");
  await user.click(trigger);

  const option = await screen.findByRole("option", { name: "Deep Focus" });
  await user.click(option);

  expect(handleChange).toHaveBeenCalledWith("playlist-1");
});

it("propagates null when user selects no playlist", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  mockQuery.mockReturnValue({
    data: [{ id: "playlist-1", name: "Deep Focus" }],
    isLoading: false,
    isError: false,
  });
  render(
    <PlaylistSelector
      value="playlist-1"
      onChange={handleChange}
      label="Nhạc tập trung"
    />,
  );
  expect(screen.getByRole("combobox")).toHaveTextContent("Deep Focus");
  await user.click(screen.getByRole("combobox"));
  const noneOption = await screen.findByRole("option", {
    name: "Không phát nhạc",
  });
  await user.click(noneOption);
  expect(handleChange).toHaveBeenCalledWith(null);
});
