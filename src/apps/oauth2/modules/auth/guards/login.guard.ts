import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { TfaRequiredException } from '@app/modules/auth/errors';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    if (request.user.tfaEnabled && request.user.tfaSecret) {
      throw new TfaRequiredException();
    }
    await super.logIn(request);

    return result;
  }
}
