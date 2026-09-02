import { vi } from "vitest";

export function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function useDeterministicClock(now: Date): void {
  vi.useFakeTimers();
  vi.setSystemTime(now);
}
