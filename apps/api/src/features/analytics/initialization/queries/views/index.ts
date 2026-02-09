import { ClickHouseInitQuery } from '../types';
import { ANALYTICS_PROMO_CODES_MV_QUERY } from './analytics-promo-codes.mv';
import { ANALYTICS_USERS_MV_QUERY } from './analytics-users.mv';

export * from './analytics-users.mv';
export * from './analytics-promo-codes.mv';

export const MV_TABLES_QUERIES: ReadonlyArray<ClickHouseInitQuery> = [
  ANALYTICS_USERS_MV_QUERY,
  ANALYTICS_PROMO_CODES_MV_QUERY,
];
