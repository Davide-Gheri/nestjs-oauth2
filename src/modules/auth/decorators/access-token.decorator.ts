import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Return the current parsed access_token from the request
 */
export const AccessToken = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.accessToken;
});
