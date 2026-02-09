import { AnalyticsColumn, ClickHouseInitQuery } from './types';
import { User } from '../../../users/schema';
import { UserIdentity } from '@app/auth/db';

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
  ordersCount: { key: 'orders_count', type: 'UInt64' },
  ordersAmount: { key: 'orders_amount', type: 'Decimal(18, 2)' },
  promoCodesUsed: { key: 'promo_codes_used', type: 'UInt64' },
  createdAt: { key: 'created_at', type: 'DateTime' },
} as const satisfies Record<string, AnalyticsColumn>;

export const ANALYTICS_USERS_QUERY: ClickHouseInitQuery = {
  name: 'analytics_users',
  sql: `
DROP VIEW IF EXISTS mv_analytics_users;
DROP TABLE IF EXISTS analytics_users;
CREATE TABLE IF NOT EXISTS analytics_users (
  ${ANALYTICS_FIELDS.statsDate.key} ${ANALYTICS_FIELDS.statsDate.type},
  ${USER_FIELD_MAP.id.key} ${USER_FIELD_MAP.id.type},
  ${USER_IDENTITY_FIELD_MAP.email.key} ${USER_IDENTITY_FIELD_MAP.email.type},
  ${USER_FIELD_MAP.name.key} ${USER_FIELD_MAP.name.type},
  ${USER_FIELD_MAP.phone.key} ${USER_FIELD_MAP.phone.type},
  ${ANALYTICS_FIELDS.ordersCount.key} ${ANALYTICS_FIELDS.ordersCount.type},
  ${ANALYTICS_FIELDS.ordersAmount.key} ${ANALYTICS_FIELDS.ordersAmount.type},
  ${ANALYTICS_FIELDS.promoCodesUsed.key} ${ANALYTICS_FIELDS.promoCodesUsed.type},
  ${ANALYTICS_FIELDS.createdAt.key} ${ANALYTICS_FIELDS.createdAt.type}
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(${ANALYTICS_FIELDS.statsDate.key})
ORDER BY (${ANALYTICS_FIELDS.statsDate.key}, ${USER_FIELD_MAP.id.key})
SETTINGS index_granularity = 8192
`,
};
