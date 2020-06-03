import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RefreshTokenData } from '@app/modules/oauth2/interfaces';
import { toEpochSeconds } from '../utils';
import { OAuthAccessToken } from './o-auth-access-token';

@Entity()
export class OAuthRefreshToken extends BaseEntity {
  @Column({ type: 'uuid' })
  accessTokenId: string;

  @Column({ type: 'boolean' })
  revoked: boolean;

  @Column({ type: 'timestamp without time zone' })
  expiresAt: Date;

  @ManyToOne(type => OAuthAccessToken, {
    eager: true,
    onDelete: 'CASCADE',
  })
  accessToken: OAuthAccessToken;

  public toPayload(): RefreshTokenData {
    return {
      id: this.id,
      accessTokenId: this.accessTokenId,
      expiresAt: toEpochSeconds(this.expiresAt),
    }
  }
}
