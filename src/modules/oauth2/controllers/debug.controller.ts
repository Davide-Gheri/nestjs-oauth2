import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthClient } from '../../../entities';
import { Repository } from 'typeorm';

@Controller('debug')
export class DebugController {
  constructor(
    @InjectRepository(OAuthClient)
    private readonly clientRepository: Repository<OAuthClient>,
  ) {}

  @Get('clients')
  clients() {
    return this.clientRepository.find();
  }

  @Post('clients')
  createClient(
    @Body() data: any,
  ) {
    return this.clientRepository.save(
      this.clientRepository.create(data),
    );
  }
}
