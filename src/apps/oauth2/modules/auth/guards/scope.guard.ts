import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(
    protected readonly ref: Reflector,
  ) {}

  private getScopes(context: ExecutionContext) {
    return [
      ...(this.ref.get<string[]>('scope', context.getClass()) || []),
      ...(this.ref.get<string[]>('scope', context.getHandler()) || []),
    ];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToHttp().getRequest<Request>().accessToken;
    if (!token) {
      return false;
    }
    const scopes = this.getScopes(context);

    if (!scopes.length) {
      return true;
    }

    return scopes.some(s => token.scopes.includes(s));
  }
}
