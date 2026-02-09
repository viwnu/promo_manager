import { AnalyticsColumn, ClickHouseInitQuery } from './types';
import { PromoCode } from '../../../promo-codes/schema';

export const PROMO_CODE_FIELD_MAP = {
  id: { key: 'promo_code_id', type: 'String' },
  code: { key: 'code', type: 'String' },
} satisfies Record<keyof Pick<PromoCode, 'id' | 'code'>, AnalyticsColumn>;

export const ANALYTICS_PROMO_CODES_FIELDS = {
  statsDate: { key: 'stats_date', type: 'Date' },
  usesCount: { key: 'uses_count', type: 'UInt64' },
  revenue: { key: 'revenue', type: 'Decimal(18, 2)' },
  uniqueUsers: { key: 'unique_users', type: 'UInt64' },
  createdAt: { key: 'created_at', type: 'DateTime' },
} as const satisfies Record<string, AnalyticsColumn>;

export const ANALYTICS_PROMO_CODES_QUERY: ClickHouseInitQuery = {
  name: 'analytics_promo_codes',
  sql: `
DROP VIEW IF EXISTS mv_analytics_promo_codes;
DROP TABLE IF EXISTS analytics_promo_codes;
CREATE TABLE IF NOT EXISTS analytics_promo_codes (
  ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key} ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.type},
  ${PROMO_CODE_FIELD_MAP.id.key} ${PROMO_CODE_FIELD_MAP.id.type},
  ${PROMO_CODE_FIELD_MAP.code.key} ${PROMO_CODE_FIELD_MAP.code.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.key} ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.revenue.key} ${ANALYTICS_PROMO_CODES_FIELDS.revenue.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key} ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.type},
  ${ANALYTICS_PROMO_CODES_FIELDS.createdAt.key} ${ANALYTICS_PROMO_CODES_FIELDS.createdAt.type}
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key})
ORDER BY (${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key}, ${PROMO_CODE_FIELD_MAP.id.key})
SETTINGS index_granularity = 8192
`,
};
