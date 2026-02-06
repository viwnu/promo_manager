import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy, JwtStrategy } from './strategies';
import { MongooseModule } from '@nestjs/mongoose';
import { UserIdentity, UserIdentitySchema } from './db';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forFeature([{ name: UserIdentity.name, schema: UserIdentitySchema }]),
    PassportModule,
    JwtModule.register({
      secret: new ConfigService().get('AUTH_SECRET'),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
