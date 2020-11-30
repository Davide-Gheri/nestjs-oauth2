import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from '@app/modules/auth/guards';
import { AuthorizeDto } from '../dto';
import { Request } from 'express';
import { PromptTypes } from '../constants';

/**
 * Guard to /authorize endpoint
 */
@Injectable()
export class AuthorizeGuard extends AuthenticatedGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request<any, any, any, AuthorizeDto>>();
    const { query } = req;
    /**
     * If prompt=login we must show the login form again
     * We log out the user, thus the parent class will throw a ForbiddenException,
     * catch (@see AuthorizeForbiddenExceptionFilter) to redirect to the login page
     */
    if (query.prompt === PromptTypes.login) {
      req.logout();
    }

    return super.canActivate(context);
  }
}
