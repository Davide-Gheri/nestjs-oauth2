import { Controller, Get } from '@nestjs/common';
import { OpenIdService } from '../services';
import { JwtService } from '@app/lib/jwt';

@Controller('.well-known')
export class WellKnownController {
  constructor(
    private readonly openIdService: OpenIdService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('openid-configuration')
  getOpenIdConfig() {
    return this.openIdService.getConfig();
  }

  @Get('jwks.json')
  getJwks() {
    return this.jwtService.jwks(undefined, 'public');
  }
}
