import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@app/lib/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthClient, User } from '@app/entities';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OAuthClient)
    private readonly clientRepository: Repository<OAuthClient>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access_token',
      passReqToCallback: true,
    });

    (Strategy as any).JwtVerifier = (token, keyName, __, cb: (err: any, payload: any) => void) => {
      this.jwtService.verify(token, keyName)
        .then(payload => cb(null, payload))
        .catch(err => cb(err, null));
    }
  }

  async validate(req: Request, data: any) {
    const [id, target] = data.sub.split('@');

    req.accessToken = data;

    switch (target) {
      case 'users':
        return this.validateUser(req, id);
      case 'clients':
        return this.validateClient(req, id);
      default:
        throw new UnauthorizedException('invalid token');
    }
  }

  async validateUser(req: Request, id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return plainToClass(User, user);
  }

  async validateClient(req: Request, id: string) {
    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
