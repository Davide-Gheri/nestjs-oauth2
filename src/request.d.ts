// import { OAuthClient } from '@app/entities';

declare namespace Express {
  export interface Request {
    accessToken?: {
      sub: string;
      scopes: string[];
      aud: string;
      iss: string;
      jti: string;
    };
    client?: any;
  }
}
