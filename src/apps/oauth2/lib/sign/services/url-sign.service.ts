import { Inject, Injectable } from '@nestjs/common';
import signed, { Signature, VerifyResult } from 'signed';
import { SIGN_OPTIONS } from '../constants';
import { SignModuleOptions } from '../interfaces';
import { Request } from 'express';

@Injectable()
export class UrlSignService {
  private signed: Signature;

  constructor(
    @Inject(SIGN_OPTIONS)
    private readonly options: SignModuleOptions,
  ) {
    this.signed = signed(options);
  }

  sign(url: string) {
    return this.signed.sign(url);
  }

  verifyReq(req: Request): VerifyResult {
    return this.signed.verifyUrl(req, req => req.connection.remoteAddress);
  }
}
