import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema, PromoCodeUsage, PromoCodeUsageSchema } from './schema';
import { PromoCode, PromoCodeSchema } from '../promo-codes/schema';
import { User, UserSchema } from '../users/schema';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: PromoCodeUsage.name, schema: PromoCodeUsageSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
})
export class OrdersModule {}
