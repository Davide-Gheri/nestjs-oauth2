import { forwardRef, HttpService, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { UserService } from '@app/modules/user/services';
import { Request } from 'express';
import { User } from '@app/entities';
import qs from 'querystring';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@app/lib/jwt';

export interface GoogleUserData {
  sub: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
  name: string;
  [key: string]: any;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async authenticate(req: Request) {
    let user: User;

    const { code } = req.query;

    if (!code) {
      return this.fail({ message: 'Invalid callback' }, 400);
    }

    try {
      const { data: { id_token } } = await this.httpService.post(
        this.config.get('social.google.tokenUrl'),
        qs.stringify({
          client_id: this.config.get('social.google.id'),
          client_secret: this.config.get('social.google.secret'),
          redirect_uri: 'http://localhost:4000/auth/social/google',
          scope: ['email', 'profile', 'openid'].join(' '),
          code: code as string,
          grant_type: 'authorization_code',
        }),
      ).toPromise();
      const data = this.jwtService.decode<GoogleUserData>(id_token);

      let user: User;
      user = await this.userService.findFromSocial('google', data.sub, data.email);
      if (!user) {
        user = await this.userService.createFromSocial({
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          nickname: data.name,
        }, {
          picture: data.picture,
          socialId: data.sub,
          type: 'google',
        });
      }
      const info = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        createdAt: Date.now(),
        social: 'google',
      };
      return this.success(user, info);
    } catch (e) {
      return this.error(e);
    }
  }
}
