import { Controller, Get, Render, Req } from '@nestjs/common';
import { CurrentUser } from './modules/auth';
import { User } from './entities';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  getHello(
    @Req() req: Request,
    @CurrentUser() user?: User,
  ) {
    return {
      user,
      csrf: req.csrfToken(),
    }
  }
}
