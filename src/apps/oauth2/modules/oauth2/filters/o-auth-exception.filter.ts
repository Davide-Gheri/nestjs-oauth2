import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { OAuthException } from '../errors';
import { Request, Response } from 'express';
import { handleResponseMode } from '../utils';
import { ResponseModes } from '../constants';

@Catch(OAuthException)
export class OAuthExceptionFilter implements ExceptionFilter {
  catch(exception: OAuthException, host: ArgumentsHost): any {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();

    if (req.query.response_mode) {
      return handleResponseMode(
        res,
        req.query.response_mode as ResponseModes,
        req.query.redirect_uri as string,
        exception.getResponse() as Record<string, any>,
      );
    }

    // TODO support multiple content-types

    return res
      .status(exception.getStatus())
      .json(exception.getResponse())
  }
}
