import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './db';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from '@app/logger';
import { UsersModule } from './features/users/users.module';
import { PromoCodesModule } from './features/promo-codes/promo-codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.api.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(MongooseConfigService()),
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'static'),
            // serveRoot: '/static',
          }),
        ]
      : []),
    LoggerModule,
    UsersModule,
    PromoCodesModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
