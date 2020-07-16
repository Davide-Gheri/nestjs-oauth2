import { Resolver, Query, Context, Mutation, Args, ID } from '@nestjs/graphql';
import { Session } from '../types';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards';
import { CurrentUser } from '@app/modules/auth';
import { User } from '@app/entities';
import { SessionService, TfaService } from '../services';
import { Request } from 'express';
import { UserService } from '@app/modules/user';
import { UpdateCurrentUserInput } from '@app/modules/management-api/inputs';
import { HttpExceptionFilter } from '@app/modules/management-api/filters';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
@Resolver()
export class CurrentUserResolver {
  constructor(
    private readonly sessionService: SessionService,
    private readonly tfaService: TfaService,
    private readonly userService: UserService,
  ) {}

  @Query(returns => [Session])
  async activeSessions(
    @CurrentUser() user: User,
    @Context('req') req: Request,
  ) {
    return this.sessionService.getUserSessions(user, req);
  }

  @Mutation(returns => Boolean)
  async deleteSession(
    @CurrentUser() user: User,
    @Context('req') req: Request,
    @Args({ name: 'id', type: () => ID }) id: string,
  ) {
    return this.sessionService.deleteUserSession(user, req, id);
  }

  @Mutation(returns => User)
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Args({ name: 'data', type: () => UpdateCurrentUserInput }) data: UpdateCurrentUserInput,
  ) {
    return this.userService.updateWithPassword(user, data);
  }

  @Mutation(returns => String)
  async requestTfa(
    @CurrentUser() user: User,
  ) {
    return this.tfaService.getQrCode(user);
  }

  @Mutation(returns => Boolean)
  async verifyTfa(
    @CurrentUser() user: User,
    @Args({ name: 'code', type: () => String }) code: string,
  ) {
    return this.tfaService.verifyCode(user, code);
  }

  @Mutation(returns => Boolean)
  async disableTfa(
    @CurrentUser() user: User,
  ) {
    return this.tfaService.disable(user);
  }
}
