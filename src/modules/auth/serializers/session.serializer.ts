import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { User } from '@app/entities';
import { SerializedSessionPayload, SessionPayload } from '@app/modules/auth/interfaces';

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
  serializeUser(data: SessionPayload, done: (err: Error | null, data?: SerializedSessionPayload) => void): any {
    done(null, {
      userId: data.user.id,
      info: data.info,
    });
  }

  /**
   * Retrieve the entire user from the db
   * @param payload
   * @param done
   */
  async deserializeUser(payload: SerializedSessionPayload, done: (err: Error | null, data?: any) => void): Promise<any> {
    const user = await this.userRepository.findOne(payload.userId);
    if (!user) {
      return done(new NotFoundException('User not found'));
    }
    done(null, plainToClass(User, user));
  }
}
