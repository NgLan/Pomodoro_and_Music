import { describe, expect, it } from "vitest";

import { normalizeApiError } from "./api-error";

describe("normalizeApiError", () => {
  it("maps the backend error envelope", () => {
    expect(
      normalizeApiError({
        code: 404,
        message: "Not found",
        error_code: "RESOURCE_NOT_FOUND",
        details: [],
        request_id: "request-1",
      }),
    ).toEqual({
      status: 404,
      errorCode: "RESOURCE_NOT_FOUND",
      message: "Not found",
      details: [],
      requestId: "request-1",
    });
  });

  it("maps fetch failures without exposing an unknown object", () => {
    expect(normalizeApiError(new TypeError("Failed to fetch"))).toMatchObject({
      status: 0,
      errorCode: "NETWORK_ERROR",
      details: [],
    });
  });
});
