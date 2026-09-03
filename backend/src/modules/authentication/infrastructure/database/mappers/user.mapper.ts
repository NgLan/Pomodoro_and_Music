import { User } from '../../../../user/domain/entities/user.entity.js';
import { UserOrmEntity } from '../entities/user.orm-entity.js';

export function toUserDomain(entity: UserOrmEntity): User {
  return User.create({ ...entity });
}

export function toUserPersistence(user: User): UserOrmEntity {
  return Object.assign(new UserOrmEntity(), {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    passwordHash: user.passwordHash,
    authProvider: user.authProvider,
    providerSubject: user.providerSubject,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
