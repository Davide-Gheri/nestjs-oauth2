import { Injectable } from '@nestjs/common';
import { TokenStrategy } from './strategy';
import { JwtService } from '@app/lib/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy implements TokenStrategy {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  sign(payload: any): Promise<string> {
    return this.jwtService.sign({
      ...payload,
      iss: this.config.get('app.appUrl'),
    }, 'access_token');
  }

  verify<P = any>(encrypted: string): Promise<P> {
    return this.jwtService.verify(encrypted, 'access_token');
  }
}
