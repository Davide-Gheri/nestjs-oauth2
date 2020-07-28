import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class LogoutController {
  @Post('logout')
  handleLogout(
    @Req() req: Request,
    @Res() res: Response,
    @Body('redirect_uri') redirectTo: string,
    @Query('redirect_uri') redirectToQ: string,
  ) {
    req.logOut();
    res.redirect(redirectTo || redirectToQ || '/');
  }
}
