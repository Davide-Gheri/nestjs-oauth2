import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { User } from '@app/entities';

/**
 * Specify how to serialize user data on the session cookie
 */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  /**
   * Serialize only the user id
   * @param user
   * @param done
   */
  serializeUser(user: any, done: (err: Error | null, data?: any) => void): any {
    done(null, user.id);
  }

  /**
   * Retrieve the entire user from the db
   * @param payload
   * @param done
   */
  async deserializeUser(payload: any, done: (err: Error | null, data?: any) => void): Promise<any> {
    const user = await this.userRepository.findOne(payload);
    if (!user) {
      return done(new NotFoundException('User not found'));
    }
    done(null, plainToClass(User, user));
  }
}
