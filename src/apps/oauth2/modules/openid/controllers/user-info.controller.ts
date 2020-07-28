import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessToken, CurrentUser, JwtGuard } from '@app/modules/auth';
import { User } from '@app/entities';
import { AccessTokenJwtPayload } from '@app/modules/oauth2/interfaces';
import { Scopes } from '@app/modules/oauth2/constants';

@Controller('userinfo')
export class UserInfoController {
  @UseGuards(JwtGuard)
  @Get()
  @Post()
  async userInfo(
    @CurrentUser() user: User,
    @AccessToken() token: AccessTokenJwtPayload,
  ) {
    return user.toOpenIdProfile((token.scopes || []) as Scopes[]);
  }
}
