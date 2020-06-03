import { BaseEntity } from './base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { OAuthCode } from './o-auth-code';
import { OAuthAccessToken } from './o-auth-access-token';
import { randomBytes } from 'crypto';
import { GrantTypes, ResponseModes, ResponseTypes, Scopes, TokenAuthMethod } from '@app/modules/oauth2/constants';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class OAuthClient extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  secret: string;

  @Column({ type: 'varchar', array: true, nullable: false })
  redirect: string[];

  @Column({ type: 'json', default: {} })
  meta: OAuthClientMeta;

  @Column({ type: 'varchar', array: true, default: `{${GrantTypes.AUTHORIZATION_CODE}}` })
  grantTypes: GrantTypes[];

  @Column({ type: 'varchar', array: true, default: `{${ResponseTypes.CODE}}` })
  responseTypes: ResponseTypes[];

  @Column({ type: 'varchar', array: true, default: `{${ResponseModes.QUERY}}` })
  responseModes: ResponseModes[];

  @Column({ type: 'varchar', array: true, default: `{${Object.values(Scopes).join(',')}}` })
  scopes: string[];

  @Column({ type: 'boolean', default: false })
  public: boolean;

  @Column({ type: 'boolean', default: false })
  firstParty: boolean;

  @Column({ type: 'varchar', array: true, default: `{${TokenAuthMethod.CLIENT_SECRET_BASIC},${TokenAuthMethod.CLIENT_SECRET_POST}}` })
  authMethods: TokenAuthMethod[];

  @OneToMany(type => OAuthCode, code => code.client)
  authCodes!: Promise<OAuthCode[]>;

  @OneToMany(type => OAuthAccessToken, token => token.client)
  tokens!: Promise<OAuthAccessToken[]>;

  @BeforeInsert()
  createSecret() {
    if (!this.secret) {
      this.secret = randomBytes(32).toString('hex');
    }
  }

  canHandleGrant(grant: GrantTypes) {
    return this.grantTypes.includes(grant);
  }

  canHandleResponseType(rt: ResponseTypes) {
    return this.responseTypes.includes(rt);
  }

  canHandleResponseMode(rm: ResponseModes) {
    return this.responseModes.includes(rm);
  }

  canIssueScope(scope: string) {
    return this.scopes.includes(scope);
  }

  canHandleAuthMethod(method: TokenAuthMethod) {
    return this.authMethods.includes(method);
  }

  @BeforeInsert()
  @BeforeUpdate()
  checkAuthMethods() {
    if (this.authMethods.includes(TokenAuthMethod.NONE) && this.authMethods.length > 1) {
      throw new BadRequestException('Client with token_endpoint_auth_method=none cannot have other auth methods');
    }
  }
}

export interface OAuthClientMeta {
  description?: string;
  logo_uri?: string;
}
