import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenIdConfig } from '../open-id-config';

@Injectable()
export class OpenIdService {
  constructor(
    private readonly config: ConfigService,
  ) {}

  getConfig() {
    const appUrl = this.config.get('app.appUrl');
    const openIdConfig = new OpenIdConfig(appUrl);

    return openIdConfig;
  }
}
