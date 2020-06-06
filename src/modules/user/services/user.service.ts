import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {}

  async findAndAuthenticate({ email, password }: Partial<User>) {
    const user = await this.repository.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('credentials does not match');
    }
    return user;
  }
}
