import { useSyncExternalStore } from "react";
import { afterEach, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@/test/render";
import { createPlayerStore } from "../state/player-store";
import { RepeatModeButton } from "./RepeatModeButton";

const context = vi.hoisted(() => ({
  store: null as ReturnType<typeof createPlayerStore> | null,
}));
vi.mock("../providers/PlayerProvider", () => ({
  usePlayer: () => {
    const store = context.store!;
    return {
      store,
      state: useSyncExternalStore(store.subscribe, store.getSnapshot),
    };
  },
}));
afterEach(cleanup);

it("cycles off, playlist, one track, off with accessible state", async () => {
  context.store = createPlayerStore();
  const user = userEvent.setup();
  render(<RepeatModeButton />);
  const button = screen.getByRole("button", { name: "Lặp playlist" });
  expect(button).toHaveAttribute("aria-pressed", "false");
  await user.click(button);
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(context.store.getSnapshot().isRepeat).toBe(true);
  await user.click(button);
  expect(button).toHaveAccessibleName("Lặp một bài");
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(context.store.getSnapshot().isRepeatOne).toBe(true);
  await user.click(button);
  expect(button).toHaveAccessibleName("Lặp playlist");
  expect(button).toHaveAttribute("aria-pressed", "false");
});
