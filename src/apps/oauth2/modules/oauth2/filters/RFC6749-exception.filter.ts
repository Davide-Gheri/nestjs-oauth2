import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { OAuthException } from '@app/modules/oauth2/errors';
import { Response } from 'express';

@Catch(HttpException)
export class RFC6749ExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    let oAuthException: OAuthException;
    if (!(exception instanceof OAuthException)) {
      const [error, description] = this.getErrorAndDescription(exception);

      oAuthException = new OAuthException(
        error,
        description,
        exception.getStatus(),
      );
    } else {
      oAuthException = exception;
    }

    const res = host.switchToHttp().getResponse<Response>();

    return res
      .status(oAuthException.getStatus())
      .json(oAuthException.getResponse());
  }

  private getErrorAndDescription(exception: HttpException) {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      const error = response;
      const description = exception.message;
      return [
        error,
        description !== error ? description : undefined,
      ];
    }
    if (Array.isArray((response as any).message)) { // Validation error
      return [
        'invalid_request',
        (response as any).message[0],
      ];
    }
    return [
      (response as any).message || exception.message,
      (response as any).error,
    ];
  }
}
