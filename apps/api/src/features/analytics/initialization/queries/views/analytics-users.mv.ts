import { ClickHouseInitQuery } from '../types';
import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from '../analytics-users.query';
import { RAW_ORDERS_FIELD_MAP } from '../raw-orders.query';

export const ANALYTICS_USERS_MV_QUERY: ClickHouseInitQuery = {
  name: 'mv_analytics_users_from_orders',
  sql: `
DROP VIEW IF EXISTS mv_analytics_users_from_orders;
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_analytics_users_from_orders
TO analytics_users
AS
SELECT
  toDate(${RAW_ORDERS_FIELD_MAP.createdAt.key}) AS ${ANALYTICS_FIELDS.statsDate.key},
  ${RAW_ORDERS_FIELD_MAP.userId.key} AS ${USER_FIELD_MAP.id.key},
  ${USER_IDENTITY_FIELD_MAP.email.key} AS ${USER_IDENTITY_FIELD_MAP.email.key},
  ${USER_FIELD_MAP.name.key} AS ${USER_FIELD_MAP.name.key},
  ${USER_FIELD_MAP.phone.key} AS ${USER_FIELD_MAP.phone.key},
  countState() AS ${ANALYTICS_FIELDS.ordersCount.key},
  sumState(${RAW_ORDERS_FIELD_MAP.amount.key}) AS ${ANALYTICS_FIELDS.ordersAmountSum.key},
  minState(${RAW_ORDERS_FIELD_MAP.amount.key}) AS ${ANALYTICS_FIELDS.ordersAmountMin.key},
  maxState(${RAW_ORDERS_FIELD_MAP.amount.key}) AS ${ANALYTICS_FIELDS.ordersAmountMax.key},
  avgState(${RAW_ORDERS_FIELD_MAP.amount.key}) AS ${ANALYTICS_FIELDS.ordersAmountAvg.key},
  countStateIf(0) AS ${ANALYTICS_FIELDS.promoCodesUsed.key},
  uniqExactStateIf('', 0) AS ${ANALYTICS_FIELDS.promoCodesUnique.key},
  sumStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.discountSum.key},
  minStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.discountMin.key},
  maxStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.discountMax.key},
  avgStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.discountAvg.key}
FROM raw_orders
GROUP BY ${ANALYTICS_FIELDS.statsDate.key}, ${USER_FIELD_MAP.id.key}, ${USER_IDENTITY_FIELD_MAP.email.key},
  ${USER_FIELD_MAP.name.key}, ${USER_FIELD_MAP.phone.key}
`,
};
