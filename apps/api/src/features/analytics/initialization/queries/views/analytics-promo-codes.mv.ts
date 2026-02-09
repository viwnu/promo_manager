import { ClickHouseInitQuery } from '../types';
import { ANALYTICS_PROMO_CODES_FIELDS, PROMO_CODE_FIELD_MAP } from '../analytics-promo-codes.query';
import { PROMO_CODE_USAGE_FIELD_MAP } from '../raw-promo-code-usage.query';

export const ANALYTICS_PROMO_CODES_MV_QUERY: ClickHouseInitQuery = {
  name: 'mv_analytics_promo_codes',
  sql: `
DROP VIEW IF EXISTS mv_analytics_promo_codes;
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_analytics_promo_codes
TO analytics_promo_codes
AS
SELECT
  toDate(${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key},
  ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key} AS ${PROMO_CODE_FIELD_MAP.id.key},
  code AS ${PROMO_CODE_FIELD_MAP.code.key},
  countState() AS ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.key},
  uniqExactState(${PROMO_CODE_USAGE_FIELD_MAP.userId.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key},
  sumState(${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.revenueSum.key},
  minState(${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMin.key},
  maxState(${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMax.key},
  avgState(${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountAvg.key},
  sumState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountSum.key},
  minState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountMin.key},
  maxState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountMax.key},
  avgState(${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountAvg.key}
FROM raw_promo_code_usage
GROUP BY ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key}, ${PROMO_CODE_FIELD_MAP.id.key}, ${PROMO_CODE_FIELD_MAP.code.key}
`,
};
