import { Controller, Get, Render, Req, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, CurrentUser } from './modules/auth';
import { User } from './entities';
import { Request } from 'express';
import { classToPlain } from 'class-transformer';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { ForbiddenExceptionFilter } from '@app/modules/auth/filters';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    @InjectRolesBuilder()
    private rb: RolesBuilder,
    private readonly config: ConfigService,
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
      facebookLoginUrl: this.config.get('social.facebook.loginUrl')(encodeURIComponent('/')),
      googleLoginUrl: this.config.get('social.google.loginUrl')(encodeURIComponent('/')),
      appName: this.config.get('app.appName'),
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
    return this.homepage(req, user);
  }
}
