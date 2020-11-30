import { forwardRef, HttpService, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { UserService } from '@app/modules/user/services';
import { Request } from 'express';
import { User } from '@app/entities';
import qs from 'querystring';
import { ConfigService } from '@nestjs/config';

export interface FacebookUserData {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  short_name: string;
  picture: {
    data: {
      url: string;
    }
  }
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
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
      const oauthUrl = new URL('/oauth/access_token', this.config.get('social.facebook.graphUrl'));
      oauthUrl.search = qs.stringify({
        client_id: this.config.get('social.facebook.id'),
        client_secret: this.config.get('social.facebook.secret'),
        redirect_uri: 'http://localhost:4000/auth/social/facebook',
        scope: ['email', 'public_profile'].join(','),
        code: code as string,
      });
      const { data: { access_token } } = await this.httpService.get(oauthUrl.toString()).toPromise();

      const fbUserUrl = new URL('/me', this.config.get('social.facebook.graphUrl'));
      fbUserUrl.search = qs.stringify({
        access_token,
        fields: ['id', 'email', 'first_name', 'last_name', 'picture{url}', 'short_name'].join(','),
        format: 'json',
      });
      const { data } = await this.httpService.get<FacebookUserData>(fbUserUrl.toString()).toPromise();

      let user: User;

      user = await this.userService.findFromSocial('facebook', data.id, data.email);
      if (!user) {
        user = await this.userService.createFromSocial({
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          nickname: data.short_name,
        }, {
          picture: data.picture.data.url,
          socialId: data.id,
          type: 'facebook',
        });
      }
      const info = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        createdAt: Date.now(),
        social: 'facebook',
      };
      return this.success(user, info);
    } catch (e) {
      return this.error(e);
    }
  }
}
