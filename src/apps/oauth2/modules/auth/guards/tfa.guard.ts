import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class TfaGuard extends AuthGuard('otp') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    delete request.session.tfaSecret;
    await super.logIn(request);

    return result;
  }
}
