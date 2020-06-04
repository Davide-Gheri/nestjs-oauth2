import { JwtService } from '@app/lib/jwt';
import { CipherService } from '@app/lib/cipher';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GrantInterface, GrantScanner } from '../modules/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthAccessToken, OAuthRefreshToken } from '@app/entities';
import { Repository } from 'typeorm';
import { TOKEN_STRATEGY, TokenStrategy } from '@app/modules/oauth2/modules/common/token';

@Injectable()
export abstract class OAuthService implements OnModuleInit {
  protected logger = new Logger(this.constructor.name);

  protected grants: GrantInterface[] = [];

  @Inject(JwtService)
  protected readonly jwtService: JwtService;

  @Inject(TOKEN_STRATEGY)
  protected readonly tokenStrategy: TokenStrategy;

  @Inject(CipherService)
  protected readonly cipherService: CipherService;

  @Inject(ConfigService)
  protected readonly config: ConfigService;

  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  constructor(
    @InjectRepository(OAuthAccessToken)
    protected readonly accessTokenRepository: Repository<OAuthAccessToken>,
    @InjectRepository(OAuthRefreshToken)
    protected readonly refreshTokenRepository: Repository<OAuthRefreshToken>,
  ) {}

  onModuleInit(): any {
    const scanner = new GrantScanner();
    const grantMap = scanner.scan(this.moduleRef);
    this.grants.push(...grantMap.values());
  }
}
