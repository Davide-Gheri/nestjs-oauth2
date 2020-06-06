import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { MAIL_QUEUE } from '../constants';
import { Queue } from 'bull';
import { User } from '@app/entities';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue,
  ) {}

  /**
   * Enqueue a Welcome email
   * @param payload
   */
  async sendUserWelcome(payload: { user: User, idHash: string; emailHash: string }) {
    try {
      await this.mailQueue.add('user-welcome', payload);
      return true;
    } catch (e) {
      return false;
    }
  }
}
