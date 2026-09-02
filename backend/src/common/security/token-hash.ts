import { createHash } from 'node:crypto';
import { TOKEN_HASH_ALGORITHM } from './security.constants.js';

/** Produces a one-way digest suitable for storing opaque token identifiers. */
export function hashToken(token: string): string {
  if (token.length === 0) {
    throw new TypeError('Token must not be empty');
  }
  return createHash(TOKEN_HASH_ALGORITHM).update(token, 'utf8').digest('hex');
}
