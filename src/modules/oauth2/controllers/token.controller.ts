import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { IntrospectDto, TokenDto } from '../dto';
import { TokenService } from '../services';
import { Request } from 'express';
import { ClientAuthGuard, PkceGuard } from '@app/modules/oauth2/guards';
import { OAuthExceptionFilter, RFC6749ExceptionFilter } from '@app/modules/oauth2/filters';
import { OAuthException } from '@app/modules/oauth2/errors';

@UseFilters(RFC6749ExceptionFilter, OAuthExceptionFilter)
@Controller('oauth2')
export class TokenController {
  constructor(
    private readonly service: TokenService,
  ) {}

  /**
   * /oauth2/token endpoint
   * issue a new access_token
   * @param req
   * @param data
   */
  @UseGuards(ClientAuthGuard(), PkceGuard('verifier'))
  @Post('token')
  issueAccessToken(
    @Req() req: Request,
    @Body() data: TokenDto,
  ) {
    return this.service.respondToAccessTokenRequest(req, data);
  }

  /**
   * /oauth2/introspect endpoint
   * returns information about the given access/refresh token
   * @param data
   */
  @UseGuards(ClientAuthGuard())
  @Post('introspect')
  tokenInfo(
    @Body() data: IntrospectDto,
  ) {
    return this.service.verifyToken(data.token, data.token_type_hint);
  }

  /**
   * /oauth2/revoke endpoint
   * revoke an issued access/refresh token
   * @param data
   */
  @UseGuards(ClientAuthGuard())
  @HttpCode(200)
  @Post('revoke')
  async revokeToken(
    @Body() data: IntrospectDto,
  ) {
    const { token } = await this.service.decryptToken(data.token, data.token_type_hint);
    if (token) {
      await this.service.revokeToken(token);
      return null;
    }
    throw OAuthException.invalidRequest('token');
  }
}
