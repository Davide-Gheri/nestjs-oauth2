import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TfaRequiredException } from '@app/modules/auth/errors';
import { Request, Response } from 'express';
import { User } from '@app/entities';

@Catch(TfaRequiredException)
export class TfaExceptionFilter implements ExceptionFilter {
  async catch(exception: TfaExceptionFilter, host: ArgumentsHost): Promise<any> {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();

    const user: User = (req.user as any);

    // const otpAuthUrl = speakeasy.otpauthURL({
    //   secret: user.tfaSecret,
    //   encoding: 'base32',
    //   label: 'Argo',
    // });
    req.session.tfaSecret = user.tfaSecret;
    // const dataUrl = await qrcode.toDataURL(otpAuthUrl);

    return res.status(206).json({
      tfaRequired: true,
    });
  }
}
