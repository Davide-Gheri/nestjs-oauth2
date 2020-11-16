import { ArgumentsHost, Catch, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ForbiddenExceptionFilter as AuthForbiddenExceptionFilter } from '@app/modules/auth/filters';
import { AuthorizeDto } from '../dto';
import { PromptTypes } from '../constants';
import * as qs from 'querystring';

/**
 * Catch forbidden error to /authorize endpoint
 */
@Catch(ForbiddenException)
export class AuthorizeForbiddenExceptionFilter extends AuthForbiddenExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost): any {
    const res = host.switchToHttp().getResponse<Response>();
    const req = host.switchToHttp().getRequest<Request<any, any, any, AuthorizeDto>>();

    /**
     * If prompt=none, redirect to the redirect_uri with error
     */
    if (req.query.prompt === PromptTypes.none) {
      const url = new URL(req.query.redirect_uri);
      url.search = qs.stringify({
        error: 'login_required',
      });
      return res.redirect(url.toString());
      /**
       * If prompt=login the guard has correctly logged out the user (@see AuthorizeGuard)
       * We need to replace prompt=login with the default consent, otherwise it end in a login form loop
       * (The guard will see again prompt=login, will log out the user and so on)
       */
    } else if (req.query.prompt === PromptTypes.login) {
      const [baseUrl] = req.originalUrl.split('?');
      const newQuery = { ...req.query };
      newQuery.prompt = PromptTypes.consent;

      return super.catch(exception, host, `${baseUrl}?${qs.stringify(newQuery)}`)
    }

    return super.catch(exception, host);
  }
}
