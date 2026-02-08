import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseSchemaFactory } from 'apps/api/src/db/schema';

export type PromoCodeUsageDocument = HydratedDocument<PromoCodeUsage>;

@Schema()
export class PromoCodeUsage {
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode', required: true })
  promoCodeId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  orderId: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  discountAmount: number;

  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date;
}

export const PromoCodeUsageSchema = MongooseSchemaFactory(PromoCodeUsage);
