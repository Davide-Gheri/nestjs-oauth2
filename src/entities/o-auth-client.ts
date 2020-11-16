import { BaseEntity } from './base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { OAuthCode } from './o-auth-code';
import { OAuthAccessToken } from './o-auth-access-token';
import { randomBytes } from 'crypto';
import { GrantTypes, ResponseModes, ResponseTypes, Scopes, TokenAuthMethod } from '@app/modules/oauth2/constants';
import { BadRequestException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { JSONResolver } from 'graphql-scalars';

@ObjectType()
@Entity()
export class OAuthClient extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'varchar' })
  secret: string;

  @Field(returns => [String])
  @Column({ type: 'varchar', array: true, nullable: false })
  redirect: string[];

  @Field(returns => JSONResolver)
  @Column({ type: 'json', default: {} })
  meta: OAuthClientMeta;

  @Field(returns => [GrantTypes])
  @Column({ type: 'varchar', array: true, default: `{${GrantTypes.authorization_code}}` })
  grantTypes: GrantTypes[];

  @Field(returns => [ResponseTypes])
  @Column({ type: 'varchar', array: true, default: `{${ResponseTypes.code}}` })
  responseTypes: ResponseTypes[];

  @Field(returns => [ResponseModes])
  @Column({ type: 'varchar', array: true, default: `{${ResponseModes.query}}` })
  responseModes: ResponseModes[];

  @Field(returns => [String])
  @Column({ type: 'varchar', array: true, default: `{${Object.values(Scopes).join(',')}}` })
  scopes: string[];

  @Field()
  @Column({ type: 'boolean', default: false })
  firstParty: boolean;

  @Field(returns => [TokenAuthMethod])
  @Column({ type: 'varchar', array: true, default: `{${TokenAuthMethod.client_secret_basic},${TokenAuthMethod.client_secret_post}}` })
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
    if (this.authMethods) {
      if (this.authMethods.includes(TokenAuthMethod.none) && this.authMethods.length > 1) {
        throw new BadRequestException('Client with token_endpoint_auth_method=none cannot have other auth methods');
      }
    }
  }
}

export interface OAuthClientMeta {
  description?: string;
  logo_uri?: string;
}
