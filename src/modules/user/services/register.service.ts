import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import estimator from 'zxcvbn';
import { MailService } from '@app/modules/mail';
import { CipherService } from '@app/lib/cipher';

@Injectable()
export class RegisterService {
  constructor(
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly cipherService: CipherService,
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {}

  async register(data: Partial<User>) {
    const passwordError = this.checkPasswordStrength(data.password);
    if (passwordError) {
      throw new BadRequestException([passwordError]);
    }
    const user = await this.repository.save(
      this.repository.create({
        ...data,
        emailVerifiedAt: null,
      }),
    );
    await this.sendWelcomeEmail(user);

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

  checkPasswordStrength(pass: string) {
    const result = estimator(pass);
    if (result.score < this.config.get('app.security.minPasswordScore')) {
      return result.feedback.warning || result.feedback.suggestions[0];
    }
    return null;
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
