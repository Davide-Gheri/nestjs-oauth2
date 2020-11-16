import { Controller, Get, Render, Req, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, CurrentUser } from './modules/auth';
import { User } from './entities';
import { Request } from 'express';
import { classToPlain } from 'class-transformer';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { ForbiddenExceptionFilter } from '@app/modules/auth/filters';
import { RedisStore } from 'connect-redis';

@Controller()
export class AppController {
  constructor(
    @InjectRolesBuilder()
    private rb: RolesBuilder,
  ) {}

  @Get('/')
  @Render('index')
  homepage(
    @Req() req: Request,
    @CurrentUser() user?: User,
  ) {
    return {
      user: classToPlain(user),
      grants: this.rb.getGrants(),
      csrfToken: req.csrfToken(),
      currentSession: req.session?.id,
    }
  }

  @UseFilters(ForbiddenExceptionFilter)
  @UseGuards(AuthenticatedGuard)
  @Get('/app*')
  @Render('index')
  getApp(
    @Req() req: Request,
    @CurrentUser() user?: User,
  ) {
    return {
      grants: this.rb.getGrants(),
      user: classToPlain(user),
      csrfToken: req.csrfToken(),
      currentSession: req.session?.id,
    }
  }

  @Get('/sessions')
  getSessions(
    @Req() req: any,
  ) {
    const store = (req.sessionStore as RedisStore);

    return new Promise((resolve, reject) => {
      store.all((err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      })
    });
  }
}
