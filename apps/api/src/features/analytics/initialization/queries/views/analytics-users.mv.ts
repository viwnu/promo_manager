import { ClickHouseInitQuery } from '../types';
import {
  ANALYTICS_FIELDS,
  USER_FIELD_MAP,
  USER_IDENTITY_FIELD_MAP,
  ANALYTICS_USERS_TABLE_NAME,
  MV_ANALYTICS_USERS_FROM_ORDERS_NAME,
} from '../analytics-users.query';
import { RAW_ORDERS_FIELD_MAP, RAW_ORDERS_TABLE_NAME } from '../raw-orders.query';

export const ANALYTICS_USERS_MV_QUERY: ClickHouseInitQuery = {
  name: MV_ANALYTICS_USERS_FROM_ORDERS_NAME,
  sql: `
DROP VIEW IF EXISTS ${MV_ANALYTICS_USERS_FROM_ORDERS_NAME};
CREATE MATERIALIZED VIEW IF NOT EXISTS ${MV_ANALYTICS_USERS_FROM_ORDERS_NAME}
TO ${ANALYTICS_USERS_TABLE_NAME}
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
FROM ${RAW_ORDERS_TABLE_NAME}
GROUP BY ${ANALYTICS_FIELDS.statsDate.key}, ${USER_FIELD_MAP.id.key}, ${USER_IDENTITY_FIELD_MAP.email.key},
  ${USER_FIELD_MAP.name.key}, ${USER_FIELD_MAP.phone.key}
`,
};
