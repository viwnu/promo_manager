import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { CreateUserIdentityModel, JwtPayloadDTO, UserIdentityDTO } from './dto/input';
import { TokensDTO } from './dto/view';
import { UserIdentity, UserIdentityDocument } from './db';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserIdentity.name) private readonly userIdentityModel: Model<UserIdentity>,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: CreateUserIdentityModel): Promise<UserIdentityDTO | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user?.password);
    if (passwordValid) {
      return plainToInstance(UserIdentityDTO, user.toObject(), { excludeExtraneousValues: true });
    }
    return null;
  }

  /**
   * Return UserIdentityEntity with hashed password.
   * Throw ForbiddenException if user with passed email already exists.
   */
  async signup(createUserDto: CreateUserIdentityModel): Promise<UserIdentityDTO> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) throw new ForbiddenException('User already exists');
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    const user = await new this.userIdentityModel({ ...createUserDto, password: hashPassword }).save();
    return plainToInstance(UserIdentityDTO, user.toObject(), { excludeExtraneousValues: true });
  }

  async login(userIdentity: UserIdentityDTO): Promise<TokensDTO> {
    const payload: JwtPayloadDTO = { email: userIdentity.email, sub: userIdentity.id };
    return await this.updateTokens(payload);
  }

  async logout(userIdentity: UserIdentityDTO): Promise<void> {
    const user = await this.userIdentityModel.findById(userIdentity.id).exec();
    if (!user || !user.refreshToken) throw new UnauthorizedException('Unauthorized');
    user.refreshToken = null;
    await user.save();
  }

  async remove(userIdentity: UserIdentityDTO): Promise<void> {
    const user = await this.userIdentityModel.findById(userIdentity.id).exec();
    if (!user) throw new UnauthorizedException('User is not exists');
    await this.userIdentityModel.deleteOne({ _id: userIdentity.id });
  }

  async refreshTokens(refresh_token: string): Promise<TokensDTO> {
    const payload: JwtPayloadDTO = this.verifyToken(refresh_token);
    const user = await this.userIdentityModel.findOne({ email: payload.email, _id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    const validRefreshToken = user ? await bcrypt.compare(refresh_token, user.refreshToken) : false;
    if (!validRefreshToken) {
      throw new UnauthorizedException({
        message: 'Unauthorized - refreshToken is invalid',
      });
    }
    return await this.updateTokens(payload);
  }

  private async updateTokens(payload: JwtPayloadDTO): Promise<TokensDTO> {
    const tokens = this.createTokens(instanceToPlain(payload));
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 5);
    await this.userIdentityModel.findByIdAndUpdate(payload.sub, { refreshToken: hashedRefreshToken });
    return tokens;
  }

  private createTokens(payload: any): TokensDTO {
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  private verifyToken(token: string): JwtPayloadDTO {
    try {
      const payload = plainToInstance(JwtPayloadDTO, this.jwtService.verify(token), { excludeExtraneousValues: true });
      if (validateSync(payload).length > 0) throw new UnauthorizedException('Unauthorized');
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async findByEmail(email: string): Promise<UserIdentityDocument> {
    return await this.userIdentityModel.findOne({ email }).exec();
  }
}
