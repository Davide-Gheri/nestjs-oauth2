import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  GoneException,
  Injectable,
} from '@nestjs/common';
import { UrlSignService } from '../services';
import { Request } from 'express';
import { VerifyResult } from 'signed';

@Injectable()
export class SignedGuard implements CanActivate {
  constructor(
    private readonly urlSignService: UrlSignService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    switch (this.urlSignService.verifyReq(req)) {
      case VerifyResult.blackholed:
        throw new ForbiddenException();
      case VerifyResult.expired:
        throw new GoneException();
      case VerifyResult.ok:
        return true;
    }

    console.log(

    )
    return true;
  }
}
