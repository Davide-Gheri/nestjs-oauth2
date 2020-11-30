import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OAuthClient } from './o-auth-client';
import { User } from './user';
import { toEpochSeconds } from '../utils';
import { AccessTokenJwtPayload } from '@app/modules/oauth2/interfaces';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { BaseToken } from '@app/entities/base.token';

@Entity()
export class OAuthAccessToken extends BaseToken {
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  clientId: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  scopes: string[];

  @Column({ type: 'varchar', enum: GrantTypes })
  grantType: GrantTypes;

  @ManyToOne(type => OAuthClient, client => client.tokens, {
    onDelete: 'CASCADE',
  })
  client!: Promise<OAuthClient>;

  @ManyToOne(type => User, user => user.tokens, {
    onDelete: 'CASCADE',
  })
  user: Promise<User>;

  public toPayload(): AccessTokenJwtPayload {
    return {
      aud: this.clientId,
      jti: this.id,
      exp: toEpochSeconds(this.expiresAt),
      sub: this.userId ? `${this.userId}@users` : `${this.clientId}@clients`,
      scopes: this.scopes,
    };
  }
}
