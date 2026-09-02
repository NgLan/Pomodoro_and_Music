import { randomBytes } from 'node:crypto';
import { DEFAULT_RANDOM_TOKEN_BYTES } from './security.constants.js';

/** Generates a URL-safe token using Node's cryptographically secure RNG. */
export function generateRandomToken(
  byteLength = DEFAULT_RANDOM_TOKEN_BYTES,
): string {
  if (
    !Number.isInteger(byteLength) ||
    byteLength < DEFAULT_RANDOM_TOKEN_BYTES
  ) {
    throw new RangeError(
      `Token entropy must be at least ${DEFAULT_RANDOM_TOKEN_BYTES} bytes`,
    );
  }
  return randomBytes(byteLength).toString('base64url');
}
