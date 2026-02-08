import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema, PromoCodeUsage, PromoCodeUsageSchema } from './schema';
import { PromoCode, PromoCodeSchema } from '../promo-codes/schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: PromoCodeUsage.name, schema: PromoCodeUsageSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
    ]),
    UsersModule,
  ],
})
export class OrdersModule {}
