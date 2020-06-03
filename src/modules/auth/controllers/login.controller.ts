import { Controller, Get, Req, UseGuards, Render, Post, Body, Query, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { GuestGuard, LoginGuard } from '../guards';
import { LoginDto } from '../dtos';
import { CurrentUser } from '../decorators';
import { User } from '@app/entities';

@UseGuards(GuestGuard)
@Controller('auth')
export class LoginController {
  @UseGuards(LoginGuard)
  @Post('login')
  handleLogin(
    @Body() data: LoginDto,
    @CurrentUser() user: User,
    @Session() session: any,
    @Query('redirect_uri') intended: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (data.remember) {
      session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      session.cookie.expires = false;
    }

    res.redirect(intended || '/');
  }

  @Get('login')
  @Render('login')
  showLoginForm(
    @Req() req: Request,
  ) {
    return {
      csrf: req.csrfToken(),
    }
  }
}
