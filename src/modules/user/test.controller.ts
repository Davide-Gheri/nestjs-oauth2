import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { Repository } from 'typeorm';
import { RegisterService } from './services';

@Controller('test')
export class TestController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly registerService: RegisterService,
  ) {}

  @Get()
  async test() {
    const user = await this.userRepo.findOne();
    await this.registerService.sendWelcomeEmail(user);
    return 'ok';
  }
}
