import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GuestException } from '../errors';

/**
 * Ensure that the user is not logged in
 */
@Injectable()
export class GuestGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    if (req.user) {
      throw new GuestException();
    }
    return true;
  }
}
