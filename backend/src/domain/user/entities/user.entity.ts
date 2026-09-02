import {
  BusinessException,
  ErrorCode,
} from '../../../common/exceptions/index.js';
import { AuthProvider } from '../enums/auth-provider.enum.js';
import { UserStatus } from '../enums/user-status.enum.js';

export interface UserProps {
  id: string;
  email: string;
  displayName: string | null;
  passwordHash: string | null;
  authProvider: AuthProvider;
  providerSubject: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly passwordHash: string | null;
  readonly authProvider: AuthProvider;
  readonly providerSubject: string | null;
  readonly status: UserStatus;
  private readonly createdAtValue: Date;
  private readonly updatedAtValue: Date;

  private constructor(props: UserProps) {
    User.assertProviderConfiguration(props);
    this.id = props.id;
    this.email = props.email;
    this.displayName = props.displayName;
    this.passwordHash = props.passwordHash;
    this.authProvider = props.authProvider;
    this.providerSubject = props.providerSubject;
    this.status = props.status;
    this.createdAtValue = new Date(props.createdAt);
    this.updatedAtValue = new Date(props.updatedAt);
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  get createdAt(): Date {
    return new Date(this.createdAtValue);
  }

  get updatedAt(): Date {
    return new Date(this.updatedAtValue);
  }

  private static assertProviderConfiguration(props: UserProps): void {
    const hasProviderSubject = Boolean(props.providerSubject?.trim());
    const hasValidConfiguration =
      (props.authProvider === AuthProvider.GOOGLE && hasProviderSubject) ||
      (props.authProvider === AuthProvider.LOCAL && !hasProviderSubject);

    if (!hasValidConfiguration) {
      throw new BusinessException({
        code: ErrorCode.INVALID_AUTH_PROVIDER_CONFIGURATION,
        message: 'Authentication provider configuration is invalid',
      });
    }
  }
}
