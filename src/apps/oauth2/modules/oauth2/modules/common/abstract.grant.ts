import { GrantInterface } from './grant.interface';
import { AuthorizeDto, TokenDto } from '@app/modules/oauth2/dto';
import { Request } from 'express';
import { AccessTokenRequestResponse, ClientCredentials, CredentialTuple } from '@app/modules/oauth2/interfaces';
import { OAuthException } from '../../errors';
import { AccessTokenService, ClientService, RefreshTokenService } from './services';
import { OAuthAccessToken, OAuthClient, OAuthCode, OAuthRefreshToken, User } from '@app/entities';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { grantsWithRefreshToken, GrantTypes, TokenAuthMethod } from '@app/modules/oauth2/constants';
import { Inject, Logger } from '@nestjs/common';
import { AuthRequest } from '@app/modules/oauth2/auth.request';

export abstract class AbstractGrant implements GrantInterface {
  public readonly logger = new Logger(this.constructor.name);

  @Inject()
  protected readonly config: ConfigService;

  @Inject(getConnectionToken())
  protected readonly connection: Connection;

  @Inject(ClientService)
  protected readonly clientService: ClientService;

  @Inject(AccessTokenService)
  protected readonly accessTokenService: AccessTokenService;

  @Inject(RefreshTokenService)
  protected readonly refreshTokenService: RefreshTokenService;

  getIdentifier(): GrantTypes {
    return null;
  }

  abstract respondToAccessTokenRequest(req: Request, body: TokenDto): Promise<AccessTokenRequestResponse>;

  createAuthRequest(data: AuthorizeDto): Promise<AuthRequest> {
    throw new Error('This grant cannot create an authorization request');
  }

  completeAuthRequest(authRequest: AuthRequest): Promise<OAuthCode> {
    throw new Error('This grant cannot complete an authorization request');
  }

  canRespondToAuthorizationRequest(query: Record<string, any>): boolean {
    return false;
  }

  async issueAccessToken(
    client: OAuthClient,
    userId: string | null,
    scopes: string[],
    repo?: Repository<OAuthAccessToken>,
  ) {
    return this.accessTokenService.create(
      repo,
      client.id,
      userId,
      scopes,
      this.getIdentifier(),
      this.config.get('oauth.accessTokenTTL'),
    );
  }

  async issueRefreshToken(
    accessToken: OAuthAccessToken,
    overrideExpiration?: Date,
    repo?: Repository<OAuthRefreshToken>,
  ): Promise<OAuthRefreshToken> {
    return this.refreshTokenService.create(
      repo,
      accessToken.id,
      this.config.get('oauth.refreshTokenTTL'),
      overrideExpiration,
    );
  }

  protected validateScope(client: OAuthClient, scopes: string[] = []) {
    scopes./*filter(s => s.split(':').length < 2).*/forEach(plainScope => {
      if (!client.canIssueScope(plainScope)) {
        this.logger.warn(`Client ${client.id} cannot issue scope ${plainScope}`);
        throw OAuthException.invalidScope(plainScope);
      }
    });
    return scopes;
  }

  protected async getClient(body: { client_id: string; client_secret?: string }, req?: Request, validateClient = true): Promise<OAuthClient> {
    const client = req?.client || await this.clientService.getClient(this.clientService.getClientCredentials(body, req?.headers), validateClient);
    if (!client.canHandleGrant(this.getIdentifier())) {
      this.logger.warn(`Client ${client.id} cannot handle grant ${this.getIdentifier()}`);
      throw OAuthException.unauthorizedClient();
    }
    return client;
  }

  protected shouldIssueRefreshToken(body: TokenDto, scopes?: string[]): boolean {
    if (scopes) {
      return scopes.includes('offline_access') && grantsWithRefreshToken.includes(body.grant_type);
    }
    return body.scopes.includes('offline_access') && grantsWithRefreshToken.includes(body.grant_type);
  }

  protected async returnAccessTokenResponse(
    { em, user, client, body, scopes }: { em: EntityManager; user?: User; client: OAuthClient; body: TokenDto; scopes?: string[] }
  ): Promise<AccessTokenRequestResponse> {
    const accessTokenRepo = em.getRepository(OAuthAccessToken);
    const accessToken = await this.issueAccessToken(client, user?.id || null, this.validateScope(client, scopes || body.scopes), accessTokenRepo);

    const response: AccessTokenRequestResponse = {
      accessToken,
      user,
    };

    if (this.shouldIssueRefreshToken(body)) {
      const refreshTokenRepo = em.getRepository(OAuthRefreshToken);
      response.refreshToken = await this.issueRefreshToken(accessToken, null, refreshTokenRepo);
    }

    return response;
  }
}
