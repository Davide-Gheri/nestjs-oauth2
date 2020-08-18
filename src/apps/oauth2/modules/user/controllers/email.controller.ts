import { Controller, Get, Param, Redirect, UseFilters, UseGuards } from '@nestjs/common';
import { SignedGuard } from '@app/lib/sign';
import { AuthenticatedGuard } from '@app/modules/auth/guards';
import { ForbiddenExceptionFilter } from '@app/modules/auth/filters';
import { RegisterService } from '../services';
import { CurrentUser } from '@app/modules/auth/decorators';
import { User } from '@app/entities';

@UseFilters(ForbiddenExceptionFilter)
@Controller('email')
export class EmailController {
  constructor(
    private readonly registerService: RegisterService,
  ) {}

  @UseGuards(SignedGuard, AuthenticatedGuard)
  @Redirect('/')
  @Get('confirm/:idHash/:emailHash')
  async verifyEmail(
    @CurrentUser() user: User,
    @Param('idHash') idHash: string,
    @Param('emailHash') emailHash: string,
  ) {
    await this.registerService.verifyEmail(user, idHash, emailHash);
    return null;
  }
}
