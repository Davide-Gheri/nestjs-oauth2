import { HttpException, HttpStatus } from '@nestjs/common';

export class OAuthException extends HttpException {
  protected payload: Record<string, any>;

  constructor(
    error: string,
    error_description?: string,
    httpStatusCode = HttpStatus.BAD_REQUEST,
  ) {
    super(
      { error, error_description },
      httpStatusCode,
    );

    this.payload = {
      error, error_description,
    };
  }

  static unsupportedGrantType() {
    return new OAuthException(
      'unsupported_grant_type',
      'The authorization grant type is not supported by the authorization server.',
      HttpStatus.BAD_REQUEST,
    );
  }

  static invalidRequest(param?: string) {
    let message = 'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.';
    if (param) {
      message += ` Check the ${param} parameter`;
    }
    return new OAuthException(
      'invalid_request',
      message,
      HttpStatus.BAD_REQUEST,
    );
  }

  static invalidClient(hint?: string) {
    return new OAuthException(
      'invalid_client',
      `Client authentication failed. ${hint || ''}`.trimRight(),
      HttpStatus.UNAUTHORIZED,
    );
  }

  static unauthorizedClient() {
    return new OAuthException(
      'unauthorized_client',
      'Client cannot handle the specific grant_type',
      HttpStatus.BAD_REQUEST,
    )
  }

  static invalidGrant() {
    return new OAuthException(
      'invalid_grant',
      'The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI, or it was issued to another client.',
      HttpStatus.BAD_REQUEST,
    );
  }

  static invalidScope(scope?: string) {
    let message = 'The client cannot grant access to the requested scope';
    if (scope) {
      message += `: ${scope}`;
    }
    return new OAuthException(
      'invalid_scope',
      message,
      HttpStatus.BAD_REQUEST,
    );
  }

  static invalidRefreshToken(hint?: string) {
    let message = 'The refresh token is invalid';
    if (hint) {
      message += ` ${hint}`;
    }
    return new OAuthException(
      'invalid_request',
      message,
      HttpStatus.BAD_REQUEST,
    );
  }

  static invalidCodeChallenge() {
    return new OAuthException(
      'invalid_grant',
      'The provided code challenge does not match the passed code verifier',
      HttpStatus.BAD_REQUEST,
    );
  }

  static accessDenied(msg?: string) {
    let message = 'The resource owner or authorization server denied the request.';
    if (msg) {
      message += ` ${msg}`;
    }
    return new OAuthException(
      'access_denied',
      message,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
