import { OAuthClient, User } from '@app/entities';
import { GrantTypes, ResponseModes, ResponseTypes } from './constants';

export class AuthRequest {
  public user: User;
  public approved: boolean = false;
  public readonly codeChallenge: any;
  public readonly codeChallengeMethod: any;
  public readonly grantTypeId: GrantTypes;
  public readonly client: OAuthClient;
  public readonly redirectUri: string;
  public scopes: string[];
  public readonly state: string;
  public readonly responseMode: ResponseModes = ResponseModes.query;
  public readonly responseType: ResponseTypes = ResponseTypes.code;

  constructor(partial: Partial<AuthRequest>) {
    Object.assign(this, partial);
  }
}
