import type { User } from '../../../user/domain/entities/user.entity.js';
import type { LoginInput } from '../inputs/login.input.js';
import type { RegisterInput } from '../inputs/register.input.js';
import type { AuthenticationOutput } from '../outputs/authentication.output.js';

export interface AuthenticationServiceInterface {
  register(input: RegisterInput): Promise<AuthenticationOutput>;
  login(input: LoginInput): Promise<AuthenticationOutput>;
  refresh(rawToken: string): Promise<AuthenticationOutput>;
  logout(rawToken?: string): Promise<void>;
  authenticate(accessToken: string): Promise<User>;
}
