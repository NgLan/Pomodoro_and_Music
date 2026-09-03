import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuthProvider } from '../../../../user/domain/enums/auth-provider.enum.js';
import { UserStatus } from '../../../../user/domain/enums/user-status.enum.js';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 320, unique: true }) email!: string;
  @Column({ name: 'display_name', type: 'varchar', length: 120, nullable: true }) displayName!: string | null;
  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true }) passwordHash!: string | null;
  @Column({ name: 'auth_provider', type: 'enum', enum: AuthProvider }) authProvider!: AuthProvider;
  @Column({ name: 'provider_subject', type: 'varchar', length: 255, nullable: true }) providerSubject!: string | null;
  @Column({ type: 'enum', enum: UserStatus }) status!: UserStatus;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
