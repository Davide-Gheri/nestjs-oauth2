import { ACGuard } from 'nest-access-control';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-errors';

export class AcGuard extends ACGuard {
  protected async getUser(context: ExecutionContext): Promise<any> {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }

  protected async getUserRoles(context: ExecutionContext): Promise<string> {
    const user = await this.getUser(context);
    return user.role;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) {
      throw new ForbiddenError('cannot access requested resource');
    }
    return can;
  }
}
