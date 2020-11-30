import { AbstractGrant, InjectableGrant } from '../../common';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { Request } from 'express';
import { TokenDto } from '@app/modules/oauth2/dto';
import { AccessTokenRequestResponse } from '@app/modules/oauth2/interfaces';

@InjectableGrant(GrantTypes.client_credentials)
export class ClientCredentialsServiceGrant extends AbstractGrant {
  async respondToAccessTokenRequest(req: Request, body: TokenDto): Promise<AccessTokenRequestResponse> {
    const client = await this.getClient(body, req);

    return this.connection.transaction(async em =>
      this.returnAccessTokenResponse({ em, client, body }),
    );
  }
}
