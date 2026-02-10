import { ANALYTICS_PROMO_CODES_QUERY } from './analytics-promo-codes.query';
import { ANALYTICS_USERS_QUERY } from './analytics-users.query';
import { RAW_ORDERS_TABLE } from './raw-orders.query';
import { RAW_PROMO_CODE_USAGE_TABLE } from './raw-promo-code-usage.query';
import { RAW_USERS_TABLE } from './raw-users.query';
import { ClickHouseInitQuery } from './types';

export * from './types';
export * from './analytics-promo-codes.query';
export * from './analytics-users.query';
export * from './raw-promo-code-usage.query';
export * from './raw-orders.query';
export { RAW_USERS_TABLE, RAW_USERS_FIELDS_MAP, RAW_USERS_TABLE_NAME } from './raw-users.query';

export const BASE_TABLES_QUERIES: ReadonlyArray<ClickHouseInitQuery> = [
  RAW_USERS_TABLE,
  RAW_ORDERS_TABLE,
  RAW_PROMO_CODE_USAGE_TABLE,
  ANALYTICS_USERS_QUERY,
  ANALYTICS_PROMO_CODES_QUERY,
];
