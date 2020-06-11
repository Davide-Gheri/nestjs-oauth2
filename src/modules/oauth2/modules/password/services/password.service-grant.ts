import { AbstractGrant, InjectableGrant } from '../../common';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { Request } from 'express';
import { TokenDto } from '@app/modules/oauth2/dto';
import { AccessTokenRequestResponse } from '@app/modules/oauth2/interfaces';
import { User } from '@app/entities';
import { OAuthException } from '@app/modules/oauth2/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@InjectableGrant(GrantTypes.password)
export class PasswordServiceGrant extends AbstractGrant {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async respondToAccessTokenRequest(req: Request, body: TokenDto): Promise<AccessTokenRequestResponse> {
    const client = await this.getClient(body, req);
    const user = await this.getUser(body);

    return this.connection.transaction(async em =>
      this.returnAccessTokenResponse({ em, user, client, body }),
    );
  }

  protected async getUser({ username, password }: TokenDto): Promise<User> {
    if (!username) {
      throw OAuthException.invalidRequest('username');
    }
    if (!password) {
      throw OAuthException.invalidRequest('password');
    }

    const user = await this.userRepository.findOne({
      email: username,
    });

    if (!user || !(await user.validatePassword(password))) {
      this.logger.warn(`Invalid user credentials`);
      throw OAuthException.invalidGrant();
    }
    return user;
  }
}
