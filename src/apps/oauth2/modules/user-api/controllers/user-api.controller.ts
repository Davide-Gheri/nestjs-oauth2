import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '@app/modules/user';
import { AccessToken, JwtGuard, Scope, ScopeGuard } from '@app/modules/auth';
import { AccessTokenJwtPayload } from '@app/modules/oauth2/interfaces';
import { ApiScopes } from '@app/modules/oauth2/constants';

@UseGuards(JwtGuard, ScopeGuard)
@Controller('api/users')
export class UserApiController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Scope(ApiScopes.users_profile, ApiScopes.users_email)
  @Get()
  async getUsers(
    @Query('ids') ids: string[],
    @AccessToken() token: AccessTokenJwtPayload,
  ) {
    if (!ids) {
      throw new BadRequestException('"ids" query parameter is required');
    }
    return this.userService.repository.findByIds(ids)
      .then(users => users.map(u => u.toApiProfile(token.scopes as any)))
      .catch(err => {
        throw new BadRequestException(err.message);
      })
  }

  @Scope(ApiScopes.users_profile, ApiScopes.users_email)
  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @AccessToken() token: AccessTokenJwtPayload,
  ) {
    try {
      const user = await this.userService.repository.findOneOrFail(id);
      return user.toApiProfile(token.scopes as any);
    } catch (e) {
      return null;
    }
  }
}
