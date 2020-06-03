import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';
import { RegisterDto } from '../dtos';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async register(data: RegisterDto) {
    // TODO create custom validators
    if (data.password !== data.passwordConfirm) {
      throw new BadRequestException('Password does not match');
    }
    await this.validatePasswordSecurity(data.password);

    const user = this.repository.create(data);
    return await this.repository.save(user); // TOSO send confirmation email
  }

  async validatePasswordSecurity(password: string) {
    return null;
  }
}
