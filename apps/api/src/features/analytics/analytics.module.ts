import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClickHouseConfigService } from './config';
import { BackfillService } from './backfill.service';
import { AnalyticService } from './analytic.service';
import { AnalyticsController } from './analytics.controller';
import { PromoCodeAppliedHandler, PromoCodeCreatedHandler, UserCreatedHandler, UserUpdatedHandler } from './events';
import { PromoCode, PromoCodeSchema } from '../promo-codes/schema';
import { Order, OrderSchema, PromoCodeUsage, PromoCodeUsageSchema } from '../orders/schema';
import { User, UserSchema } from '../users/schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AnalyticsController],
  providers: [
    BackfillService,
    AnalyticService,
    UserCreatedHandler,
    UserUpdatedHandler,
    PromoCodeAppliedHandler,
    PromoCodeCreatedHandler,
  ],
  imports: [
    CqrsModule,
    ClickHouseModule.registerAsync(ClickHouseConfigService()),
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: PromoCodeUsage.name, schema: PromoCodeUsageSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
})
export class AnalyticsModule {}
