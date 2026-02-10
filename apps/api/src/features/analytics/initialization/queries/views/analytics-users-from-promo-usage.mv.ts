import { ClickHouseInitQuery } from '../types';
import {
  ANALYTICS_FIELDS,
  USER_FIELD_MAP,
  USER_IDENTITY_FIELD_MAP,
  ANALYTICS_USERS_TABLE_NAME,
  MV_ANALYTICS_USERS_FROM_PROMO_USAGE_NAME,
} from '../analytics-users.query';
import { PROMO_CODE_USAGE_FIELD_MAP, PROMO_CODE_USAGE_USER_FIELDS, RAW_PROMO_CODE_USAGE_TABLE_NAME } from '../raw-promo-code-usage.query';

export const ANALYTICS_USERS_FROM_PROMO_USAGE_MV_QUERY: ClickHouseInitQuery = {
  name: MV_ANALYTICS_USERS_FROM_PROMO_USAGE_NAME,
  sql: `
DROP VIEW IF EXISTS ${MV_ANALYTICS_USERS_FROM_PROMO_USAGE_NAME};
CREATE MATERIALIZED VIEW IF NOT EXISTS ${MV_ANALYTICS_USERS_FROM_PROMO_USAGE_NAME}
TO ${ANALYTICS_USERS_TABLE_NAME}
AS
SELECT
  toDate(${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key}) AS ${ANALYTICS_FIELDS.statsDate.key},
  ${PROMO_CODE_USAGE_FIELD_MAP.userId.key} AS ${USER_FIELD_MAP.id.key},
  ${PROMO_CODE_USAGE_USER_FIELDS.email.key} AS ${USER_IDENTITY_FIELD_MAP.email.key},
  ${PROMO_CODE_USAGE_USER_FIELDS.name.key} AS ${USER_FIELD_MAP.name.key},
  ${PROMO_CODE_USAGE_USER_FIELDS.phone.key} AS ${USER_FIELD_MAP.phone.key},
  countStateIf(0) AS ${ANALYTICS_FIELDS.ordersCount.key},
  sumStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.ordersAmountSum.key},
  minStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.ordersAmountMin.key},
  maxStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.ordersAmountMax.key},
  avgStateIf(toDecimal64(0, 2), 0) AS ${ANALYTICS_FIELDS.ordersAmountAvg.key},
  countState() AS ${ANALYTICS_FIELDS.promoCodesUsed.key},
  uniqExactState(${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key}) AS ${ANALYTICS_FIELDS.promoCodesUnique.key},
  sumState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_FIELDS.discountSum.key},
  minState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_FIELDS.discountMin.key},
  maxState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_FIELDS.discountMax.key},
  avgState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_FIELDS.discountAvg.key}
FROM ${RAW_PROMO_CODE_USAGE_TABLE_NAME}
GROUP BY ${ANALYTICS_FIELDS.statsDate.key}, ${USER_FIELD_MAP.id.key}, ${USER_IDENTITY_FIELD_MAP.email.key},
  ${USER_FIELD_MAP.name.key}, ${USER_FIELD_MAP.phone.key}
`,
};
