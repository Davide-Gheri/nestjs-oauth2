import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Return the current user from the request
 */
export const CurrentUser = createParamDecorator((_: any, ctx: ExecutionContext) => {
  if (ctx.getType<'graphql'>() === 'graphql') {
    const context = GqlExecutionContext.create(ctx);
    return context.getContext().req.user;
  }
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
