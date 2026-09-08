import { useState } from "react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/render";
import type { YoutubePlaylistPreviewResponseDto } from "@/api";
import { ImportPreview } from "./ImportPreview";

const item = {
  externalMediaId: "video01",
  title: "Morning jazz",
  channelName: "Cafe",
  thumbnailUrl: null,
  durationSeconds: 120,
  sourceUrl: "https://youtube.com/watch?v=video01",
  availability: "AVAILABLE" as const,
  selectable: true,
};
const preview: YoutubePlaylistPreviewResponseDto = {
  sourceExternalId: "PLtest",
  sourceUrl: "https://youtube.com/playlist?list=PLtest",
  title: "Focus",
  description: null,
  thumbnailUrl: null,
  totalCount: 2,
  fetchedCount: 2,
  availableCount: 1,
  unavailableCount: 1,
  skippedCount: 0,
  items: [
    item,
    {
      ...item,
      externalMediaId: "video02",
      title: "Private",
      selectable: false,
      availability: "UNAVAILABLE",
    },
  ],
};

function Harness() {
  const [selected, onSelect] = useState(new Set(["video01"]));
  return (
    <ImportPreview
      preview={preview}
      selected={selected}
      disabled={false}
      onSelect={onSelect}
    />
  );
}

describe("playlist preview selection", () => {
  it("selects/deselects available videos and disables unavailable ones", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(
      screen.getByRole("checkbox", { name: "Chọn Private" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Bỏ chọn tất cả" }));
    expect(
      screen.getByRole("checkbox", { name: "Chọn Morning jazz" }),
    ).not.toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("Đã chọn 0 / 1");
    await user.click(screen.getByRole("button", { name: "Chọn tất cả" }));
    expect(
      screen.getByRole("checkbox", { name: "Chọn Morning jazz" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Chọn Private" }),
    ).not.toBeChecked();
    await user.click(
      screen.getByRole("checkbox", { name: "Chọn Morning jazz" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Đã chọn 0 / 1");
  });
});
