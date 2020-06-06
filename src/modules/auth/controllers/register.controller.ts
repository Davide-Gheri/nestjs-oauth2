import { Body, Controller, forwardRef, Get, Inject, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterDto } from '../dtos';
import { Request, Response } from 'express';
import { GuestGuard } from '../guards';
import { RegisterService } from '@app/modules/user';

@UseGuards(GuestGuard)
@Controller('auth')
export class RegisterController {
  constructor(
    @Inject(forwardRef(() => RegisterService))
    private readonly registerService: RegisterService,
  ) {}

  @Post('register')
  async handleRegister(
    @Body() data: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.registerService.register(data);
    await new Promise((resolve, reject) => req.login(user, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    }));
    res.redirect('/');
  }

  @Get('register')
  @Render('register')
  showRegisterForm(
    @Req() req: Request,
  ) {
    return {
      csrf: req.csrfToken(),
    }
  }
}
