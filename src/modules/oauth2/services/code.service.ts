import { Injectable } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthException } from '../errors';
import { AuthorizeDto } from '../dto';
import { OAuthAccessToken, OAuthClient, User } from '@app/entities';
import { MoreThan, Repository } from 'typeorm';
import { AuthRequest } from '../auth.request';
import { AuthCodeResponse } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CodeService extends OAuthService {
  public async validateAuthorizationRequest(query: AuthorizeDto, user: User) {
    const grant = this.grants.find(g => g.canRespondToAuthorizationRequest(query));
    if (!grant) {
      throw OAuthException.unsupportedGrantType();
    }
    const authRequest = await grant.createAuthRequest(query);
    const validToken = await this.findValidToken(user, authRequest.client, authRequest.scopes)

    return {
      authRequest,
      skip: (validToken && authRequest.scopes.every(scope => validToken.scopes.includes(scope)))
        || authRequest.client.firstParty,
    }
  }

  public async completeAuthorizationRequest(authRequest: AuthRequest, user: User, approved: boolean): Promise<AuthCodeResponse> {
    const grant = this.grants.find(g => g.getIdentifier() === authRequest.grantTypeId);
    if (!grant) {
      throw OAuthException.unsupportedGrantType();
    }
    authRequest.user = user;
    authRequest.approved = approved;
    const authCode = await grant.completeAuthRequest(authRequest);
    const code = this.cipherService.encrypt(authCode.toPayload(
      authRequest.codeChallenge,
      authRequest.codeChallengeMethod,
    ));

    return {
      code,
      returnTo: authRequest.redirectUri,
      state: authRequest.state,
    }
  }

  public async findValidToken(user: User, client: OAuthClient, scopes: string[]) {
    return this.accessTokenRepository.createQueryBuilder('token')
      .where({ clientId: client.id, userId: user.id, revoked: false, expiresAt: MoreThan(new Date()) })
      .andWhere('token.scopes @> :scopes', { scopes })
      .getOne();
  }
}
