import type { Request } from 'express';

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [cookieName, ...value] = part.trim().split('=');
    if (cookieName === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
}
