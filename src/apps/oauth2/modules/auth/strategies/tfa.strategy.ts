import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { User } from '@app/entities';
import { UserService } from '@app/modules/user';
import { Request } from 'express';
import speakeasy from 'speakeasy';

@Injectable()
export class TfaStrategy extends PassportStrategy(Strategy, 'otp') {
  name = 'otp';

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async authenticate(req: Request) {
    let user: User;

    const { tfaSecret } = req.session;
    const { code: token } = req.body;

    if (!tfaSecret) {
      return this.fail({ message: 'Invalid session' }, 400);
    }
    if (!token) {
      return this.error(new BadRequestException('Missing OTP token'));
    }

    try {
      user = await this.userService.repository.findOneOrFail({ tfaSecret });
    } catch (e) {
      return this.fail({ message: 'User not found' }, 400);
    }
    const info = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      createdAt: Date.now(),
    };

    const verified = speakeasy.totp.verify({
      secret: tfaSecret,
      encoding: 'base32',
      token: token,
    });

    if (!verified) {
      return this.error(new BadRequestException('Invalid OTP token'))
    }

    return this.success(user, info);
  }
}
