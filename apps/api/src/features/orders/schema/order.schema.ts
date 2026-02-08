import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseSchemaFactory } from 'apps/api/src/db/schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop()
  promoCode?: string;

  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date;
}

export const OrderSchema = MongooseSchemaFactory(Order);
