import { AnalyticsColumn, ClickHouseInitQuery } from './types';

export const PROMO_CODE_USAGE_FIELD_MAP = {
  promoCodeId: { key: 'promo_code_id', type: 'String' },
  userId: { key: 'user_id', type: 'String' },
  orderId: { key: 'order_id', type: 'String' },
  discountAmount: { key: 'discount_amount', type: 'Decimal(18, 2)' },
  createdAt: { key: 'used_at', type: 'DateTime' },
} as const satisfies Record<string, AnalyticsColumn>;

export const PROMO_CODE_CODE_FIELD: AnalyticsColumn = { key: 'code', type: 'String' };

export const RAW_PROMO_CODE_USAGE_TABLE: ClickHouseInitQuery = {
  name: 'raw_promo_code_usage',
  sql: `
DROP TABLE IF EXISTS raw_promo_code_usage;
CREATE TABLE IF NOT EXISTS raw_promo_code_usage (
  ${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key} ${PROMO_CODE_USAGE_FIELD_MAP.createdAt.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key} ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.type},
  ${PROMO_CODE_CODE_FIELD.key} ${PROMO_CODE_CODE_FIELD.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.userId.key} ${PROMO_CODE_USAGE_FIELD_MAP.userId.type},
  ${PROMO_CODE_USAGE_FIELD_MAP.orderId.key} ${PROMO_CODE_USAGE_FIELD_MAP.orderId.type},
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
