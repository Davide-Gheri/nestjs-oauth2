import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthClient } from '@app/entities';
import { Repository } from 'typeorm';
import { ClientCredentials, CredentialTuple } from '@app/modules/oauth2/interfaces';
import { OAuthException } from '@app/modules/oauth2/errors';
import { TokenAuthMethod } from '@app/modules/oauth2/constants';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class ClientService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(OAuthClient)
    private readonly clientRepository: Repository<OAuthClient>,
  ) {}

  public async getClient({ clientId, clientSecret, type }: ClientCredentials, validateSecret = true): Promise<OAuthClient> {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      this.logger.warn(`Client ${clientId} not found`);
      throw OAuthException.invalidClient();
    }
    if (validateSecret || type === TokenAuthMethod.client_secret_basic) {
      if (!client.canHandleAuthMethod(type)) {
        this.logger.warn(`Client does not support token_endpoint_auth_method ${type}`);
        throw OAuthException.invalidClient(`Unsupported auth method ${type}`);
      }
      if (type !== TokenAuthMethod.none && (clientSecret !== client.secret || !clientSecret)) {
        this.logger.warn(`Client secret does not match`);
        throw OAuthException.invalidClient();
      }
    }
    return client;
  }

  public getClientCredentials({ client_id, client_secret }: { client_id: string; client_secret?: string }, headers?: IncomingHttpHeaders ): ClientCredentials {
    if (headers) {
      const [basicAuthUser, basicAuthPassword] = this.getBasicAuthCredentials(headers);
      if (basicAuthUser) {
        return {
          clientId: basicAuthUser,
          clientSecret: basicAuthPassword,
          type: TokenAuthMethod.client_secret_basic,
        }
      }
    }
    if (!client_id) {
      throw OAuthException.invalidRequest('client_id');
    }
    return {
      clientId: client_id,
      clientSecret: client_secret,
      type: client_secret ? TokenAuthMethod.client_secret_post : TokenAuthMethod.none,
    }
  }

  protected getBasicAuthCredentials(headers: IncomingHttpHeaders): CredentialTuple {
    if (!headers.authorization) {
      return [null, null];
    }
    const header = headers.authorization!;
    if (!header.startsWith('Basic')) {
      return [null, null];
    }
    const token = header.substring(6);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (!decoded || decoded.indexOf(':') < 0) {
      return [null, null];
    }
    return decoded.split(':') as CredentialTuple;
  }
}
