import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Return a cookie or all cookies from the request
 */
export const Cookie = createParamDecorator((cookieName: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (cookieName) {
    return req.cookies[cookieName] || req.signedCookies[cookieName];
  }
  return {
    ...req.cookies,
    ...req.signedCookies,
  };
});
