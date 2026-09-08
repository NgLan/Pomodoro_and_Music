import {
  malformedYoutubeResponse,
  translateYoutubeFailure,
} from './youtube-api-error.js';

export async function readYoutubeResponse<T>(response: Response): Promise<T> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return malformedYoutubeResponse();
  }
  if (!response.ok) {
    const error = body as { error?: { errors?: { reason?: string }[] } } | null;
    translateYoutubeFailure(response.status, error?.error?.errors?.[0]?.reason);
  }
  validateYoutubeEnvelope(body);
  return body as T;
}

function validateYoutubeEnvelope(body: unknown) {
  if (!body || typeof body !== 'object') malformedYoutubeResponse();
  const { items, nextPageToken } = body as {
    items?: unknown;
    nextPageToken?: unknown;
  };
  if (
    !Array.isArray(items) ||
    items.some((item) => !item || typeof item !== 'object')
  )
    malformedYoutubeResponse();
  if (nextPageToken !== undefined && typeof nextPageToken !== 'string')
    malformedYoutubeResponse();
}
