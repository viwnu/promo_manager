import { ClickHouseInitQuery } from '../types';
import { ANALYTICS_PROMO_CODES_FIELDS, PROMO_CODE_FIELD_MAP } from '../analytics-promo-codes.query';

export const ANALYTICS_PROMO_CODES_MV_QUERY: ClickHouseInitQuery = {
  name: 'mv_analytics_promo_codes',
  sql: `
DROP VIEW IF EXISTS mv_analytics_promo_codes;
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_analytics_promo_codes
TO analytics_promo_codes
AS
SELECT
  toDate(used_at) AS ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key},
  promo_code_id AS ${PROMO_CODE_FIELD_MAP.id.key},
  code AS ${PROMO_CODE_FIELD_MAP.code.key},
  count() AS ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.key},
  sum(discount_amount) AS ${ANALYTICS_PROMO_CODES_FIELDS.revenue.key},
  uniqExact(user_id) AS ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key},
  max(used_at) AS ${ANALYTICS_PROMO_CODES_FIELDS.createdAt.key}
FROM raw_promo_code_usage
GROUP BY ${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key}, ${PROMO_CODE_FIELD_MAP.id.key}, ${PROMO_CODE_FIELD_MAP.code.key}
`,
};
