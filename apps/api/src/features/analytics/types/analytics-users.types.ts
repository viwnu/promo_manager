import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from '../initialization/queries/analytics-users.query';

export interface AnalyticsUserAggregatedStats {
  [USER_FIELD_MAP.id.key]: string;
  [USER_IDENTITY_FIELD_MAP.email.key]: string;
  [USER_FIELD_MAP.name.key]: string;
  [USER_FIELD_MAP.phone.key]: string;
  [ANALYTICS_FIELDS.ordersCount.key]: number;
  [ANALYTICS_FIELDS.ordersAmountSum.key]: string;
  [ANALYTICS_FIELDS.ordersAmountMin.key]: string;
  [ANALYTICS_FIELDS.ordersAmountMax.key]: string;
  [ANALYTICS_FIELDS.ordersAmountAvg.key]: string;
  [ANALYTICS_FIELDS.promoCodesUsed.key]: number;
  [ANALYTICS_FIELDS.promoCodesUnique.key]: number;
  [ANALYTICS_FIELDS.discountSum.key]: string;
  [ANALYTICS_FIELDS.discountMin.key]: string;
  [ANALYTICS_FIELDS.discountMax.key]: string;
  [ANALYTICS_FIELDS.discountAvg.key]: string;
}

export interface AnalyticsUsersAggregatedStatsResult {
  items: AnalyticsUserAggregatedStats[];
  total: number;
}

export type AnalyticsUsersDatePreset = 'today' | 'last7Days' | 'last30Days' | 'custom';

export interface AnalyticsUsersAggregatedStatsOptions {
  datePreset?: AnalyticsUsersDatePreset;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
  sortBy?: keyof AnalyticsUserAggregatedStats;
  sortDir?: 'asc' | 'desc';
  filter?: {
    userId?: string;
    email?: string;
    name?: string;
    phone?: string;
    search?: string;
  };
}
