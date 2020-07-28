import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OAuthClient } from './o-auth-client';
import { User } from './user';
import { AuthCodeData } from '@app/modules/oauth2/interfaces';
import { toEpochSeconds } from '../utils';

@Entity()
export class OAuthCode extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Index()
  @Column({ type: 'uuid' })
  clientId!: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  scopes!: string[];

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @Column({ type: 'timestamp without time zone' })
  expiresAt: Date;

  @Column({ type: 'varchar' })
  redirectUri: string;

  @ManyToOne(type => OAuthClient, client => client.authCodes, {
    onDelete: 'CASCADE',
  })
  client: Promise<OAuthClient>;

  @ManyToOne(type => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  toPayload(challenge?: string, challengeMethod?: string): AuthCodeData {
    return {
      id: this.id,
      expiresAt: toEpochSeconds(this.expiresAt),
      codeChallenge: challenge,
      codeChallengeMethod: challengeMethod,
    }
  }
}
