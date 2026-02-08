import mongoose, { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import { UserIdentity, UserIdentityDocument, UserIdentitySchema } from '@app/auth/db';
import { User, UserDocument, UserSchema } from '../../features/users/schema';
import { PromoCode, PromoCodeDocument, PromoCodeSchema } from '../../features/promo-codes/schema';
import {
  Order,
  OrderDocument,
  OrderSchema,
  PromoCodeUsage,
  PromoCodeUsageDocument,
  PromoCodeUsageSchema,
} from '../../features/orders/schema';
import { ROLE } from '@app/auth/const';
import { createUser } from './create-user';
import { createPromoCode } from './create-promo-code';
import { createOrder } from './create-order';
import { createPromoCodeUsage } from './create-promo-code-usage';

dotenv.config({ path: `.env.api.${process.env.NODE_ENV}` });

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const userIdentityModel: Model<UserIdentityDocument> = mongoose.model(
    UserIdentity.name,
    UserIdentitySchema,
  ) as Model<UserIdentityDocument>;
  const userModel: Model<UserDocument> = mongoose.model(User.name, UserSchema) as Model<UserDocument>;
  const promoCodeModel: Model<PromoCodeDocument> = mongoose.model(PromoCode.name, PromoCodeSchema) as Model<PromoCodeDocument>;
  const orderModel: Model<OrderDocument> = mongoose.model(Order.name, OrderSchema) as Model<OrderDocument>;
  const promoCodeUsageModel: Model<PromoCodeUsageDocument> = mongoose.model(
    PromoCodeUsage.name,
    PromoCodeUsageSchema,
  ) as Model<PromoCodeUsageDocument>;

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const users = [];

  for (let i = 0; i < 10; i++) {
    users.push({ name: `SeedUser#${i}`, email: `seed_${i}@email.com`, password: 'my-strong-password' });
  }

  const admin = await createUser(userIdentityModel, userModel, 'Admin', 'admin@email.com', [ROLE.USER, ROLE.ADMIN]);
  const createdUsers = await Promise.all(
    users.map(async ({ email, name }) => await createUser(userIdentityModel, userModel, name, email)),
  );
  const allUsers = [admin, ...createdUsers].filter(Boolean);

  const promoCodes: PromoCodeDocument[] = [];
  const now = new Date();
  const expiredDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 10; i++) {
    const code = `PROMO_${i + 1}`;
    const promoCode = await createPromoCode(promoCodeModel, {
      code,
      discount: randomInt(5, 30),
      limit: { overall: 1000, perUser: 5 },
      validityPeriod: i === 1 ? { end: expiredDate } : undefined,
      active: i !== 0,
    });
    promoCodes.push(promoCode);
  }

  const activePromoCodes = promoCodes.filter(
    (promoCode) => promoCode.active && (!promoCode.validityPeriod?.end || promoCode.validityPeriod.end > now),
  );

  for (const user of allUsers) {
    const ordersCount = randomInt(0, 10);
    for (let i = 0; i < ordersCount; i++) {
      const amount = randomInt(10, 500);
      const order = await createOrder(orderModel, user._id, amount);

      if (activePromoCodes.length > 0 && Math.random() < 0.75) {
        const promoCode = activePromoCodes[randomInt(0, activePromoCodes.length - 1)];
        const discountAmount = Math.round((amount * promoCode.discount) / 100);
        await createPromoCodeUsage(promoCodeUsageModel, promoCode._id, user._id, order._id, discountAmount);
        order.promoCode = promoCode.code;
        await order.save();
      }
    }
  }

  await mongoose.disconnect();
  return;
}

seed();
