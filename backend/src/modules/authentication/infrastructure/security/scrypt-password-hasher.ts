import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';
import type { PasswordHasherInterface } from '../../application/interfaces/password-hasher.interface.js';

const scrypt = promisify(scryptCallback);
const HASH_BYTES = 64;

@Injectable()
export class ScryptPasswordHasher implements PasswordHasherInterface {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64url');
    const value = (await scrypt(password, salt, HASH_BYTES)) as Buffer;
    return `scrypt$${salt}$${value.toString('base64url')}`;
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    const [algorithm, salt, encodedHash] = passwordHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !encodedHash) return false;
    const expected = Buffer.from(encodedHash, 'base64url');
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }
}
