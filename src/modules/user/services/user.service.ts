import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';
import { PasswordService } from '@app/modules/user/services/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async findAndAuthenticate({ email, password }: Partial<User>) {
    const user = await this.repository.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
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
}
