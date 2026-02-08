import { Prop, raw, Schema } from '@nestjs/mongoose';
import { MongooseSchemaFactory } from 'apps/api/src/db/schema';
import { HydratedDocument } from 'mongoose';

export type PromoCodeDocument = HydratedDocument<PromoCode>;

export type PromoCodeLimitType = {
  overall: number;
  perUser: number;
};

export type PromoCodeValidityPeriodType = {
  start?: Date;
  end?: Date;
};

@Schema()
export class PromoCode {
  @Prop({ unique: true, required: true })
  code: string; // - Уникальный код (например, "SUMMER2024")

  @Prop({ type: Number, min: 0, max: 100, required: true })
  discount: number; // - Процент скидки

  @Prop(
    raw({
      overall: { type: Number, min: 0, required: true },
      perUser: { type: Number, min: 0, required: true },
    }),
  )
  limit: PromoCodeLimitType; // - Лимиты использования (общий и на пользователя)

  @Prop(
    raw({
      start: { type: Date },
      end: { type: Date },
    }),
  )
  validityPeriod?: PromoCodeValidityPeriodType; // - Срок действия (опционально: дата начала и окончания)

  @Prop({ type: Boolean, required: true, default: true })
  active: boolean; // - Статус активности
}

export const PromoCodeSchema = MongooseSchemaFactory(PromoCode);
