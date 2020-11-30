import { registerAs } from '@nestjs/config';
import querystring from 'querystring';

export const social = registerAs('social', () => ({
  facebook: {
    id: process.env.FACEBOOK_ID,
    secret: process.env.FACEBOOK_SECRET,
    graphUrl: 'https://graph.facebook.com/v7.0/',
    loginUrl: (state: string, appUrl: string) => {
      const stringifiedParams = querystring.stringify({
        client_id: process.env.FACEBOOK_ID,
        redirect_uri: `${appUrl}/auth/social/facebook`,
        scope: ['email', 'public_profile'].join(','),
        response_type: 'code',
        state,
      });
      return `https://www.facebook.com/v7.0/dialog/oauth?${stringifiedParams}`;
    },
  },
  google: {
    id: process.env.GOOGLE_ID,
    secret: process.env.GOOGLE_SECRET,
    tokenUrl: 'https://oauth2.googleapis.com/token',
    loginUrl: (state: string, appUrl: string) => {
      const stringifiedParams = querystring.stringify({
        client_id: process.env.GOOGLE_ID,
        redirect_uri: `${appUrl}/auth/social/google`,
        scope: ['email', 'profile', 'openid'].join(' '),
        response_type: 'code',
        state,
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
    },
  }
}));
