import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { MAIL_QUEUE } from '../constants';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';
import { User } from '@app/entities';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { UrlSignService } from '@app/lib/sign';

@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly config: ConfigService,
    private readonly urlSignService: UrlSignService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Job ${job.name}:${job.id} started`)
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(`Job ${job.name}:${job.id} completed`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(`Job ${job.name} failed: ${error.message}`, error.stack);
  }

  /**
   * Process a Welcome email queued Job
   * @param job
   */
  @Process('user-welcome')
  sendInviteUserMail(job: Job<{ user: User, idHash: string; emailHash: string }>) {
    const uri = `/email/confirm/${job.data.idHash}/${job.data.emailHash}`;
    return this.mailService.sendMail({
      template: 'welcome',
      context: {
        ...plainToClass(User, job.data.user),
        link: this.urlSignService.sign(`${this.config.get('app.appUrl')}${uri}`),
      },
      subject: `Welcome to ${this.config.get('app.appName')}`,
      to: job.data.user.email,
    });
  }
}
