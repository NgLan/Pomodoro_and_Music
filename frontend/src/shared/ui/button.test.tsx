import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";
import { Button } from "./button";

it("exposes an accessible button and handles activation", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Save</Button>);

  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(handleClick).toHaveBeenCalledOnce();
});
