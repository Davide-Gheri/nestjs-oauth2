import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Return the current user from the request
 */
export const CurrentUser = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
