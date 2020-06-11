import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OAuthClient } from '@app/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientInput, UpdateClientInput } from '../inputs';
import { ApolloError, UserInputError } from 'apollo-server-errors';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AcGuard, AuthGuard } from '../guards';
import { UseRoles } from 'nest-access-control';
import { HttpExceptionFilter } from '@app/modules/management-api/filters';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
@Resolver(of => OAuthClient)
export class ClientResolver {
  constructor(
    @InjectRepository(OAuthClient)
    private readonly clientRepository: Repository<OAuthClient>,
  ) {}

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'client',
    possession: 'any',
    action: 'read',
  })
  @Query(returns => [OAuthClient])
  getClients() {
    return this.clientRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'client',
    possession: 'any',
    action: 'read',
  })
  @Query(returns => OAuthClient)
  getClient(
    @Args({ name: 'id', type: () => ID }) id: string,
  ) {
    return this.clientRepository.findOne(id);
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'client',
    possession: 'any',
    action: 'create',
  })
  @Mutation(returns => OAuthClient)
  async createClient(
    @Args({ name: 'data', type: () => CreateClientInput }) data: CreateClientInput,
  ) {
    try {
      return await this.clientRepository.save(
        this.clientRepository.create(data),
      );
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'client',
    possession: 'any',
    action: 'update',
  })
  @Mutation(returns => OAuthClient)
  async updateClient(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args({ name: 'data', type: () => UpdateClientInput }) data: UpdateClientInput,
  ) {
    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new UserInputError(`Client with id ${id} not found`);
    }
    Object.assign(client, data, {
      meta: {
        ...client.meta,
        ...data.meta,
      },
    });
    try {
      await this.clientRepository.save(client);
    } catch (e) {
      throw new ApolloError(e.message);
    }
    return client;
  }

  @UseGuards(AcGuard)
  @UseRoles({
    resource: 'client',
    possession: 'any',
    action: 'delete',
  })
  @Mutation(returns => Boolean)
  async deleteClient(
    @Args({ name: 'id', type: () => ID }) id: string,
  ) {
    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new UserInputError(`Client with id ${id} not found`);
    }
    await this.clientRepository.remove(client);

    return true;
  }
}
