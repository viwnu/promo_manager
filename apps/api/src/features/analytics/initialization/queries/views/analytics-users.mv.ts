import { ClickHouseInitQuery } from '../types';
import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from '../analytics-users.query';

export const ANALYTICS_USERS_MV_QUERY: ClickHouseInitQuery = {
  name: 'mv_analytics_users',
  sql: `
DROP VIEW IF EXISTS mv_analytics_users;
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_analytics_users
TO analytics_users
AS
SELECT
  toDate(used_at) AS ${ANALYTICS_FIELDS.statsDate.key},
  user_id AS ${USER_FIELD_MAP.id.key},
  '' AS ${USER_IDENTITY_FIELD_MAP.email.key},
  '' AS ${USER_FIELD_MAP.name.key},
  '' AS ${USER_FIELD_MAP.phone.key},
  countDistinct(order_id) AS ${ANALYTICS_FIELDS.ordersCount.key},
  toDecimal64(0, 2) AS ${ANALYTICS_FIELDS.ordersAmount.key},
  count() AS ${ANALYTICS_FIELDS.promoCodesUsed.key},
  max(used_at) AS ${ANALYTICS_FIELDS.createdAt.key}
FROM raw_promo_code_usage
GROUP BY ${ANALYTICS_FIELDS.statsDate.key}, ${USER_FIELD_MAP.id.key}
`,
};
