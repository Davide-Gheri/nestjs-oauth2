import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * The user is not authorized to perform this action
 * Usually thrown by a guard returning "false"
 */
@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost, urlOverride?: string): any {
    const res = host.switchToHttp().getResponse<Response>();
    const req = host.switchToHttp().getRequest<Request>();
    /**
     * If there is a user in the session, log him out
     */
    if (req.user) {
      req.logout();
    }
    /**
     * Redirect to the login page
     */
    res.redirect('/auth/login?redirect_uri=' + encodeURIComponent(urlOverride || req.url));
  }
}
