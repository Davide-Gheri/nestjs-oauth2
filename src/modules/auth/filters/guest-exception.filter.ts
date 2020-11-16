import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GuestException } from '../errors';
import { Request, Response } from 'express';

/**
 * Catch not guest users (ex register / login routes)
 * Redirect to the specified url or homepage
 */
@Catch(GuestException)
export class GuestExceptionFilter implements ExceptionFilter {
  catch(exception: GuestException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();

    res.redirect(<string>req.query.redirect_uri || '/');
  }
}
