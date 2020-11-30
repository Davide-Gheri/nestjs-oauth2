import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
   * @param data
   * @param done
   */
  serializeUser(data: User, done: (err: Error | null, data?: string) => void): any {
    done(null, data.id);
  }

  /**
   * Retrieve the entire user from the db
   * @param payload
   * @param done
   */
  async deserializeUser(payload: string, done: (err: Error | null, data?: any) => void): Promise<any> {
    const user = await this.userRepository.findOne(payload);
    if (!user) {
      return done(new ForbiddenException('User not found'));
    }
    done(null, plainToClass(User, user));
  }
}
