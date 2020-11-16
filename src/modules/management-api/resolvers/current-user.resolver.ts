import { Resolver, Query, Context, Mutation, Args, ID } from '@nestjs/graphql';
import { Session } from '../types';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards';
import { CurrentUser } from '@app/modules/auth';
import { User } from '@app/entities';
import { SessionService } from '../services';
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
}
