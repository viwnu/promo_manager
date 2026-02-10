import mongoose, { Model } from 'mongoose';
import { PromoCodeUsageDocument } from '../../features/orders/schema';

export async function createPromoCodeUsage(
  promoCodeUsageModel: Model<PromoCodeUsageDocument>,
  promoCodeId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  orderId: mongoose.Types.ObjectId,
  discountAmount: number,
) {
  return await new promoCodeUsageModel({
    promoCode: promoCodeId,
    user: userId,
    order: orderId,
    discountAmount,
  }).save();
}
