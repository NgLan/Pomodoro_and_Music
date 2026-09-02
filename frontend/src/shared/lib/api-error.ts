export interface AppError {
  status: number;
  errorCode: string;
  message: string;
  details: unknown[];
  requestId?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function isAppError(error: unknown): error is AppError {
  return (
    isRecord(error) &&
    typeof error.status === "number" &&
    typeof error.errorCode === "string" &&
    typeof error.message === "string" &&
    Array.isArray(error.details)
  );
}

/** Converts fetch, generated-client, and backend envelope failures to one shape. */
export function normalizeApiError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof TypeError) {
    return {
      status: 0,
      errorCode: "NETWORK_ERROR",
      message: error.message,
      details: [],
    };
  }

  const root = isRecord(error) ? error : {};
  const response = isRecord(root.response) ? root.response : {};
  const nestedError = isRecord(root.error) ? root.error : {};
  const body = isRecord(response.data)
    ? response.data
    : isRecord(root.body)
      ? root.body
      : Object.keys(nestedError).length > 0
        ? nestedError
        : root;

  return {
    status:
      readNumber(root.status) ??
      readNumber(response.status) ??
      readNumber(body.code) ??
      0,
    errorCode:
      readString(body.error_code) ?? readString(root.errorCode) ?? "UNKNOWN",
    message:
      readString(body.message) ??
      readString(root.message) ??
      "Unexpected API error",
    details: Array.isArray(body.details) ? body.details : [],
    requestId:
      readString(body.request_id) ?? readString(root.requestId) ?? undefined,
  };
}
