export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasherInterface {
  hash(password: string): Promise<string>;
  verify(password: string, passwordHash: string): Promise<boolean>;
}
