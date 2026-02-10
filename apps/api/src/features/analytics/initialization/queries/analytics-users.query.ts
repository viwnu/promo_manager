import { AnalyticsColumn, ClickHouseInitQuery } from './types';
import { User } from '../../../users/schema';
import { UserIdentity } from '@app/auth/db';
export const MV_ANALYTICS_USERS_FROM_ORDERS_NAME = 'mv_analytics_users_from_orders';
export const MV_ANALYTICS_USERS_FROM_PROMO_USAGE_NAME = 'mv_analytics_users_from_promo_usage';

export const USER_FIELD_MAP = {
  id: { key: 'user_id', type: 'String' },
  name: { key: 'name', type: 'String' },
  phone: { key: 'phone', type: 'String' },
} satisfies Record<keyof Pick<User, 'id' | 'name' | 'phone'>, AnalyticsColumn>;

export const USER_IDENTITY_FIELD_MAP = {
  email: { key: 'email', type: 'String' },
} satisfies Record<keyof Pick<UserIdentity, 'email'>, AnalyticsColumn>;

export const ANALYTICS_FIELDS = {
  statsDate: { key: 'stats_date', type: 'Date' },
  ordersCount: { key: 'orders_count', type: 'AggregateFunction(count, UInt64)' },
  ordersAmountSum: { key: 'orders_amount_sum', type: 'AggregateFunction(sum, Decimal(18, 2))' },
  ordersAmountMin: { key: 'orders_amount_min', type: 'AggregateFunction(min, Decimal(18, 2))' },
  ordersAmountMax: { key: 'orders_amount_max', type: 'AggregateFunction(max, Decimal(18, 2))' },
  ordersAmountAvg: { key: 'orders_amount_avg', type: 'AggregateFunction(avg, Decimal(18, 2))' },
  promoCodesUsed: { key: 'promo_codes_used', type: 'AggregateFunction(count, UInt64)' },
  promoCodesUnique: { key: 'promo_codes_unique', type: 'AggregateFunction(uniqExact, String)' },
  discountSum: { key: 'discount_sum', type: 'AggregateFunction(sum, Decimal(18, 2))' },
  discountMin: { key: 'discount_min', type: 'AggregateFunction(min, Decimal(18, 2))' },
  discountMax: { key: 'discount_max', type: 'AggregateFunction(max, Decimal(18, 2))' },
  discountAvg: { key: 'discount_avg', type: 'AggregateFunction(avg, Decimal(18, 2))' },
} as const satisfies Record<string, AnalyticsColumn>;

export const ANALYTICS_USERS_TABLE_NAME = 'analytics_users';

export const ANALYTICS_USERS_QUERY: ClickHouseInitQuery = {
  name: ANALYTICS_USERS_TABLE_NAME,
  sql: `
DROP VIEW IF EXISTS ${MV_ANALYTICS_USERS_FROM_ORDERS_NAME};
DROP VIEW IF EXISTS ${MV_ANALYTICS_USERS_FROM_PROMO_USAGE_NAME};
DROP TABLE IF EXISTS ${ANALYTICS_USERS_TABLE_NAME};
CREATE TABLE IF NOT EXISTS ${ANALYTICS_USERS_TABLE_NAME} (
  ${ANALYTICS_FIELDS.statsDate.key} ${ANALYTICS_FIELDS.statsDate.type},
  ${USER_FIELD_MAP.id.key} ${USER_FIELD_MAP.id.type},
  ${USER_IDENTITY_FIELD_MAP.email.key} ${USER_IDENTITY_FIELD_MAP.email.type},
  ${USER_FIELD_MAP.name.key} ${USER_FIELD_MAP.name.type},
  ${USER_FIELD_MAP.phone.key} ${USER_FIELD_MAP.phone.type},
  ${ANALYTICS_FIELDS.ordersCount.key} ${ANALYTICS_FIELDS.ordersCount.type},
  ${ANALYTICS_FIELDS.ordersAmountSum.key} ${ANALYTICS_FIELDS.ordersAmountSum.type},
  ${ANALYTICS_FIELDS.ordersAmountMin.key} ${ANALYTICS_FIELDS.ordersAmountMin.type},
  ${ANALYTICS_FIELDS.ordersAmountMax.key} ${ANALYTICS_FIELDS.ordersAmountMax.type},
  ${ANALYTICS_FIELDS.ordersAmountAvg.key} ${ANALYTICS_FIELDS.ordersAmountAvg.type},
  ${ANALYTICS_FIELDS.promoCodesUsed.key} ${ANALYTICS_FIELDS.promoCodesUsed.type},
  ${ANALYTICS_FIELDS.promoCodesUnique.key} ${ANALYTICS_FIELDS.promoCodesUnique.type},
  ${ANALYTICS_FIELDS.discountSum.key} ${ANALYTICS_FIELDS.discountSum.type},
  ${ANALYTICS_FIELDS.discountMin.key} ${ANALYTICS_FIELDS.discountMin.type},
  ${ANALYTICS_FIELDS.discountMax.key} ${ANALYTICS_FIELDS.discountMax.type},
  ${ANALYTICS_FIELDS.discountAvg.key} ${ANALYTICS_FIELDS.discountAvg.type}
)
ENGINE = AggregatingMergeTree
PARTITION BY toYYYYMM(${ANALYTICS_FIELDS.statsDate.key})
ORDER BY (${ANALYTICS_FIELDS.statsDate.key}, ${USER_FIELD_MAP.id.key})
SETTINGS index_granularity = 8192
`,
};
