import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClickHouseConfigService } from './config';
import { BackfillService } from './backfill.service';
import { PromoCode, PromoCodeSchema } from '../promo-codes/schema';
import { Order, OrderSchema, PromoCodeUsage, PromoCodeUsageSchema } from '../orders/schema';
import { User, UserSchema } from '../users/schema';

@Module({
  controllers: [],
  providers: [BackfillService],
  imports: [
    ClickHouseModule.registerAsync(ClickHouseConfigService()),
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: PromoCodeUsage.name, schema: PromoCodeUsageSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class AnalyticsModule {}
