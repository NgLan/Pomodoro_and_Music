import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Index() @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @Column({ name: 'token_hash', type: 'varchar', length: 128, unique: true })
  tokenHash!: string;
  @Column({ name: 'expires_at', type: 'timestamptz' }) expiresAt!: Date;
  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
}
