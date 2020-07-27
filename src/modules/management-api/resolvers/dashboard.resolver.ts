import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthClient, User } from '@app/entities';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Resolver()
export class DashboardResolver {
  constructor(
    @InjectRepository(OAuthClient)
    private readonly clientRepository: Repository<OAuthClient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(returns => Int)
  async usersCount() {
    return this.userRepository.count();
  }

  @Query(returns => Int)
  async clientsCount() {
    return this.clientRepository.count();
  }

  @Query(returns => Int)
  async newSignUps(
    @Args({ name: 'since', type: () => Date }) since: Date,
  ) {
    return this.userRepository.count({
      createdAt: MoreThanOrEqual(since),
    });
  }
}
