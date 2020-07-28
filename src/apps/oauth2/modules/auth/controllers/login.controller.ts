import { Controller, Req, UseGuards, Post, Body, Query, Res, Session, Get, Render } from '@nestjs/common';
import { Request, Response } from 'express';
import { GuestGuard, LoginGuard, TfaGuard } from '../guards';
import { LoginDto } from '../dtos';
import { handleSuccessLogin } from '@app/modules/auth/utils';
import { ConfigService } from '@nestjs/config';

@UseGuards(GuestGuard)
@Controller('auth')
export class LoginController {
  constructor(
    private readonly config: ConfigService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('login')
  handleLogin(
    @Body() data: LoginDto,
    @Session() session: any,
    @Query('redirect_uri') intended: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return handleSuccessLogin(
      req, res, intended, !!data.remember,
    );
  }

  @UseGuards(TfaGuard)
  @Post('tfa')
  handle2Fa(
    @Body() data: { remember: any },
    @Session() session: any,
    @Req() req: Request,
    @Query('redirect_uri') intended: string,
    @Res() res: Response,
  ) {
    return handleSuccessLogin(
      req, res, intended, !!data.remember,
    );
  }

  @Get('login')
  @Render('index')
  showLoginForm(
    @Req() req: Request,
    @Query('redirect_uri') intended: string,
  ) {
    return {
      csrfToken: req.csrfToken(),
      facebookLoginUrl: this.config.get('social.facebook.loginUrl')(
        encodeURIComponent(intended || '/'),
        this.config.get('app.appUrl'),
      ),
      googleLoginUrl: this.config.get('social.google.loginUrl')(
        encodeURIComponent(intended || '/'),
        this.config.get('app.appUrl'),
      ),
    }
  }
}
