import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';
import { LoginDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
  ) {}

  /**
   * Authenticate a login request
   * Check if the user with the given credentials exists,
   * and that the given password matches the saved hashed password
   * @param credentials
   */
  async authenticate(credentials: LoginDto) {
    const user = await this.userRepository.findOne({ email: credentials.email });
    if (!user || !(await user.validatePassword(credentials.password))) {
      throw new UnauthorizedException('Email or password does not match');
    }
    return user;
  }
}
