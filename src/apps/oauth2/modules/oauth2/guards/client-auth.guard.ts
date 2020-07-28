import { CanActivate, ExecutionContext, Inject, mixin, Type } from '@nestjs/common';
import { ClientService } from '@app/modules/oauth2/modules';
import { Request } from 'express';

export type IClientAuthGuard = CanActivate;

export const ClientAuthGuard: (
  validateSecret?: boolean,
) => Type<IClientAuthGuard> = createClientAuthGuard;

function createClientAuthGuard(validateSecret = true): Type<IClientAuthGuard> {
  class MixinClientAuthGuard implements CanActivate {
    constructor(
      @Inject(ClientService)
      private readonly clientService: ClientService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<Request>();
      const isGet = req.method === 'GET';
      const client = await this.clientService.getClient(
        this.clientService.getClientCredentials(
          isGet ? req.query : req.body,
          !isGet && req.headers
        ),
        validateSecret,
      );
      // Cache retrieved client on request
      req.client = client;

      return !!client;
    }
  }

  const guard = mixin(MixinClientAuthGuard);
  return guard;
}
