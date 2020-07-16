import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '@app/modules/user';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User } from '@app/entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TfaService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}

  private async generateSecret(user: User) {
    const secret = speakeasy.generateSecret({ length: 20 });
    try {
      user.tfaSecret = secret.base32;
      user.tfaEnabled = false;
      await this.userService.repository.save(user);
      return user;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('cannot generate 2fa secret');
    }
  }

  public async getQrCode(user: User) {
    if (!user.tfaSecret) {
      user = await this.generateSecret(user);
    }
    return qrcode.toDataURL(speakeasy.otpauthURL({
      secret: user.tfaSecret,
      encoding: 'base32',
      label: this.config.get('app.appName'),
    }));
  }

  public async verifyCode(user: User, code: string) {
    const verified = speakeasy.totp.verify({
      secret: user.tfaSecret,
      encoding: 'base32',
      token: code,
    });
    if (!verified) {
      throw new BadRequestException('Invalid code');
    }
    user.tfaEnabled = true;
    await this.userService.repository.save(user);

    return true;
  }

  public async disable(user: User) {
    user.tfaEnabled = false;
    user.tfaSecret = null;
    await this.userService.repository.save(user);

    return true;
  }
}
