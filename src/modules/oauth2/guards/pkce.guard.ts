import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Request } from 'express';
import { memoize } from '@nestjs/passport/dist/utils/memoize.util';
import { OAuthClient } from '@app/entities';
import { TokenAuthMethod } from '@app/modules/oauth2/constants';
import { OAuthException } from '@app/modules/oauth2/errors';

export type IPkceGuard = CanActivate;

export const PkceGuard: (
  step: 'challenge' | 'verifier',
) => Type<IPkceGuard> = memoize(createPkceGuard);

function createPkceGuard(step: 'challenge' | 'verifier'): Type<IPkceGuard> {
  class MixinPkceGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<Request>();
      if (!req.client) {
        return false;
      }

      const client: OAuthClient = req.client;
      switch (step) {
        case 'challenge':
          if (client.canHandleAuthMethod(TokenAuthMethod.none)) {
            if (!req.query.code_challenge || !req.query.code_challenge_method) {
              throw OAuthException.invalidRequest('code_challenge');
            }
          }
          return true;
        case 'verifier':
          if (client.canHandleAuthMethod(TokenAuthMethod.none)) {
            if (!req.body.code_verifier) {
              throw OAuthException.invalidRequest('code_verifier');
            }
          }
          return true;
      }
    }
  }

  const guard = mixin(MixinPkceGuard);
  return guard;
}
