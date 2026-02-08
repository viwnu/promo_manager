import mongoose, { Model } from 'mongoose';
import { OrderDocument } from '../../features/orders/schema';

export async function createOrder(orderModel: Model<OrderDocument>, userId: mongoose.Types.ObjectId, amount: number) {
  return await new orderModel({ userId, amount }).save();
}
