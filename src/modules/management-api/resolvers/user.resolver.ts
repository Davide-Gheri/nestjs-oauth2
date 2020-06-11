import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@app/entities';
import { CreateUserInput, UpdateUserInput } from '../inputs';
import { ApolloError, UserInputError } from 'apollo-server-errors';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AcGuard, AuthGuard } from '@app/modules/management-api/guards';
import { UseRoles } from 'nest-access-control';
import { UserService } from '@app/modules/user';
import { HttpExceptionFilter } from '@app/modules/management-api/filters';

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
  @Query(returns => [User])
  getUsers() {
    return this.userService.repository.find({
      order: { createdAt: 'ASC' },
    });
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
