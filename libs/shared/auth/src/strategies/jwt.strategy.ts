import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtPayloadDTO, UserIdentityDTO } from '../dto/input';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new ConfigService().get('AUTH_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDTO): Promise<UserIdentityDTO> {
    return { id: payload.sub, email: payload.email };
  }
}
