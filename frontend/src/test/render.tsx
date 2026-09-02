import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import type { ReactElement } from "react";

import { TestProviders } from "./providers";

export * from "@testing-library/react";

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return testingLibraryRender(ui, { wrapper: TestProviders, ...options });
}
