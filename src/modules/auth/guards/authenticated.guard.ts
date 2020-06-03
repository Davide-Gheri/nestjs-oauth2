import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Check if there is a valid user in the session
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
