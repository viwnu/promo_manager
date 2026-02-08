import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../../features/promo-codes/schema';

export async function createPromoCode(promoCodeModel: Model<PromoCodeDocument>, promoCode: Partial<PromoCode>) {
  const existing = await promoCodeModel.findOne({ code: promoCode.code }).exec();
  if (existing) return existing;
  return await new promoCodeModel(promoCode).save();
}
