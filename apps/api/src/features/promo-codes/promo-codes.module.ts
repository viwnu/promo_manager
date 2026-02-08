import { Module } from '@nestjs/common';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCode, PromoCodeSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  imports: [MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoCodeSchema }]), UsersModule],
})
export class PromoCodesModule {}
