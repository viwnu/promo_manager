import { AnalyticsColumn, ClickHouseInitQuery } from './types';
import { PromoCode } from '../../../promo-codes/schema';

export const PROMO_CODE_FIELD_MAP = {
  id: { key: 'promo_code_id', type: 'String' },
  code: { key: 'code', type: 'String' },
} satisfies Record<keyof Pick<PromoCode, 'id' | 'code'>, AnalyticsColumn>;

export const ANALYTICS_PROMO_CODES_FIELDS = {
  statsDate: { key: 'stats_date', type: 'Date' },
  usesCount: { key: 'uses_count', type: 'AggregateFunction(count, UInt64)' },
  uniqueUsers: { key: 'unique_users', type: 'AggregateFunction(uniqExact, String)' },
  revenueSum: { key: 'revenue_sum', type: 'AggregateFunction(sum, Decimal(18, 2))' },
  orderAmountMin: { key: 'order_amount_min', type: 'AggregateFunction(min, Decimal(18, 2))' },
  orderAmountMax: { key: 'order_amount_max', type: 'AggregateFunction(max, Decimal(18, 2))' },
  orderAmountAvg: { key: 'order_amount_avg', type: 'AggregateFunction(avg, Decimal(18, 2))' },
  discountSum: { key: 'discount_sum', type: 'AggregateFunction(sum, Decimal(18, 2))' },
  discountMin: { key: 'discount_min', type: 'AggregateFunction(min, Decimal(18, 2))' },
  discountMax: { key: 'discount_max', type: 'AggregateFunction(max, Decimal(18, 2))' },
  discountAvg: { key: 'discount_avg', type: 'AggregateFunction(avg, Decimal(18, 2))' },
} as const satisfies Record<string, AnalyticsColumn>;

export const ANALYTICS_PROMO_CODES_TABLE_NAME = 'analytics_promo_codes';
export const MV_ANALYTICS_PROMO_CODES_NAME = 'mv_analytics_promo_codes';

export const ANALYTICS_PROMO_CODES_QUERY: ClickHouseInitQuery = {
  name: ANALYTICS_PROMO_CODES_TABLE_NAME,
  sql: `
DROP VIEW IF EXISTS ${MV_ANALYTICS_PROMO_CODES_NAME};
DROP TABLE IF EXISTS ${ANALYTICS_PROMO_CODES_TABLE_NAME};
CREATE TABLE IF NOT EXISTS ${ANALYTICS_PROMO_CODES_TABLE_NAME} (
  ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key} ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.type},
  ${PROMO_CODE_FIELD_MAP.id.key} ${PROMO_CODE_FIELD_MAP.id.type},
  ${PROMO_CODE_FIELD_MAP.code.key} ${PROMO_CODE_FIELD_MAP.code.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.key} ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key} ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.revenueSum.key} ${ANALYTICS_PROMO_CODES_FIELDS.revenueSum.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMin.key} ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMin.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMax.key} ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMax.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountAvg.key} ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountAvg.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.discountSum.key} ${ANALYTICS_PROMO_CODES_FIELDS.discountSum.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.discountMin.key} ${ANALYTICS_PROMO_CODES_FIELDS.discountMin.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.discountMax.key} ${ANALYTICS_PROMO_CODES_FIELDS.discountMax.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.discountAvg.key} ${ANALYTICS_PROMO_CODES_FIELDS.discountAvg.type}
)
ENGINE = AggregatingMergeTree
PARTITION BY toYYYYMM(${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key})
ORDER BY (${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key}, ${PROMO_CODE_FIELD_MAP.id.key})
SETTINGS index_granularity = 8192
`,
};
