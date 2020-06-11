import { Injectable } from '@nestjs/common';
import estimator from 'zxcvbn';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  constructor(
    private readonly config: ConfigService,
  ) {}

  checkPasswordStrength(pass: string) {
    const result = estimator(pass);
    if (result.score < this.config.get('app.security.minPasswordScore')) {
      return result.feedback.warning || result.feedback.suggestions[0];
    }
    return null;
  }
}
