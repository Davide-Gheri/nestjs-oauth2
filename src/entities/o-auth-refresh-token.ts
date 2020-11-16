import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RefreshTokenData } from '@app/modules/oauth2/interfaces';
import { toEpochSeconds } from '../utils';
import { OAuthAccessToken } from './o-auth-access-token';
import { BaseToken } from '@app/entities/base.token';

@Entity()
export class OAuthRefreshToken extends BaseToken {
  @Column({ type: 'uuid' })
  accessTokenId: string;

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
