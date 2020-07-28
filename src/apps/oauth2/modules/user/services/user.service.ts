import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialLogin, User } from '@app/entities';
import { Repository } from 'typeorm';
import { PasswordService } from '@app/modules/user/services/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
    @InjectRepository(SocialLogin)
    private readonly socialLoginRepository: Repository<SocialLogin>,
    private readonly passwordService: PasswordService,
  ) {}

  async findAndAuthenticate({ email, password }: Partial<User>) {
    const user = await this.repository.findOne({ email });
    if (!user || !user.password || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('credentials does not match');
    }
    return user;
  }

  async updateWithPassword(user: User, data: Partial<User & { passwordConfirm?: string; currentPassword: string }>) {
    const freshUser = await this.repository.findOne(user.id);
    if (data.password) {
      const passwordError = this.passwordService.checkPasswordStrength(data.password);
      if (passwordError) {
        throw new BadRequestException([passwordError]);
      }
      if (!data.currentPassword) {
        throw new BadRequestException(['missing current password']);
      }
      if (!(await freshUser.validatePassword(data.currentPassword))) {
        throw new BadRequestException(['wrong current password']);
      }
    }
    delete data.currentPassword;
    delete data.passwordConfirm;
    Object.assign(freshUser, data);

    return this.repository.save(freshUser);
  }

  async findFromSocial(socialType: string, socialUserId: string, email?: string) {
    const social = await this.socialLoginRepository.findOne({
      type: socialType,
      socialId: socialUserId,
    });
    if (social) {
      return await social.user;
    }
    if (email) {
      return await this.repository.findOne({ email });
    }
    return null;
  }

  async createFromSocial(data: Partial<User>, social: Partial<SocialLogin>): Promise<User> {
    return this.repository.manager.transaction(async entityManager => {
      const userRepo = entityManager.getRepository(User);
      const socialLoginRepo = entityManager.getRepository(SocialLogin);
      const user = await userRepo.save(
        userRepo.create(data)
      );

      await socialLoginRepo.save(
        socialLoginRepo.create({
          ...social,
          userId: user.id,
        })
      );

      return user;
    });
  }
}
