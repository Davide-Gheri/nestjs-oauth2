import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import estimator from 'zxcvbn';
import { MailService } from '@app/modules/mail';
import { CipherService } from '@app/lib/cipher';
import { PasswordService } from '@app/modules/user/services/password.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly cipherService: CipherService,
    @InjectRepository(User)
    public readonly repository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async register(data: Partial<User>) {
    const passwordError = this.passwordService.checkPasswordStrength(data.password);
    if (passwordError) {
      throw new BadRequestException([passwordError]);
    }
    if ((await this.repository.count({ email: data.email })) > 0) {
      throw new BadRequestException(['Email already used']);
    }
    const user = await this.repository.save(
      this.repository.create({
        ...data,
        emailVerifiedAt: null,
      }),
    );
    if (this.config.get('app.shouldSendWelcomeEmail')) {
      await this.sendWelcomeEmail(user);
    }

    return user;
  }

  async sendWelcomeEmail(user) {
    const idHash = this.cipherService.farmHash(user.id);
    const emailHash = this.cipherService.farmHash(user.email);
    return this.mailService.sendUserWelcome({
      user,
      idHash: idHash.toString(),
      emailHash: emailHash.toString(),
    })
  }

  async verifyEmail(user: User, idHash: string, emailHash: string) {
    if (!this.cipherService.farmHashVerify(user.id, idHash) || !this.cipherService.farmHashVerify(user.email, emailHash)) {
      throw new UnauthorizedException();
    }
    if (user.emailVerifiedAt) {
      return true;
    }
    user.emailVerifiedAt = new Date();
    await this.repository.save(user);
    return true;
  }
}
