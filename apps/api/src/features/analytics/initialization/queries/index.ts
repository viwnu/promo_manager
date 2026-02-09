import { ANALYTICS_PROMO_CODES_QUERY } from './analytics-promo-codes.query';
import { ANALYTICS_USERS_QUERY } from './analytics-users.query';
import { RAW_PROMO_CODE_USAGE_TABLE } from './raw-promo-code-usage.query';
import { ClickHouseInitQuery } from './types';

export * from './types';
export * from './analytics-users.query';
export * from './analytics-promo-codes.query';
export * from './raw-promo-code-usage.query';

export const BASE_TABLES_QUERIES: ReadonlyArray<ClickHouseInitQuery> = [
  RAW_PROMO_CODE_USAGE_TABLE,
  ANALYTICS_USERS_QUERY,
  ANALYTICS_PROMO_CODES_QUERY,
];
