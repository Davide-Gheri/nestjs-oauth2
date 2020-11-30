import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@app/entities';
import { CreateUserInput, UpdateUserInput } from '../inputs';
import { ApolloError, UserInputError } from 'apollo-server-errors';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AcGuard, AuthGuard } from '@app/modules/management-api/guards';
import { UseRoles } from 'nest-access-control';
import { UserService } from '@app/modules/user';
import { HttpExceptionFilter } from '@app/modules/management-api/filters';
import { UsersPaginatedResponse } from '@app/modules/management-api/types/users-paginated.response';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'user',
    possession: 'any',
    action: 'read',
  })
  @Query(returns => UsersPaginatedResponse)
  async getUsers(
    @Args({ name: 'skip', type: () => Int, defaultValue: 0 }) skip: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    const [items, total] = await this.userService.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      paginationInfo: {
        hasMore: (skip + limit) < total,
        total,
      }
    }
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'user',
    possession: 'any',
    action: 'read',
  })
  @Query(returns => User)
  getUser(
    @Args({ name: 'id', type: () => ID }) id: string,
  ) {
    return this.userService.repository.findOne(id);
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'user',
    possession: 'any',
    action: 'create',
  })
  @Mutation(returns => User)
  async createUser(
    @Args({ name: 'data', type: () => CreateUserInput }) data: CreateUserInput,
  ) {
    try {
      return await this.userService.repository.save(
        this.userService.repository.create(data),
      );
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'user',
    possession: 'any',
    action: 'update',
  })
  @Mutation(returns => User)
  async updateUser(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args({ name: 'data', type: () => UpdateUserInput }) data: UpdateUserInput,
  ) {
    const user = await this.userService.repository.findOne(id);
    if (!user) {
      throw new UserInputError(`User with id ${id} not found`);
    }
    Object.assign(user, data);
    try {
      await this.userService.repository.save(user);
    } catch (e) {
      throw new ApolloError(e.message);
    }
    return user;
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'user',
    possession: 'any',
    action: 'delete',
  })
  @Mutation(returns => Boolean)
  async deleteUser(
    @Args({ name: 'id', type: () => ID }) id: string,
  ) {
    const client = await this.userService.repository.findOne(id);
    if (!client) {
      throw new UserInputError(`User with id ${id} not found`);
    }
    await this.userService.repository.remove(client);

    return true;
  }
}
