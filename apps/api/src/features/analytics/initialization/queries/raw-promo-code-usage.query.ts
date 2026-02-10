import { UserIdentity } from '@app/auth/db';
import { PromoCodeUsage } from '../../../orders/schema';
import { User } from '../../../users/schema';
import { AnalyticsColumn, ClickHouseInitQuery } from './types';

export const PROMO_CODE_USAGE_FIELD_MAP = {
  promoCodeId: { key: 'promo_code_id', type: 'String' },
  userId: { key: 'user_id', type: 'String' },
  orderId: { key: 'order_id', type: 'String' },
  orderAmount: { key: 'order_amount', type: 'Decimal(18, 2)' },
  discountAmount: { key: 'discount_amount', type: 'Decimal(18, 2)' },
  createdAt: { key: 'used_at', type: 'DateTime' },
} as const satisfies Record<
  keyof Pick<PromoCodeUsage, 'promoCodeId' | 'userId' | 'createdAt' | 'orderId' | 'discountAmount'> | 'orderAmount',
  AnalyticsColumn
>;

export const PROMO_CODE_CODE_FIELD: AnalyticsColumn = { key: 'code', type: 'String' };
export const PROMO_CODE_USAGE_USER_FIELDS = {
  email: { key: 'email', type: 'String' },
  name: { key: 'name', type: 'String' },
  phone: { key: 'phone', type: 'String' },
} as const satisfies Record<keyof Pick<User, 'name' | 'phone'> | keyof Pick<UserIdentity, 'email'>, AnalyticsColumn>;

export const RAW_PROMO_CODE_USAGE_TABLE_NAME = 'raw_promo_code_usage';

export const RAW_PROMO_CODE_USAGE_TABLE: ClickHouseInitQuery = {
  name: RAW_PROMO_CODE_USAGE_TABLE_NAME,
  sql: `
DROP TABLE IF EXISTS ${RAW_PROMO_CODE_USAGE_TABLE_NAME};
CREATE TABLE IF NOT EXISTS ${RAW_PROMO_CODE_USAGE_TABLE_NAME} (
  ${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key} ${PROMO_CODE_USAGE_FIELD_MAP.createdAt.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key} ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.type},
  ${PROMO_CODE_CODE_FIELD.key} ${PROMO_CODE_CODE_FIELD.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.userId.key} ${PROMO_CODE_USAGE_FIELD_MAP.userId.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.orderId.key} ${PROMO_CODE_USAGE_FIELD_MAP.orderId.type},
  ${PROMO_CODE_USAGE_USER_FIELDS.email.key} ${PROMO_CODE_USAGE_USER_FIELDS.email.type},
  ${PROMO_CODE_USAGE_USER_FIELDS.name.key} ${PROMO_CODE_USAGE_USER_FIELDS.name.type},
  ${PROMO_CODE_USAGE_USER_FIELDS.phone.key} ${PROMO_CODE_USAGE_USER_FIELDS.phone.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key} ${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key} ${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.type}
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key})
ORDER BY (
  ${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key},
  ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key},
  ${PROMO_CODE_USAGE_FIELD_MAP.userId.key},
  ${PROMO_CODE_USAGE_FIELD_MAP.orderId.key}
)
SETTINGS index_granularity = 8192
`,
};
