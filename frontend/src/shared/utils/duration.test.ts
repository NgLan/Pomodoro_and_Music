import { describe, expect, it } from "vitest";

import { formatDuration } from "./duration";

describe("formatDuration", () => {
  it("formats minute and hour clock values", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3_661)).toBe("01:01:01");
  });

  it("rejects negative and non-finite values", () => {
    expect(() => formatDuration(-1)).toThrow(RangeError);
    expect(() => formatDuration(Number.NaN)).toThrow(RangeError);
  });
});
